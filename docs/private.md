---
comments: false
---

# 个人私密空间

课本、Obsidian 笔记和附件仅加密保存在当前浏览器，不上传到 GitHub。每个空间使用独立口令，不会出现在公开课程、站点搜索或知识图谱里。

<div class="private-boundary"><strong>本机加密 · 无服务器账号</strong><span>换设备需要导出并导入加密备份。清除浏览器数据可能删除资料，口令无法找回。</span></div>

<div id="vault-status" role="status" class="vault-status" aria-live="polite"></div>
<section id="vault-locked">
<div class="vault-entry-grid"><div class="vault-panel"><h2>打开已有空间</h2><form id="vault-unlock"><label>选择空间<select name="space" required aria-label="选择私密空间"></select></label><label>空间口令<input name="password" type="password" required autocomplete="off" aria-label="解锁口令"></label><button type="submit" class="md-button md-button--primary">解锁空间</button></form><button id="vault-restore" type="button" class="md-button">从加密备份恢复</button></div><div class="vault-panel"><h2>创建一个空间</h2><form id="vault-create"><label>空间名称<input name="name" required maxlength="50" placeholder="例如：我的课本与笔记"></label><label>设置空间口令<input name="password" type="password" required minlength="10" autocomplete="new-password" placeholder="至少 10 个字符，建议使用长口令"></label><label>再次输入口令<input name="confirm" type="password" required autocomplete="new-password"></label><label class="proposal-consent"><input type="checkbox" required> 我已理解口令无法找回，会保存口令并定期备份。</label><button type="submit" class="md-button">创建加密空间</button></form></div></div>
</section>

<section id="vault-open" hidden>
<div class="vault-heading"><div><span class="vault-eyebrow">我的资料库</span><strong id="vault-name"></strong><span id="vault-count" class="reading-meta"></span></div><button id="vault-lock" type="button" class="md-button">锁定空间</button></div>
<div class="vault-toolbar vault-primary-actions"><button id="vault-import" class="md-button md-button--primary" type="button">导入文件</button><button id="vault-folder" class="md-button" type="button">导入 Obsidian 文件夹</button><button id="vault-new" class="md-button" type="button">新建笔记</button><button id="vault-backup" class="md-button" type="button">导出加密备份</button></div>
<div id="vault-dropzone" class="vault-dropzone" tabindex="0" role="button" aria-label="拖入文件或按回车选择要导入的文件"><strong>把学习资料拖到这里</strong><span>PDF · Office 文档 · 笔记 · 图片 · 音视频 · 代码 · 压缩包。文件夹请使用上方的导入按钮。</span></div>
<div id="vault-progress" class="vault-progress" hidden><div class="vault-progress-heading"><span id="vault-progress-label" role="status" aria-live="polite"></span><button id="vault-cancel-import" type="button" class="md-button">停止导入</button></div><progress id="vault-progress-bar" max="100" value="0" aria-label="文件导入进度"></progress></div>
<div class="vault-library-heading"><div class="vault-storage-meter"><span id="vault-storage" class="reading-meta">每空间最多 256 MB</span><progress id="vault-capacity" max="100" value="0" aria-label="私密空间容量使用比例"></progress></div><button id="vault-focus" class="md-button" type="button" aria-pressed="false">专注阅读</button></div>
<div class="vault-layout"><div class="vault-browser"><label class="vault-control-label" for="vault-search">查找资料</label><input id="vault-search" type="search" aria-label="搜索私密文件" placeholder="搜索文件名或路径…"><label class="vault-control-label" for="vault-directory">文件夹</label><select id="vault-directory" aria-label="筛选私密文件夹"><option value="">全部文件夹</option></select><div class="vault-filter-row"><label>类型<select id="vault-type" aria-label="筛选私密文件类型"><option value="all">全部资料</option><option value="note">笔记</option><option value="pdf">课本 / PDF</option><option value="image">图片附件</option><option value="document">Word / 文档</option><option value="slides">PPT / 演示</option><option value="sheet">表格</option><option value="ebook">电子书</option><option value="audio">音频</option><option value="video">视频</option><option value="code">代码 / 数据</option><option value="archive">压缩包</option><option value="other">其他文件</option></select></label><label>排序<select id="vault-sort" aria-label="私密文件排序"><option value="name">名称</option><option value="recent">最近修改</option><option value="size">文件大小</option></select></label></div><p id="vault-result-count" class="reading-meta" aria-live="polite"></p><div id="vault-files"></div></div><section id="vault-reader" class="vault-reader" aria-label="私密资料阅读器"><div class="vault-empty"><span class="vault-empty-kicker">从一份资料开始</span><h2>留一个安静的学习角落</h2><p>在左侧选择课本或笔记，也可以新建一篇笔记，记录今天学到的内容。</p></div></section></div>
<p class="reading-meta vault-limits">单文件上限 128 MB，每空间上限 256 MB。10 分钟未操作自动锁定，请及时加密保存笔记修改。</p>
<details class="vault-danger vault-management"><summary>存储与空间管理</summary><div class="vault-management-body"><h3>让浏览器保留资料</h3><p id="vault-storage-hint">可请求浏览器优先保留本站的本机资料，是否允许由浏览器决定。仍需定期导出备份。</p><button id="vault-persist" type="button" class="md-button">请求保留本机资料</button><div class="vault-delete-section"><h3>删除当前空间</h3><p>会清除本浏览器中此空间的加密资料。请先导出需要保留的备份。</p><button id="vault-delete-space" type="button" class="md-button">删除当前空间</button></div></div></details>
</section>

