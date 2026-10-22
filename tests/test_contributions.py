import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('check',Path(__file__).resolve().parents[1]/'tools/check_contribution.py')
check=importlib.util.module_from_spec(spec)
spec.loader.exec_module(check)

class ContributionTest(unittest.TestCase):
    def test_only_community_course_markdown_is_allowed(self):
        self.assertTrue(check.check_path('docs/courses/community/my-course.md'))
        for path in ['.github/workflows/run.yml','docs/assets/graph.js','docs/index.md','docs/courses/community/../../index.md','docs/courses/community/injected.html']:
            self.assertFalse(check.check_path(path))

    def test_submission_content_has_no_raw_html_or_executable_urls(self):
        check.validate_text('# A course\n\n[Course](https://example.edu)')
        for text in ['# Course\n<script>alert(1)</script>','# Course\n[x](javascript:alert(1))','No title']:
            with self.assertRaises(ValueError):
                check.validate_text(text)

if __name__=='__main__':
    unittest.main()
