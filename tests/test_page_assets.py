"""Exercise built HTML so feature scripts remain scoped and resolve on Pages subpaths."""
from html.parser import HTMLParser
from pathlib import Path
import json
import hashlib
import re
import unittest
from urllib.parse import urljoin, urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
FEATURE_SCRIPTS = {
    'exercises/index.html': ['assets/practice-model.js', 'assets/practice.js', 'assets/local-ai-model.js', 'assets/local-ai.js'],
    'local-ai/index.html': ['assets/local-ai-model.js', 'assets/local-ai.js'],
    'graph/index.html': ['assets/graph-interaction.js', 'assets/learning-model.js', 'assets/chip-learning.js', 'assets/chip-model.js', 'assets/vendor/chip3d.bundle.js', 'assets/chip.js'],
    'chip/index.html': ['assets/graph-interaction.js', 'assets/learning-model.js', 'assets/chip-learning.js', 'assets/chip-model.js', 'assets/vendor/chip3d.bundle.js', 'assets/chip.js'],
    'contribute/index.html': ['assets/contribution-model.js', 'assets/community.js'],
    'private/index.html': ['assets/vendor/fflate.min.js', 'assets/vault-core.js', 'assets/vault-formats.js', 'assets/vault.js'],
    'review/index.html': ['assets/review-model.js', 'assets/review.js'],
}
ALL_FEATURE_SCRIPTS = {name for names in FEATURE_SCRIPTS.values() for name in names}


