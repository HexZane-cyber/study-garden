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
<div class="vault-heading"><div><strong id="vault-name"></strong><span id="vault-count" class="reading-meta"></span></div><button id="vault-lock" type="button" class="md-button">锁定空间</button></div>
<div class="vault-toolbar"><button id="vault-import" class="md-button md-button--primary" type="button">导入课本 / 笔记</button><button id="vault-folder" class="md-button" type="button">导入 Obsidian 文件夹</button><button id="vault-new" class="md-button" type="button">新建笔记</button><button id="vault-backup" class="md-button" type="button">导出加密备份</button></div>
<p class="reading-meta">支持 PDF、Markdown、TXT 与常见图片。单文件上限 128 MB，每空间上限 256 MB；10 分钟未操作自动锁定。文件夹导入会忽略 .obsidian、.git 等隐藏配置。</p>
<div class="vault-layout"><div class="vault-browser"><input id="vault-search" aria-label="搜索私密文件" placeholder="搜索文件名或路径…"><select id="vault-type" aria-label="筛选私密文件类型"><option value="all">全部资料</option><option value="note">笔记</option><option value="pdf">课本 / PDF</option><option value="image">图片附件</option></select><div id="vault-files"></div></div><section id="vault-reader" class="vault-reader"><p class="reading-meta">选择一份资料开始阅读。</p></section></div>
<details class="vault-danger"><summary>空间管理</summary><p>删除当前空间会清除本浏览器中的加密资料，建议先导出备份。</p><button id="vault-delete-space" type="button" class="md-button">删除当前空间</button></details>
</section>

<input id="vault-file-input" type="file" multiple accept=".pdf,.md,.markdown,.txt,.png,.jpg,.jpeg,.webp,.gif" hidden>
<input id="vault-folder-input" type="file" webkitdirectory multiple hidden>
<input id="vault-backup-input" type="file" accept=".sgvault" hidden>

## 导入 Obsidian 笔记

选择 Obsidian 仓库所在的文件夹，可以连同 Markdown 和图片附件一起导入。支持 `[[笔记名]]`、`[[路径|别名]]` 与 `![[图片.png]]` 的浏览和跳转；重名且无法确定路径时会提示未找到，不会随机打开另一篇笔记。

文件被复制进加密空间，后续编辑原始 Obsidian 仓库不会自动同步。内置阅读器支持基础 Markdown，不运行 Obsidian 插件或笔记内的 HTML、脚本。

## 资料如何保护

正文、文件名、目录路径和附件在写入浏览器前加密。空间名称保留在本机列表中，方便选择；加密资料仍可能显示大致的存储体积。使用后请锁定空间；它不能防止已解锁设备上的旁观者、恶意浏览器扩展或设备被控制后的访问。

加密备份也需要原口令才能打开。私密空间不创建云端账号，不提供口令找回，不会自动上传到公开仓库。
