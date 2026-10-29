"""Serve this project's built site on loopback, with an optional detached launcher."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import hashlib
import hmac
import json
import os
import secrets
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
IDENTITY = hashlib.sha256(str(ROOT).encode('utf-8')).hexdigest()[:16]
PUBLIC_URL = 'https://hexzane-cyber.github.io/study-garden/'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())


def address(port):
    return f'http://127.0.0.1:{port}/'


def state_path(port):
    return ROOT / '.tooling' / f'preview-{port}.json'


def log_path(port):
    return ROOT / '.tooling' / f'preview-{port}.log'


def running(port):
    try:
        with OPENER.open(address(port) + '__zhixin_preview__', timeout=1) as response:
            value = json.loads(response.read(2048))
        if isinstance(value, dict) and value.get('app') == 'zhixin-preview' and value.get('project') == IDENTITY:
            return value
    except (OSError, ValueError, urllib.error.URLError):
        pass
    return None


def page_ready(port):
    if not (ROOT / 'site/index.html').is_file():
        return False
    try:
        with OPENER.open(address(port), timeout=2) as response:
            return response.status == 200 and response.headers.get_content_type() == 'text/html'
    except (OSError, urllib.error.URLError):
        return False


def port_busy(port):
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=1):
            return True
    except OSError:
        return False


class PreviewHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Do not persist article paths or searches in background access logs.
        pass

    def reply(self, status, value):
        body = json.dumps(value).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/__zhixin_preview__':
            self.reply(200, {'app': 'zhixin-preview', 'project': IDENTITY, 'managed': True})
            return
        super().do_GET()

    def do_POST(self):
        if self.path != '/__zhixin_stop__':
            self.reply(404, {'error': 'not found'})
            return
        # Only the local launcher has the secret. A webpage cannot stop the server.
        origin = self.headers.get('Origin')
        expected_origin = address(self.server.server_port).rstrip('/')
        token = self.headers.get('X-Zhixin-Token', '')
        if not token.isascii() or (origin is not None and origin != expected_origin) or not hmac.compare_digest(token, self.server.stop_token):
            self.reply(403, {'error': 'forbidden'})
            return
        self.reply(200, {'stopping': True})
        threading.Thread(target=self.server.shutdown, daemon=True).start()


def stop(port):
    existing = running(port)
    if existing is None:
        print('本项目预览未运行；没有结束任何其他程序。', flush=True)
        return 1 if port_busy(port) else 0
    if not existing.get('managed'):
        print('当前是旧版前台预览，请在原启动窗口按 Ctrl+C 停止，再双击 start-preview.cmd。', flush=True)
        return 1
    try:
        saved = json.loads(state_path(port).read_text(encoding='utf-8'))
        if not isinstance(saved, dict) or saved.get('project') != IDENTITY or not isinstance(saved.get('token'), str):
            raise ValueError('本地控制记录不匹配')
        request = urllib.request.Request(address(port) + '__zhixin_stop__', data=b'', method='POST', headers={'X-Zhixin-Token': saved['token']})
        with OPENER.open(request, timeout=3) as response:
            if response.status != 200:
                raise ValueError('停止请求未成功')
        for _ in range(30):
            if running(port) is None:
                print('本机预览已停止；网站文件和浏览器个人记录均保留。', flush=True)
                return 0
            time.sleep(.1)
        raise ValueError('服务尚未停止，请稍后重试')
    except (OSError, ValueError, urllib.error.URLError) as error:
        print(f'未能安全停止预览：{error}', file=sys.stderr)
        return 1


def launch_background(port, no_open):
    if not (ROOT / 'site/index.html').is_file():
        print('没有找到已构建页面，开始构建……', flush=True)
        subprocess.run([sys.executable, 'build.py'], cwd=ROOT, check=True)
    log = log_path(port)
    log.parent.mkdir(exist_ok=True)
    kwargs = {'cwd': ROOT, 'stdin': subprocess.DEVNULL, 'close_fds': True}
    if os.name == 'nt':
        kwargs['creationflags'] = subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP
    else:
        kwargs['start_new_session'] = True
    env = os.environ.copy()
    env['PYTHONUTF8'] = '1'
    with log.open('wb') as output:
        child = subprocess.Popen([sys.executable, str(Path(__file__).resolve()), '--port', str(port), '--no-open'], stdout=output, stderr=output, env=env, **kwargs)
    deadline = time.monotonic() + 12
    while time.monotonic() < deadline:
        if running(port) and page_ready(port):
            print(f'之芯已在后台运行：{address(port)}\n启动窗口可以关闭；需要停止时双击 stop-preview.cmd。', flush=True)
            if not no_open:
                webbrowser.open(address(port))
            return 0
        if child.poll() is not None:
            break
        time.sleep(.15)
    print(f'后台启动未通过检查，请查看：{log}\n也可运行 python tools/preview.py --no-open 查看错误。', file=sys.stderr)
    return 1


def serve(port, no_open):
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), partial(PreviewHandler, directory=str(ROOT / 'site')))
    except OSError as error:
        print(f'无法启动 {address(port)}：{error}\n不会自动结束占用端口的其他程序。', file=sys.stderr)
        return 1
    server.stop_token = secrets.token_urlsafe(32)
    state = state_path(port)
    try:
        if not (ROOT / 'site/index.html').is_file():
            print('没有找到已构建页面，开始构建……', flush=True)
            subprocess.run([sys.executable, 'build.py'], cwd=ROOT, check=True)
        state.parent.mkdir(exist_ok=True)
        state.write_text(json.dumps({'project': IDENTITY, 'token': server.stop_token}), encoding='utf-8')
        print(f'之芯本地预览：{address(port)}\n前台模式按 Ctrl+C 停止；也可使用 stop-preview.cmd。\n正式网站：{PUBLIC_URL}', flush=True)
        if not no_open:
            webbrowser.open(address(port))
        server.serve_forever(poll_interval=.1)
    except KeyboardInterrupt:
        print('\n预览已停止。', flush=True)
    finally:
        server.server_close()
        try:
            saved = json.loads(state.read_text(encoding='utf-8'))
            if isinstance(saved, dict) and saved.get('token') == server.stop_token:
                state.unlink()
        except (OSError, ValueError):
            pass
    return 0


def main():
    parser = argparse.ArgumentParser(description='之芯本机预览，只监听 127.0.0.1。')
    parser.add_argument('--port', type=int, default=8080)
    parser.add_argument('--no-open', action='store_true', help='不自动打开浏览器')
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--background', action='store_true', help='启动独立后台预览，检查就绪后打开浏览器')
    mode.add_argument('--stop', action='store_true', help='只停止本项目可验证的预览服务')
    mode.add_argument('--status', action='store_true', help='检查预览身份和首页响应，不启动服务')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('端口需要在 1–65535 之间')
    try:
        if args.stop:
            return stop(args.port)
        existing = running(args.port)
        if existing:
            if not page_ready(args.port):
                print('预览进程存在，但首页未就绪。请运行 python build.py 检查构建。', file=sys.stderr)
                return 1
            print(f'之芯预览已在运行：首页响应正常，{address(args.port)}', flush=True)
            if not existing.get('managed'):
                print('当前是旧版前台服务，仍需保留原窗口。停止后重新双击启动器即可改用后台运行。', flush=True)
            if not args.no_open and not args.status:
                webbrowser.open(address(args.port))
            return 0
        if port_busy(args.port):
            print(f'{address(args.port)} 已被其他服务占用，未打开或结束该服务。请先检查端口归属。', file=sys.stderr)
            return 1
        if args.status:
            print('本机预览未运行，请双击 start-preview.cmd。', flush=True)
            return 1
        if args.background:
            return launch_background(args.port, args.no_open)
        return serve(args.port, args.no_open)
    except (OSError, subprocess.CalledProcessError) as error:
        print(f'启动失败：{error}\n请检查 Python、构建依赖及项目目录权限。正式网站：{PUBLIC_URL}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
