from pathlib import Path
import importlib.util
import tempfile
import unittest
import json
from html.parser import HTMLParser

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

    def test_section_parser_uses_actual_ids_and_plain_titles(self):
        parser = hooks.ArticleHeadings()
        parser.feed('<h1 id="title">Page</h1><h2 id="_2">先修 <code>C &amp; C++</code><a class="headerlink" href="#_2">¶</a></h2><h3 id="same_1">重复标题</h3><h6 id="deep">Deep</h6><h2>No anchor</h2>')
        self.assertEqual(parser.sections, [
            {'id': '_2', 'title': '先修 C & C++', 'level': 2},
            {'id': 'same_1', 'title': '重复标题', 'level': 3},
            {'id': 'deep', 'title': 'Deep', 'level': 6},
        ])

    def test_published_chapter_links_resolve_to_built_heading_ids(self):
        root = Path(__file__).resolve().parents[1]
        data = json.loads((root / 'site/assets/graph-data.json').read_text(encoding='utf-8'))
        self.assertEqual(data, json.loads((root / 'docs/assets/graph-data.json').read_text(encoding='utf-8')))
        class IDs(HTMLParser):
            def __init__(self):
                super().__init__()
                self.headings = set()
            def handle_starttag(self, tag, attrs):
                if tag in ['h2', 'h3', 'h4', 'h5', 'h6']:
                    self.headings.add(dict(attrs).get('id'))
        for node in data['nodes']:
            html = (root / 'site' / node['url'] / 'index.html').read_text(encoding='utf-8')
            ids = IDs()
            ids.feed(html)
            self.assertTrue(all(section['id'] in ids.headings for section in node['sections']), node['id'])
        intro = next(n for n in data['nodes'] if n['id'] == 'courses/cs-intro.md')
        self.assertEqual(intro['sections'][0], {'id': 'study-effort', 'title': '难度与学习时长', 'level': 2})
        self.assertIn({'id': '_1', 'title': '课程信息', 'level': 2}, intro['sections'])
        self.assertTrue(any(section['title'] == '阶段验收' for section in intro['sections']))

    def test_repository_graph_has_only_valid_endpoints(self):
        root = Path(__file__).resolve().parents[1] / 'docs'
        data = hooks.graph_data(root)
        ids = {n['id'] for n in data['nodes']}
        self.assertGreater(len(ids), 12)
        self.assertGreater(len(data['edges']), 20)
        self.assertTrue(all(e['source'] in ids and e['target'] in ids for e in data['edges']))

if __name__ == '__main__':
    unittest.main()