<input id="vault-file-input" type="file" multiple accept=".pdf,.md,.markdown,.txt,.png,.jpg,.jpeg,.webp,.gif" hidden>
<input id="vault-folder-input" type="file" webkitdirectory multiple hidden>
<input id="vault-backup-input" type="file" accept=".sgvault" hidden>

## 整理与阅读

解锁后可以拖入多个文件，或点击“导入文件”选择文件。导入时会显示进度；停止导入会保留已经完成的资料。使用文件夹、类型筛选和名称、修改时间、大小排序，可以更快找到需要的内容。“专注阅读”收起资料列表，再次点击即可返回。

编辑笔记后，点击“加密保存修改”才会写入本机空间。切换资料或手动锁定前，页面会提醒尚未保存的修改；自动锁定仍会按时保护空间，请在离开前保存。

## 支持的文件格式

| 类型 | 常见格式 | 阅读方式 |
| --- | --- | --- |
| 笔记与课本 | Markdown、TXT、PDF | 站内阅读；小于 4 MB 的笔记可编辑 |
| 图片 | PNG、JPG、WebP、GIF、BMP、AVIF | 站内预览 |
| Office 文档 | DOC/DOCX、PPT/PPTX、XLS/XLSX、ODT/ODP/ODS、RTF | 加密保存，下载后用本机应用打开 |
| 表格与代码 | CSV、TSV、Python、C/C++、Java、JS/TS、JSON、Jupyter、HTML、LaTeX 等 | 小于 4 MB 时按纯文本查看，不执行代码 |
| 音频与视频 | MP3、WAV、OGG、M4A、FLAC、AAC、MP4、WebM、MOV | 使用浏览器播放器，支持情况取决于编码 |
| 电子书与压缩包 | EPUB、MOBI、AZW3、ZIP、7Z、RAR、TAR、GZ | 加密保存原件，下载阅读或解压 |

一次可以选择多种文件，也可以拖入多个文件。Office 文件不会发送给第三方在线预览服务。文件夹导入使用同一格式规则，隐藏配置仍会跳过；同路径文件不会覆盖已有资料。

## 导入 Obsidian 笔记

选择 Obsidian 仓库所在的文件夹，可以连同 Markdown 和图片附件一起导入。支持 `[[笔记名]]`、`[[路径|别名]]` 与 `![[图片.png]]` 的浏览和跳转；重名且无法确定路径时会提示未找到，不会随机打开另一篇笔记。

文件夹导入会忽略 `.obsidian`、`.git` 等隐藏配置。文件被复制进加密空间，后续编辑原始 Obsidian 仓库不会自动同步。内置阅读器支持基础 Markdown，不运行 Obsidian 插件或笔记内的 HTML、脚本。

## 资料如何保护

正文、文件名、目录路径和附件在写入浏览器前加密。空间名称保留在本机列表中，方便选择；加密资料仍可能显示大致的存储体积。使用后请锁定空间；它不能防止已解锁设备上的旁观者、恶意浏览器扩展或设备被控制后的访问。

加密备份也需要原口令才能打开。私密空间不创建云端账号，不提供口令找回，不会自动上传到公开仓库。
