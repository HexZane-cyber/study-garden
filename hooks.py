"""Automatic note navigation, Markdown relation graph, and optional draft workspace."""
from pathlib import Path
from urllib.parse import unquote
import json
import posixpath
import re

ROOT = Path(__file__).resolve().parent

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
    paths = {c['path'] for c in data['courses']} | {'catalog.md', 'roadmap.md', 'dashboard.md', 'backup.md'}
    if page.file.src_uri in paths:
        context['learning_catalog'] = json.dumps(data, ensure_ascii=False).replace('<', '\u003c')
    return context


def on_page_markdown(markdown, page, config, files):
    if page.file.src_uri == 'catalog.md':
        data = load_course_catalog(config['docs_dir'])
        lines = ['<details id="course-catalog-fallback" markdown="1"><summary>按列表浏览全部课程（无需脚本）</summary>', '', '| 课程 | 方向 | 难度 |', '| --- | --- | --- |']
        for c in data['courses']:
            lines.append(f"| [{c['title']}]({c['path']}) | {c['category']} | {c['level']} |")
        lines.extend(['', '</details>'])
        return markdown.replace('<!-- course-catalog-fallback -->', '\n'.join(lines))
    return markdown
