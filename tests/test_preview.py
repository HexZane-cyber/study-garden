"""Test launcher lifecycle on a temporary site, without touching port 8080 or user data."""
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import socket
import subprocess
import sys
import tempfile
import threading
import time
import unittest
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}))


class PreviewTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='preview-test-', dir=ROOT / 'tests')
        self.assertEqual(Path(self.temp.name).resolve().parent, (ROOT / 'tests').resolve())
        self.addCleanup(self.cleanup_fixture)
        self.root = Path(self.temp.name)
        (self.root / 'tools').mkdir()
        (self.root / 'site').mkdir()
        (self.root / 'tools/preview.py').write_bytes((ROOT / 'tools/preview.py').read_bytes())
        (self.root / 'site/index.html').write_text('<!doctype html><title>preview fixture</title>', encoding='utf-8')
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            self.port = sock.getsockname()[1]
        self.url = f'http://127.0.0.1:{self.port}/'
        self.addCleanup(self.stop_fixture)

    def run_preview(self, *args):
        env = os.environ.copy()
        env['PYTHONUTF8'] = '1'
        return subprocess.run([sys.executable, str(self.root / 'tools/preview.py'), '--port', str(self.port), '--no-open', *args], cwd=self.root, capture_output=True, text=True, encoding='utf-8', timeout=25, env=env)

    def cleanup_fixture(self):
        self.assertEqual(self.root.resolve().parent, (ROOT / 'tests').resolve())
        # On Windows the listener can close just before the interpreter releases its log.
        for attempt in range(40):
            try:
                self.temp.cleanup()
                return
            except PermissionError:
                if attempt == 39:
                    raise
                time.sleep(.05)

    def stop_fixture(self):
        # Uses the fixture project's identity and secret; never kills by PID or process name.
        if (self.root / '.tooling' / f'preview-{self.port}.json').exists():
            result = self.run_preview('--stop')
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def fetch(self, path='', **kwargs):
        with OPENER.open(urllib.request.Request(self.url + path, **kwargs), timeout=3) as response:
            return response.status, response.read()

    @contextmanager
    def fake_server(self, handler):
        server = ThreadingHTTPServer(('127.0.0.1', self.port), handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            yield server
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)

    def test_background_survives_launcher_reuses_and_stops(self):
        result = self.run_preview('--background')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(self.fetch()[0], 200, 'the launcher has exited but its detached server must stay available')
        health = json.loads(self.fetch('__zhixin_preview__')[1])
        self.assertTrue(health['managed'])
        self.assertNotIn('token', health)
        state = self.root / '.tooling' / f'preview-{self.port}.json'
        original = state.read_text(encoding='utf-8')
        self.assertEqual(self.run_preview('--background').returncode, 0)
        self.assertEqual(state.read_text(encoding='utf-8'), original, 'repeat launch must reuse the same server and token')
        self.assertEqual(self.run_preview('--status').returncode, 0)
        report = self.run_preview('--diagnose')
        self.assertEqual(report.returncode, 0)
        self.assertIn('可以访问', report.stdout)
        self.assertNotIn(json.loads(original)['token'], report.stdout)
        self.assertEqual(state.read_text(encoding='utf-8'), original)
        self.fetch('?private-search=not-for-logs')
        log = (self.root / '.tooling' / f'preview-{self.port}.log').read_text(encoding='utf-8')
        self.assertNotIn('not-for-logs', log)
        self.assertEqual(self.run_preview('--stop').returncode, 0)
        self.assertFalse(state.exists())
        self.assertNotEqual(self.run_preview('--status').returncode, 0)
        self.assertEqual(self.run_preview('--stop').returncode, 0, 'stopping an absent server is harmless')

    def test_stop_requires_token_and_rejects_cross_origin(self):
        self.assertEqual(self.run_preview('--background').returncode, 0)
        saved = json.loads((self.root / '.tooling' / f'preview-{self.port}.json').read_text(encoding='utf-8'))
        for headers in [{}, {'X-Zhixin-Token': 'wrong'}, {'X-Zhixin-Token': saved['token'], 'Origin': 'https://other.example'}]:
            with self.assertRaises(urllib.error.HTTPError) as error:
                self.fetch('__zhixin_stop__', data=b'', method='POST', headers=headers)
            self.assertEqual(error.exception.code, 403)
            self.assertEqual(self.fetch()[0], 200)
        # Merely visiting the stop URL must never stop the server.
        with self.assertRaises(urllib.error.HTTPError) as error:
            self.fetch('__zhixin_stop__')
        self.assertEqual(error.exception.code, 404)
        self.assertEqual(self.fetch()[0], 200)

    def test_foreign_port_is_not_opened_or_stopped(self):
        class Foreign(BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass
            def do_GET(self):
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'{"app":"another-application"}')
        with self.fake_server(Foreign):
            report = self.run_preview('--diagnose')
            self.assertNotEqual(report.returncode, 0)
            self.assertIn('未识别为本项目服务', report.stdout)
            self.assertNotEqual(self.run_preview('--background').returncode, 0)
            self.assertNotEqual(self.run_preview('--stop').returncode, 0)
            self.assertEqual(self.fetch()[0], 200)
            self.assertFalse((self.root / '.tooling').exists())

    def test_missing_site_build_failure_does_not_claim_success(self):
        (self.root / 'site/index.html').unlink()
        (self.root / 'build.py').write_text('raise SystemExit(7)', encoding='utf-8')
        result = self.run_preview('--background')
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse((self.root / '.tooling').exists())

    def test_status_is_read_only_and_port_is_validated(self):
        report = self.run_preview('--diagnose')
        self.assertNotEqual(report.returncode, 0)
        self.assertIn('页面已构建，服务未运行', report.stdout)
        self.assertFalse((self.root / '.tooling').exists())
        (self.root / 'site/index.html').unlink()
        report = self.run_preview('--diagnose')
        self.assertIn('尚未构建页面', report.stdout)
        self.assertFalse((self.root / '.tooling').exists())
        self.assertNotEqual(self.run_preview('--status').returncode, 0)

        self.assertFalse((self.root / '.tooling').exists())
        self.assertEqual(self.run_preview('--port', '0').returncode, 2)
        self.assertEqual(self.run_preview('--background', '--stop').returncode, 2)

    def test_invalid_control_record_cannot_stop_server(self):
        self.assertEqual(self.run_preview('--background').returncode, 0)
        state = self.root / '.tooling' / f'preview-{self.port}.json'
        original = state.read_text(encoding='utf-8')
        try:
            for value in ['null', '[]', 'broken', '{"project":"another-project","token":"wrong"}']:
                state.write_text(value, encoding='utf-8')
                result = self.run_preview('--stop')
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn('Traceback', result.stderr)
                self.assertEqual(self.fetch()[0], 200)
        finally:
            state.write_text(original, encoding='utf-8')

    def test_live_process_with_missing_homepage_is_not_ready(self):
        self.assertEqual(self.run_preview('--background').returncode, 0)
        (self.root / 'site/index.html').unlink()
        # A directory listing is HTTP 200 too; the server must not call it a ready site.
        self.assertNotEqual(self.run_preview('--status').returncode, 0)


if __name__ == '__main__':
    unittest.main()
