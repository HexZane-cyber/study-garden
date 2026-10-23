---
comments: false
---

# 液态知识关系图

让知识像液体一样连接。每个节点是一篇文章，连线来自文章里的真实链接。慢慢拖动液滴，让相邻知识随之流动；轻甩后松手，液滴会带着惯性滑行，再逐渐安静下来。点击节点查看关联和正文。

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

拖拽时，液滴以柔软的牵引跟随指针；松手保留当前速度，并在黏性阻力下逐渐减速。液滴相撞时先挤压、传递动量，再缓慢恢复形状。降低“流动强度”可以减少持续漂移，方便阅读连接和标题；调到 0% 后，手动拖拽和接触仍然有效。

Matter.js 以固定的 120 Hz 步长积分运动并处理连线弹性。连续接触压力、邻域黏性和阻尼共同控制碰撞，变形采用渐进恢复，液滴挤扁时向两侧展开。不同屏幕刷新率使用同一运动节奏，回到后台页面时不会突然加速补算。连线始终对应文章之间的链接。

切换到“清晰模式”可收起液态装饰。暂停会同时停止节点和流动效果，系统偏好减少动画时默认暂停。这是交互视觉模拟，不用于工程流体计算。