class Scripts(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.items = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == 'script':
            attrs = dict(attrs)
            if attrs.get('src'):
                self.items.append(attrs)


class PageAssetsTest(unittest.TestCase):
    def scripts(self, path):
        self.assertTrue((SITE / path).exists(), 'Build the site before running asset tests')
        base = 'https://example.test/study-garden/' + path.removesuffix('index.html')
        scripts = Scripts((SITE / path).read_text(encoding='utf-8')).items
        result = []
        for attrs in scripts:
            resolved = urlparse(urljoin(base, attrs['src']))
            if resolved.netloc != 'example.test':
                continue
            self.assertTrue(resolved.path.startswith('/study-garden/'), attrs['src'])
            name = resolved.path.removeprefix('/study-garden/')
            self.assertTrue((SITE / name).is_file(), f'Missing script: {name}')
            result.append((name, attrs))
        return result

    def test_article_pages_do_not_download_unrelated_features(self):
        for path in ['index.html', 'courses/python/index.html', 'library/index.html']:
            with self.subTest(page=path):
                scripts = [name for name, _ in self.scripts(path)]
                self.assertIn('assets/reading.js', scripts)
                self.assertIn('assets/site-tools.js', scripts)
                self.assertIn('assets/appearance.js', scripts)
                self.assertNotIn('data-md-component="source"', (SITE / path).read_text(encoding='utf-8'))
                self.assertFalse((ALL_FEATURE_SCRIPTS - {'assets/learning-model.js'}).intersection(scripts))

    def test_feature_dependencies_are_ordered_deferred_and_exclusive(self):
        for path, expected in FEATURE_SCRIPTS.items():
            with self.subTest(page=path):
                scripts = self.scripts(path)
                features = [(name, attrs) for name, attrs in scripts if name in ALL_FEATURE_SCRIPTS]
                self.assertEqual([name for name, _ in features], expected)
                for name, attrs in features:
                    self.assertIn('defer', attrs, name)
                    self.assertNotIn('async', attrs, name)

    def test_ai_runtime_is_opt_in(self):
        for path in ['index.html', 'exercises/index.html', 'local-ai/index.html']:
            scripts = [name for name, _ in self.scripts(path)]
            self.assertNotIn('assets/vendor/local-ai-runtime.bundle.js', scripts)
            self.assertNotIn('assets/vendor/local-ai-worker.bundle.js', scripts)
        html = (SITE / 'exercises/index.html').read_text(encoding='utf-8')
        self.assertIn('id="practice-data"', html)
        self.assertIn('data-public-base="https://hexzane-cyber.github.io/study-garden/"', html)
        self.assertIn('data-runtime="../assets/vendor/local-ai-runtime.bundle.js?v=', html)
        self.assertIn('data-worker="../assets/vendor/local-ai-worker.bundle.js?v=', html)

    def test_dashboard_only_downloads_review_model(self):
        scripts = [name for name, _ in self.scripts('dashboard/index.html')]
        self.assertIn('assets/review-model.js', scripts)
        self.assertNotIn('assets/review.js', scripts)

    def test_dashboard_reads_practice_without_loading_its_editor(self):
        html = (SITE / 'dashboard/index.html').read_text(encoding='utf-8')
        data = json.loads(re.search(r'<script type="application/json" id="practice-data">(.*?)</script>', html, re.S).group(1))
        expected = json.loads((ROOT / 'docs/assets/exercises.json').read_text(encoding='utf-8'))
        self.assertEqual(data, expected)
        self.assertNotIn('id="ai-course-data"', html)
        scripts = [name for name, _ in self.scripts('dashboard/index.html')]
        self.assertLess(scripts.index('assets/practice-model.js'), scripts.index('assets/planner.js'))
        for name in ['assets/practice.js', 'assets/local-ai.js', 'assets/local-ai-model.js', 'assets/vendor/local-ai-worker.bundle.js']:
            self.assertNotIn(name, scripts)

    def test_course_ai_context_contains_only_public_catalog_fields(self):
        catalog = json.loads((ROOT / 'docs/assets/course-catalog.json').read_text(encoding='utf-8'))
        fields = ('id', 'title', 'url', 'provider', 'category', 'level', 'summary', 'prerequisites')
        expected = {'courses': [{key: c[key] for key in fields} for c in catalog['courses']]}
        for page in ['exercises/index.html', 'local-ai/index.html']:
            html = (SITE / page).read_text(encoding='utf-8')
            payload = json.loads(re.search(r'<script type="application/json" id="ai-course-data">(.*?)</script>', html, re.S).group(1))
            self.assertEqual(payload, expected)
        for course in catalog['courses']:
            html = (SITE / course['url'] / 'index.html').read_text(encoding='utf-8')
            self.assertIn('local-ai/?course=' + course['id'] + '&amp;intent=review', html)
            self.assertIn('local-ai/?course=' + course['id'] + '&amp;intent=prerequisites', html)
            self.assertIn('local-ai/?course=' + course['id'] + '&amp;intent=quiz', html)
            self.assertNotIn('id="ai-course-data"', html)
            scripts = [name for name, _ in self.scripts(course['url'] + 'index.html')]
            for name in ['assets/local-ai.js', 'assets/local-ai-model.js', 'assets/vendor/local-ai-runtime.bundle.js', 'assets/vendor/local-ai-worker.bundle.js']:
                self.assertNotIn(name, scripts)

    def test_backup_reads_practice_without_loading_its_editor(self):
        html = (SITE / 'backup/index.html').read_text(encoding='utf-8')
        data = json.loads(re.search(r'<script type="application/json" id="practice-data">(.*?)</script>', html, re.S).group(1))
        self.assertEqual(data, json.loads((ROOT / 'docs/assets/exercises.json').read_text(encoding='utf-8')))
        self.assertNotIn('id="ai-course-data"', html)
        scripts = [name for name, _ in self.scripts('backup/index.html')]
        self.assertLess(scripts.index('assets/practice-model.js'), scripts.index('assets/backup-model.js'))
        self.assertNotIn('assets/practice.js', scripts)
        self.assertNotIn('assets/local-ai.js', scripts)

    def test_chip_does_not_download_retired_graph_runtimes(self):
        scripts = [name for name, _ in self.scripts('graph/index.html')]
        for retired in ['assets/vendor/graph3d.bundle.js', 'assets/vendor/matter.min.js', 'assets/graph.js', 'assets/gravity-controls.js', 'assets/graph-transfer.js', 'assets/learning.js']:
            self.assertNotIn(retired, scripts)

    def test_chip_embeds_only_public_course_metadata(self):
        html = (SITE / 'graph/index.html').read_text(encoding='utf-8')
        data = json.loads(re.search(r'<script type="application/json" id="chip-course-data">(.*?)</script>', html, re.S).group(1))
        catalog = json.loads((ROOT / 'docs/assets/course-catalog.json').read_text(encoding='utf-8'))
        self.assertEqual(data, {'courses': [{key: c[key] for key in ('id', 'title', 'path', 'url', 'prerequisites')} for c in catalog['courses']]})
        scripts = [name for name, _ in self.scripts('graph/index.html')]
        self.assertEqual(scripts.count('assets/learning-model.js'), 1)

    def test_chip_selection_fragments_are_not_replaced_by_theme_tracking(self):
        def config(path):
            html = (SITE / path).read_text(encoding='utf-8')
            return json.loads(re.search(r'<script id="__config"[^>]*>(.*?)</script>', html, re.S).group(1))
        chip = config('graph/index.html')
        article = config('courses/python/index.html')
        self.assertNotIn('navigation.tracking', chip['features'])
        self.assertIn('navigation.tracking', article['features'])
        self.assertEqual(chip['features'], [feature for feature in article['features'] if feature != 'navigation.tracking'])
        self.assertEqual(chip['translations'], article['translations'])

    def test_shared_stylesheet_has_one_content_versioned_url(self):
        expected = hashlib.sha256((ROOT / 'docs/assets/extra.css').read_bytes()).hexdigest()[:12]
        for page in ['index.html', 'dashboard/index.html', 'courses/python/index.html']:
            html = (SITE / page).read_text(encoding='utf-8')
            urls = re.findall(r'<link[^>]+href="([^"]*assets/extra\.css[^"\s]*)"', html)
            self.assertEqual(len(urls), 1, page)
            self.assertTrue(urls[0].endswith('?v=' + expected), urls[0])
            resolved = urlparse(urljoin('https://example.test/study-garden/' + page, urls[0]))
            self.assertEqual(resolved.path, '/study-garden/assets/extra.css')

    def test_backup_dependencies_and_scope(self):
        scripts = [name for name, _ in self.scripts('backup/index.html')]
        expected = ['assets/reading-model.js', 'assets/review-model.js', 'assets/learning-model.js', 'assets/practice-model.js', 'assets/planner-model.js', 'assets/backup-model.js', 'assets/backup.js']
        positions = [scripts.index(name) for name in expected]
        self.assertEqual(positions, sorted(positions))
        self.assertNotIn('assets/learning.js', scripts)
        self.assertNotIn('assets/planner.js', scripts)
        self.assertNotIn('assets/vault.js', scripts)
        self.assertNotIn('assets/backup.js', [name for name, _ in self.scripts('index.html')])


if __name__ == '__main__':
    unittest.main()
