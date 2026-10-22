import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('site_build', Path(__file__).resolve().parents[1] / 'legacy_build.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class BuildTest(unittest.TestCase):
    def test_markdown_index_overrides_seed_and_preserves_metadata(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as temp:
            root = Path(temp)
            for name in ('index.html', 'app.js', 'style.css', 'config.json'):
                (root / name).write_text('{}', encoding='utf-8')
            notes = root / 'content/notes'
            notes.mkdir(parents=True)
            (root / 'content/notes.json').write_text('[{"id":"test","title":"old"}]', encoding='utf-8')
            (notes / 'test.md').write_text('<!-- study-garden: {"id":"test","title":"新笔记","course":"python","tags":["练习"]} -->\n\n# 内容\n\n<script>alert(1)</script>', encoding='utf-8')
            (notes / 'README.md').write_text('# Directory instructions', encoding='utf-8')
            previous = module.ROOT
            try:
                module.ROOT = root
                module.build()
            finally:
                module.ROOT = previous
            data = json.loads((root / 'dist/content/notes.json').read_text(encoding='utf-8'))
            self.assertEqual(len(data), 1)
            self.assertEqual(data[0]['title'], '新笔记')
            self.assertEqual(data[0]['course'], 'python')
            self.assertNotIn('study-garden:', data[0]['body'])
            self.assertTrue((root / 'dist/.nojekyll').exists())

if __name__ == '__main__':
    unittest.main()

