---
comments: false
---

# 知识关系图

图谱使用 Matter.js 物理引擎模拟弹性连线、阻尼和节点碰撞。每个小球是一篇文章，连线来自文章之间的链接。拖拽小球重新整理位置，滚轮缩放，拖动画布平移。点击节点可查看关联并打开正文。

<div class="graph-wrap">
<div class="graph-toolbar"><input id="graph-search" aria-label="搜索知识节点" placeholder="搜索节点，例如：Python、矩阵…"><button id="graph-pause" type="button">暂停运动</button><button id="graph-reset" type="button">重置视图</button></div>
<canvas id="knowledge-graph" role="img" aria-label="可拖拽的课程与笔记关系图。键盘用户可使用下方的文章列表。" tabindex="0"></canvas>
<div class="graph-legend"><span><i style="background:#ef5467"></i>课程</span><span><i style="background:#ff9a81"></i>笔记</span><span><i style="background:#d69767"></i>工具</span><span><i style="background:#9e919b"></i>指南</span></div>
<div id="graph-info" class="graph-info" aria-live="polite">正在加载知识图谱…</div>
</div>

<details class="graph-keyboard"><summary>按列表访问所有文章（支持键盘操作）</summary><ul id="graph-links"></ul></details>

## 如何让图谱生长

在[笔记](notes/index.md)中添加到其他文章的 Markdown 链接，提交后构建会重新生成连接。节点位置只是探索时的临时布局，不影响文章结构。

支持鼠标拖拽、触屏单指拖动、滚轮缩放；键盘可以通过文章列表打开正文。
