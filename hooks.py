"""Automatic note navigation, Markdown relation graph, and optional draft workspace."""
from pathlib import Path
from urllib.parse import unquote
import json
import posixpath
import re
import math
import hashlib
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent
ARTICLE_SECTIONS = {}
ASSET_VERSIONS = {}

def title(path):
    match = re.search(r'^#\s+(.+)$', path.read_text(encoding='utf-8'), re.MULTILINE)
    return match[1].strip() if match else path.stem

def graph_data(docs):
    docs = Path(docs)
    paths = sorted(docs.rglob('*.md'))
    nodes = []
    edges = set()
    known = {p.relative_to(docs).as_posix() for p in paths}
    for path in paths:
        rel = path.relative_to(docs).as_posix()
        group = 'course' if rel.startswith('courses/') else 'note' if rel.startswith('notes/') else 'tool' if rel.startswith('tools/') else 'guide'
        url = '' if rel == 'index.md' else rel[:-8] if rel.endswith('/index.md') else rel[:-3] + '/'
        nodes.append(dict(id=rel, title=title(path), group=group, url=url))
        text = re.sub(r'```[\s\S]*?```', '', path.read_text(encoding='utf-8'))
        for link in re.findall(r'(?<!!)\[[^\]]*\]\(([^\s)]+)', text):
            link = unquote(link.split('#')[0])
            if '://' in link or not link.endswith('.md'):
                continue
            target = posixpath.normpath(posixpath.join(posixpath.dirname(rel), link))
            if target in known and target != rel:
                edges.add(tuple(sorted((rel, target))))
    return dict(nodes=nodes, edges=[dict(source=a, target=b) for a, b in sorted(edges)])

def on_config(config):
    note_nav = next(item['我的笔记'] for item in config['nav'] if '我的笔记' in item)
    for path in sorted((Path(config['docs_dir']) / 'notes').rglob('*.md')):
        if path.name != 'index.md':
            note_nav.append({title(path): path.relative_to(config['docs_dir']).as_posix()})
    community_nav = next(item['社区课程'] for item in config['nav'] if '社区课程' in item)
    for path in sorted((Path(config['docs_dir']) / 'courses/community').glob('*.md')):
        if path.name != 'index.md':
            community_nav.append({title(path): path.relative_to(config['docs_dir']).as_posix()})
    return config

def on_pre_build(config):
    ARTICLE_SECTIONS.clear()
    ASSET_VERSIONS.clear()
    for name in ['learning-model.js', 'learning.js', 'planner-model.js', 'planner.js']:
        path = Path(config['docs_dir']) / 'assets' / name
        ASSET_VERSIONS[name] = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
    data = graph_data(config['docs_dir'])
    path = Path(config['docs_dir']) / 'assets/graph-data.json'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    published = {}
    for course in (Path(config['docs_dir']) / 'courses/community').glob('*.md'):
        text = course.read_text(encoding='utf-8')
        match = re.match(r'\A---\s*\n[\s\S]*?^submission_issue:\s*(\d+)\s*$[\s\S]*?^---\s*$', text, re.MULTILINE)
        if match:
            rel = course.relative_to(config['docs_dir']).as_posix()
            published[match[1]] = rel[:-3] + '/'
    (path.parent / 'published-courses.json').write_text(json.dumps(published, ensure_ascii=False), encoding='utf-8')

def on_files(files, config):
    from mkdocs.structure.files import File
    for name in ('index.html', 'style.css', 'app.js', 'config.json'):
        files.append(File.generated(config, 'workbench/' + name, abs_src_path=str(ROOT / name)))
    for path in (ROOT / 'content').glob('*.json'):
        files.append(File.generated(config, 'workbench/content/' + path.name, abs_src_path=str(path)))
    return files


def load_course_catalog(docs):
    data = json.loads((Path(docs) / 'assets/course-catalog.json').read_text(encoding='utf-8'))
    if data.get('version') != 1 or not isinstance(data.get('courses'), list):
        raise ValueError('Invalid course catalog')
    ids = set()
    for course in data['courses']:
        cid = course['id']
        if not re.fullmatch(r'[a-z0-9-]+', cid) or cid in ids:
            raise ValueError('Duplicate or invalid course ID')
        ids.add(cid)
        rel = course['path']
        if '..' in rel.split('/') or not rel.endswith('.md') or not (Path(docs) / rel).is_file():
            raise ValueError('Course guide is missing')
        if course['url'] != rel[:-3] + '/' or not course['official'].startswith('https://'):
            raise ValueError('Invalid course URL')
        total = course.get('totalHours')
        weekly = course.get('hours')
        if (not isinstance(total, list) or len(total) != 2
                or any(type(x) is not int or not 0 < x <= 2000 for x in total)
                or total[0] > total[1]
                or type(weekly) is not int or not 0 < weekly <= 40):
            raise ValueError('Invalid course workload estimate')
        if (course.get('level') not in {'入门', '基础', '进阶'}
                or not course.get('studyScope') or not course.get('difficultyNote')):
            raise ValueError('Missing course difficulty or estimate scope')
    dependencies = {c['id']: c['prerequisites'] for c in data['courses']}
    def visit(cid, stack):
        if cid in stack or cid not in ids:
            raise ValueError('Unknown or circular prerequisite')
        for parent in dependencies[cid]:
            visit(parent, stack | {cid})
    for cid in ids:
        visit(cid, set())
    for route in data['tracks'].values():
        if any(cid not in ids for cid in route) or len(route) != len(set(route)):
            raise ValueError('Invalid learning route')
    return data


