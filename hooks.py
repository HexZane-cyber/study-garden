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
    return config

def on_pre_build(config):
    data = graph_data(config['docs_dir'])
    path = Path(config['docs_dir']) / 'assets/graph-data.json'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

def on_files(files, config):
    from mkdocs.structure.files import File
    for name in ('index.html', 'style.css', 'app.js', 'config.json'):
        files.append(File.generated(config, 'workbench/' + name, abs_src_path=str(ROOT / name)))
    for path in (ROOT / 'content').glob('*.json'):
        files.append(File.generated(config, 'workbench/content/' + path.name, abs_src_path=str(path)))
    return files
