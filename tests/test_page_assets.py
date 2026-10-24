"""Exercise built HTML so feature scripts remain scoped and resolve on Pages subpaths."""
from html.parser import HTMLParser
from pathlib import Path
import unittest
from urllib.parse import urljoin, urlparse


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
FEATURE_SCRIPTS = {
    'graph/index.html': ['assets/graph-interaction.js', 'assets/chip-model.js', 'assets/chip.js'],
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
                self.assertFalse(ALL_FEATURE_SCRIPTS.intersection(scripts))

    def test_feature_dependencies_are_ordered_deferred_and_exclusive(self):
        for path, expected in FEATURE_SCRIPTS.items():
            with self.subTest(page=path):
                scripts = self.scripts(path)
                features = [(name, attrs) for name, attrs in scripts if name in ALL_FEATURE_SCRIPTS]
                self.assertEqual([name for name, _ in features], expected)
                for name, attrs in features:
                    self.assertIn('defer', attrs, name)
                    self.assertNotIn('async', attrs, name)

    def test_dashboard_only_downloads_review_model(self):
        scripts = [name for name, _ in self.scripts('dashboard/index.html')]
        self.assertIn('assets/review-model.js', scripts)
        self.assertNotIn('assets/review.js', scripts)

    def test_chip_does_not_download_retired_graph_runtimes(self):
        scripts = [name for name, _ in self.scripts('graph/index.html')]
        for retired in ['assets/vendor/graph3d.bundle.js', 'assets/vendor/matter.min.js', 'assets/graph.js', 'assets/gravity-controls.js', 'assets/graph-transfer.js']:
            self.assertNotIn(retired, scripts)

    def test_backup_dependencies_and_scope(self):
        scripts = [name for name, _ in self.scripts('backup/index.html')]
        expected = ['assets/reading-model.js', 'assets/review-model.js', 'assets/learning-model.js', 'assets/planner-model.js', 'assets/backup-model.js', 'assets/backup.js']
        positions = [scripts.index(name) for name in expected]
        self.assertEqual(positions, sorted(positions))
        self.assertNotIn('assets/learning.js', scripts)
        self.assertNotIn('assets/planner.js', scripts)
        self.assertNotIn('assets/vault.js', scripts)
        self.assertNotIn('assets/backup.js', [name for name, _ in self.scripts('index.html')])


if __name__ == '__main__':
    unittest.main()
