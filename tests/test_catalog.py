from pathlib import Path
import importlib.util
import json
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('catalog_hooks', ROOT / 'hooks.py')
hooks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hooks)

class CatalogTest(unittest.TestCase):
    def test_feature_scripts_use_content_versions(self):
        import hashlib
        for page, names in {'dashboard': ['learning-model.js', 'planner-model.js', 'planner.js'],
                            'catalog': ['learning-model.js', 'learning.js'],
                            'graph': ['learning-model.js'],
                            'backup': ['learning-model.js', 'planner-model.js']}.items():
            html = (ROOT / 'site' / page / 'index.html').read_text(encoding='utf-8')
            for name in names:
                version = hashlib.sha256((ROOT / 'docs/assets' / name).read_bytes()).hexdigest()[:12]
                self.assertIn(name + '?v=' + version, html)

    def test_chip_catalog_escapes_script_closers_without_changing_titles(self):
        data = hooks.load_course_catalog(ROOT / 'docs')
        data['courses'][0]['title'] = '</script><script>alert(1)</script>'
        page = SimpleNamespace(file=SimpleNamespace(src_uri='graph.md'))
        with patch.object(hooks, 'load_course_catalog', return_value=data):
            context = hooks.on_page_context({}, page, {'docs_dir': ROOT / 'docs'}, None)
        self.assertNotIn('<', context['chip_courses'])
        self.assertEqual(json.loads(context['chip_courses'])['courses'][0]['title'], data['courses'][0]['title'])
        self.assertNotIn('learning_catalog', context)

    def test_catalog_guides_and_built_fallback(self):
        data = hooks.load_course_catalog(ROOT / 'docs')
        self.assertGreaterEqual(len(data['courses']), 37)
        self.assertTrue({'ic-process', 'ic-rf', 'ic-hdlbits', 'comm-inference', 'comm-receivers', 'comm-system-design'} <= {c['id'] for c in data['courses']})
        self.assertTrue({'comm-intro', 'comm-principles', 'comm-information', 'comm-wireless', 'comm-sdr'} <= {c['id'] for c in data['courses']})
        self.assertIn('信息通信基础', data['tracks'])
        self.assertTrue({'ee-devices', 'ic-digital', 'ic-analog', 'ic-fpga', 'ic-eda'} <= {c['id'] for c in data['courses']})
        self.assertIn('集成电路基础', data['tracks'])
        html = (ROOT / 'site/catalog/index.html').read_text(encoding='utf-8')
        self.assertIn('<table>', html)
        self.assertIn('预计总时长', html)
        self.assertIn('id="learning-data"', html)
        for course in data['courses']:
            self.assertLessEqual(course['totalHours'][0], course['totalHours'][1])
            built = (ROOT / 'site' / course['url'] / 'index.html').read_text(encoding='utf-8')
            self.assertIn('难度与学习时长', built)
            self.assertIn(f"{course['totalHours'][0]}–{course['totalHours'][1]} 小时", built)
            text = (ROOT / 'docs' / course['path']).read_text(encoding='utf-8')
            self.assertIn(course['official'], text)
            self.assertNotIn('待补充', text)
            self.assertIn('## 先修', text)
            self.assertIn('## 阶段验收', text)
        for name in ['index.html', 'chip/index.html', 'private/index.html']:
            self.assertNotIn('assets/learning.js', (ROOT / 'site' / name).read_text(encoding='utf-8'))
        for name in ['catalog/index.html', 'roadmap/index.html', 'courses/python/index.html']:
            text = (ROOT / 'site' / name).read_text(encoding='utf-8')
            self.assertLess(text.index('assets/learning-model.js'), text.index('assets/learning.js'))

    def test_invalid_dependencies_fail_the_build(self):
        data = hooks.load_course_catalog(ROOT / 'docs')
        with tempfile.TemporaryDirectory(dir=ROOT / 'tests') as temp:
            root = Path(temp)
            (root / 'assets').mkdir()
            for course in data['courses']:
                target = root / course['path']
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text('# test', encoding='utf-8')
            for invalid in [['missing-course'], [data['courses'][0]['id']]]:
                data['courses'][0]['prerequisites'] = invalid
                (root / 'assets/course-catalog.json').write_text(json.dumps(data), encoding='utf-8')
                with self.assertRaises(ValueError):
                    hooks.load_course_catalog(root)

    def test_invalid_workload_rejected(self):
        from copy import deepcopy
        data = hooks.load_course_catalog(ROOT / 'docs')
        for value in [None, [80, 20], [-1, 30], [10, True], [1], [10, '30']]:
            invalid = deepcopy(data)
            invalid['courses'][0]['totalHours'] = value
            with patch.object(hooks.json, 'loads', return_value=invalid):
                with self.assertRaisesRegex(ValueError, 'workload'):
                    hooks.load_course_catalog(ROOT / 'docs')
