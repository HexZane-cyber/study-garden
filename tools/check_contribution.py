"""Read-only check: community PRs may add course articles, never execute their code."""
import os
from pathlib import Path, PurePosixPath
import re
import subprocess

def check_path(name):
    path = PurePosixPath(name)
    return (len(path.parts) == 4 and path.parts[:3] == ('docs', 'courses', 'community')
            and re.fullmatch(r'[a-z0-9][a-z0-9-]*\.md', path.name) is not None)

def validate_text(text):
    if len(text.encode('utf-8')) > 100_000:
        raise ValueError('Course article exceeds 100 KB.')
    if not re.search(r'^#\s+\S', text, re.MULTILINE):
        raise ValueError('A course title (# Title) is required.')
    if re.search(r'<\s*/?\s*[a-z!]|javascript\s*:|data\s*:', text, re.IGNORECASE):
        raise ValueError('Raw HTML and executable URL schemes are not allowed in course submissions.')

if __name__ == '__main__':
    if os.environ.get('PR_AUTHOR') == os.environ.get('REPO_OWNER') and os.environ.get('PR_AUTHOR'):
        print('Owner-maintained change; community scope restriction does not apply.')
    else:
        base, head = os.environ['BASE_SHA'], os.environ['HEAD_SHA']
        output = subprocess.check_output(['git', 'diff', '--name-status', '-z', '--no-renames', base, head])
        fields = output.decode('utf-8').split('\0')
        for i in range(0, len(fields)-1, 2):
            status, name = fields[i:i+2]
            if status != 'A' or not check_path(name):
                raise SystemExit(f'Community contributions must add new docs/courses/community/*.md articles: {name}')
            validate_text(subprocess.check_output(['git', 'show', f'{head}:{name}']).decode('utf-8'))
        print('Community scope and Markdown checks passed. Maintainer review is still required.')