def on_page_context(context, page, config, nav):
    data = load_course_catalog(config['docs_dir'])
    context['asset_versions'] = ASSET_VERSIONS
    if page.file.src_uri in {'graph.md', 'chip.md'}:
        context['chip_courses'] = json.dumps({'courses': [{key: course[key] for key in ('id', 'title', 'path', 'url', 'prerequisites')} for course in data['courses']]}, ensure_ascii=False).replace('<', r'\u003c')
    paths = {c['path'] for c in data['courses']} | {'catalog.md', 'roadmap.md', 'dashboard.md', 'backup.md'}
    if page.file.src_uri in paths:
        context['learning_catalog'] = json.dumps(data, ensure_ascii=False).replace('<', '\u003c')
    return context


def on_page_markdown(markdown, page, config, files):
    data = load_course_catalog(config['docs_dir'])
    if page.file.src_uri == 'catalog.md':
        lines = ['<details id="course-catalog-fallback" markdown="1"><summary>按列表浏览全部课程（无需脚本）</summary>', '', '| 课程 | 方向 | 难度 | 预计总时长 | 建议周投入 |', '| --- | --- | --- | --- | --- |']
        for c in data['courses']:
            low, high = c['totalHours']
            lines.append(f"| [{c['title']}]({c['path']}) | {c['category']} | {c['level']} | {low}–{high} 小时 | {c['hours']} 小时 |")
        lines.extend(['', '</details>'])
        return markdown.replace('<!-- course-catalog-fallback -->', '\n'.join(lines))
    course = next((c for c in data['courses'] if c['path'] == page.file.src_uri), None)
    if course:
        low, high = course['totalHours']
        weekly = course['hours']
        block = f'''## 难度与学习时长 {{ #study-effort }}

| 项目 | 本站建议 |
| --- | --- |
| 难度 | **{course['level']}**：{course['difficultyNote']} |
| 预计总投入 | **{low}–{high} 小时** |
| 建议周投入 | 每周约 **{weekly} 小时** |
| 按此节奏 | 约 **{math.ceil(low / weekly)}–{math.ceil(high / weekly)} 周**，不含暂停和假期 |
| 估算范围 | {course['studyScope']} |

时长是本站为安排自学所作的估算，包含阅读 / 听课、独立练习和复盘，不是视频总长度、官方课时或完成保证。默认已具备先修；英文阅读、补基础与反复调试可能增加投入。先记录两周的实际用时，再调整计划。难度按当前所选学习范围判断，不等同于学校年级或官方分级。

'''
        marker = '<div id="course-progress"></div>'
        return markdown.replace(marker, marker + '\n\n' + block, 1)
    return markdown


class ArticleHeadings(HTMLParser):
    """Read final Markdown-generated anchors, including duplicate and CJK headings."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sections = []
        self.current = None
        self.skip_permalink = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('h2', 'h3', 'h4', 'h5', 'h6') and attrs.get('id'):
            self.current = {'id': attrs['id'], 'level': int(tag[1]), 'text': []}
        if self.current and tag == 'a' and 'headerlink' in attrs.get('class', '').split():
            self.skip_permalink = True

    def handle_data(self, value):
        if self.current is not None and not self.skip_permalink:
            self.current['text'].append(value)

    def handle_endtag(self, tag):
        if tag == 'a':
            self.skip_permalink = False
        if self.current and tag == 'h' + str(self.current['level']):
            text = ' '.join(''.join(self.current['text']).split())
            if text:
                self.sections.append({'id': self.current['id'], 'title': text, 'level': self.current['level']})
            self.current = None
            self.skip_permalink = False


def on_page_content(html, page, config, files):
    headings = ArticleHeadings()
    headings.feed(html)
    ARTICLE_SECTIONS[page.file.src_uri] = headings.sections
    return html


def on_post_build(config):
    # Assets were copied before page rendering. Update both copies after every
    # article has its final anchors; never guess anchors from Markdown text.
    source = Path(config['docs_dir']) / 'assets/graph-data.json'
    data = json.loads(source.read_text(encoding='utf-8'))
    for node in data['nodes']:
        node['sections'] = ARTICLE_SECTIONS.get(node['id'], [])
    content = json.dumps(data, ensure_ascii=False, indent=2)
    source.write_text(content, encoding='utf-8')
    (Path(config['site_dir']) / 'assets/graph-data.json').write_text(content, encoding='utf-8')
