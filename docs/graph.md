---
title: 知识芯片
comments: false
---

# 知识芯片

把知识慢慢做成一枚属于自己的芯片。每篇笔记是一块存储单元，每门课程是一个计算模块，文章之间的真实链接变成电路走线。笔记越多，阵列和芯片封装就越大。

<div class="chip-shell">
<div class="chip-heading"><div><small>ZHIXIN / YOUR KNOWLEDGE DIE</small><strong id="chip-summary">正在读取模块…</strong></div><a id="chip-publish" href="../publish/">发布新笔记 ↗</a></div>
<div class="chip-toolbar"><input id="chip-search" type="search" aria-label="搜索芯片模块" placeholder="搜索笔记或课程…"><select id="chip-group" aria-label="模块分类"><option value="">全部模块</option><option value="note">笔记阵列</option><option value="course">课程模块</option><option value="tool">工具接口</option><option value="guide">学习指南</option></select><button id="chip-clear" type="button" hidden>清除筛选</button><button id="chip-fit" type="button">查看整枚芯片</button><button id="chip-out" type="button" aria-label="缩小芯片">−</button><span id="chip-zoom">100%</span><button id="chip-in" type="button" aria-label="放大芯片">＋</button><button id="chip-expand" type="button" aria-pressed="false">大画布</button><label><input id="chip-signals" type="checkbox" checked> 信号流动</label></div>
<div id="chip-results" class="chip-results" aria-label="模块搜索结果" hidden></div>
<div class="chip-stage"><canvas id="knowledge-chip" tabindex="0" aria-label="知识芯片，单击模块或走线，拖动平移，滚轮缩放。也可使用下方模块和连接列表。"></canvas><div id="chip-status" class="chip-status" role="status">正在布置芯片…</div><div class="chip-help">单击模块或走线 · 双击模块打开文章 · 拖动平移 · 滚轮缩放</div></div>
<div id="chip-panel" class="chip-panel" aria-live="polite">选择模块查看文章，或点击走线探索关系。</div>
<div id="chip-size" class="chip-size"></div>
</div>

<details class="chip-list"><summary>按列表访问模块（支持键盘操作）</summary><ul id="chip-articles"></ul></details>
<details class="chip-list"><summary>按列表选择走线（支持键盘操作）</summary><ul id="chip-nets"></ul></details>

## 芯片怎样长大

把笔记发布到本站的 `docs/notes/` 目录后，部署时会自动生成新的笔记模块。笔记阵列会逐渐增加行列，芯片外框与引脚也随之扩展；课程、工具和指南各有自己的区域。这里的尺寸表示知识布局，不是学习成绩或真实芯片制程。

在笔记中添加指向其他站内文章的 Markdown 链接，就会出现对应走线。选中模块可以阅读文章、查看直接关系；选中走线可以打开两端文章。走线可点击，但不会改动笔记内容。发布步骤见[上传与发布](publish.md)。

选中模块或走线后，可以「复制此处链接」，重新打开链接时直接定位到对应对象。浏览器前进、后退也会恢复已浏览的选择与视图。模块关联较多时，展开面板中的其余关联即可继续阅读或定位，不再只显示前六条。

本页展示已发布到站点的文章。保存在[个人私密空间](private.md)的加密笔记继续保持独立，不会自动出现在公开芯片中。

## 阅读与操作

搜索会列出匹配模块的完整标题，可以定位，也能直接阅读；唯一匹配会自动定位，在搜索框按 Enter 即可打开。分类和搜索会同时筛选下方模块列表，「清除筛选」恢复整体。多条走线共用通道时，可在文章入口旁的「切换重叠走线」中选择具体关系。

芯片较大时，点击「查看整枚芯片」回到整体布局，或放大后拖动阅读细节。手机和平板支持双指缩放，并随双指中心平移；双指手势不会误打开文章。「信号流动」只为选中的关系播放少量光点，关闭后保持静止；系统偏好减少动画时默认关闭。

键盘可使用下方列表选择模块或走线。在画布上，方向键平移，`+` / `−` 缩放，`0` 查看整体，`Enter` 打开已选模块，`Escape` 取消选择或退出大画布。

