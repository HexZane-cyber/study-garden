"""Run a loopback-only preview; reopening the launcher reuses this project's server."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import sys
import urllib.error
import urllib.request
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
IDENTITY = hashlib.sha256(str(ROOT).encode('utf-8')).hexdigest()[:16]


class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/__zhixin_preview__':
            body = json.dumps({'app': 'zhixin-preview', 'project': IDENTITY}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()


def main():
    parser = argparse.ArgumentParser(description='之芯本地预览；只监听本机，Ctrl+C 停止。')
    parser.add_argument('--port', type=int, default=8080)
    parser.add_argument('--no-open', action='store_true', help='不自动打开浏览器')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('端口需要在 1–65535 之间')
    url = f'http://127.0.0.1:{args.port}/'
    # Avoid system proxy routing for a loopback health check.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open(url + '__zhixin_preview__', timeout=2) as response:
            existing = json.loads(response.read(1024))
        if existing == {'app': 'zhixin-preview', 'project': IDENTITY}:
            print(f'之芯预览已在运行：{url}', flush=True)
            if not args.no_open:
                webbrowser.open(url)
            return 0
    except (OSError, ValueError, urllib.error.URLError):
        pass
    if not (ROOT / 'site/index.html').is_file():
        print('没有找到已构建页面，开始构建……', flush=True)
        subprocess.run([sys.executable, 'build.py'], cwd=ROOT, check=True)
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(PreviewHandler, directory=str(ROOT / 'site')))
    except OSError as error:
        print(f'无法启动 {url}：{error}\n端口可能已被其他程序占用，不会自动结束其他程序。', file=sys.stderr)
        return 1
    print(f'之芯本地预览：{url}\n保持此窗口运行；按 Ctrl+C 停止。\n正式网站：https://hexzane-cyber.github.io/study-garden/', flush=True)
    if not args.no_open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n预览已停止。')
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
