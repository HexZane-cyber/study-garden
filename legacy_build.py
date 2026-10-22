"""Build the static site and index repository Markdown notes (standard library only)."""
from pathlib import Path
import json
import re
import shutil
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent

def build():
    out = ROOT / 'dist'
    out.mkdir(exist_ok=True)
    for name in ('index.html', 'style.css', 'app.js', 'config.json'):
        shutil.copyfile(ROOT / name, out / name)
    target = out / 'content'
    target.mkdir(exist_ok=True)
    for source in (ROOT / 'content').glob('*.json'):
        shutil.copyfile(source, target / source.name)
    notes = {n['id']: n for n in json.loads((ROOT / 'content/notes.json').read_text(encoding='utf-8'))}
    for path in sorted((ROOT / 'content/notes').glob('*.md')):
        if path.name == 'README.md':
            continue
        body = path.read_text(encoding='utf-8')
        metadata = {}
        if body.startswith('<!-- study-garden: '):
            first, _, rest = body.partition('\n')
            metadata = json.loads(first.removeprefix('<!-- study-garden: ').removesuffix(' -->'))
            body = rest.lstrip('\n')
        title = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
        note_id = metadata.get('id', path.stem)
        notes[note_id] = dict(id=note_id, title=metadata.get('title', title[1] if title else path.stem),
                              body=body, course=metadata.get('course', ''), tags=metadata.get('tags', ['仓库笔记']),
                              updated=metadata.get('updated', datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).date().isoformat()))
    (target / 'notes.json').write_text(json.dumps(list(notes.values()), ensure_ascii=False, indent=2), encoding='utf-8')
    (out / '.nojekyll').touch()
    print(f'Built {len(notes)} notes into {out}')

if __name__ == '__main__':
    build()
