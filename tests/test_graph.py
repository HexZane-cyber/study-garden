from pathlib import Path
import importlib.util
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('hooks', Path(__file__).resolve().parents[1] / 'hooks.py')
hooks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hooks)

class GraphTest(unittest.TestCase):
    def test_relative_links_deduplicate_and_ignore_external_and_code(self):
        with tempfile.TemporaryDirectory(dir=Path(__file__).parent) as temp:
            root = Path(temp)
            (root / 'notes').mkdir()
            (root / 'index.md').write_text('# Home\n\n[note](notes/test.md)\n[note again](notes/test.md#section)\n[external](https://example.com/notes/test.md)', encoding='utf-8')
            (root / 'notes/test.md').write_text('# My Note\n\n[Home](../index.md)\n\n```markdown\n[fake](other.md)\n```', encoding='utf-8')
            data = hooks.graph_data(root)
            self.assertEqual(len(data['nodes']), 2)
            self.assertEqual(len(data['edges']), 1)
            note = next(n for n in data['nodes'] if n['id'] == 'notes/test.md')
            self.assertEqual(note['group'], 'note')
            self.assertEqual(note['url'], 'notes/test/')
            self.assertEqual(note['title'], 'My Note')

    def test_repository_graph_has_only_valid_endpoints(self):
        root = Path(__file__).resolve().parents[1] / 'docs'
        data = hooks.graph_data(root)
        ids = {n['id'] for n in data['nodes']}
        self.assertGreater(len(ids), 12)
        self.assertGreater(len(data['edges']), 20)
        self.assertTrue(all(e['source'] in ids and e['target'] in ids for e in data['edges']))

if __name__ == '__main__':
    unittest.main()
