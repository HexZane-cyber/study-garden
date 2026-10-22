"""Build the documentation site; use isolated local dependencies when installed."""
from pathlib import Path
import os
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
if __name__ == '__main__':
    env = os.environ.copy()
    deps = ROOT / '.deps'
    if deps.exists():
        env['PYTHONPATH'] = str(deps) + os.pathsep + env.get('PYTHONPATH', '')
    subprocess.run([sys.executable, '-m', 'mkdocs', 'build', '--strict'], cwd=ROOT, env=env, check=True)
