---
comments: false
---

# 液态知识关系图

让知识像液体一样连接。每个节点是一篇文章，连线来自文章里的真实链接。拖动液滴，观察邻近节点随之流动；点击节点查看关联和正文。

<div class="graph-wrap">
<div class="graph-toolbar"><input id="graph-search" aria-label="搜索知识节点" placeholder="搜索节点，例如：Python、矩阵…"><button id="graph-mode" type="button" aria-pressed="true">液态模式</button><button id="graph-pause" type="button">暂停运动</button><button id="graph-reset" type="button">重置视图</button></div>
<div class="flow-control"><span>FLOW / 流动强度</span><input id="graph-flow" aria-label="流动强度" type="range" min="0" max="100" value="55"><span id="graph-flow-value">55%</span></div>
<canvas id="knowledge-graph" role="img" aria-label="可拖拽的课程与笔记关系图。键盘用户可使用下方的文章列表。" tabindex="0"></canvas>
<div class="graph-legend"><span><i style="background:#ef5467"></i>课程</span><span><i style="background:#ff9a81"></i>笔记</span><span><i style="background:#d69767"></i>工具</span><span><i style="background:#9e919b"></i>指南</span></div>
<div id="graph-info" class="graph-info" aria-live="polite">正在加载知识图谱…</div>
</div>

<details class="graph-keyboard"><summary>按列表访问所有文章（支持键盘操作）</summary><ul id="graph-links"></ul></details>

## 如何让图谱生长

在[笔记](notes/index.md)中添加到其他文章的 Markdown 链接，提交后构建会重新生成连接。节点位置只是探索时的临时布局，不影响文章结构。

支持鼠标拖拽、触屏单指拖动、滚轮缩放；键盘可以通过文章列表打开正文。

## 液态模式

Matter.js 积分节点运动并处理连线弹性；节点接触采用连续软排斥和邻域黏性，避免刚性碰撞的突然弹开。平滑流场推动节点产生轻微漂移，拖拽产生局部扰动。接触时液滴缓慢挤压变形，靠近时出现柔软连接，配合流动光点呈现液体质感。连线始终对应文章之间的链接。

切换到“清晰模式”可收起液态装饰。暂停会同时停止节点和流动效果，系统偏好减少动画时默认暂停。这是交互视觉模拟，不用于工程流体计算。
