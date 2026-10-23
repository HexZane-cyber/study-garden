---
comments: false
---

# 液态知识关系图

在三维空间中探索知识，也可以切回二维液面。每个节点是一篇文章，连线来自文章里的真实链接。慢慢拖动液滴，让相邻知识随之流动；轻甩后松手，液滴会带着惯性滑行，再逐渐安静下来。点击节点查看关联和正文。

<div class="graph-wrap">
<div class="graph-toolbar"><input id="graph-search" aria-label="搜索知识节点" placeholder="搜索节点，例如：Python、矩阵…"><button id="graph-mode" type="button" aria-pressed="true">液态模式</button><button id="graph-pause" type="button">暂停运动</button><button id="graph-reset" type="button">重置视图</button></div>
<div class="flow-control"><span>FLOW / 流动强度</span><input id="graph-flow" aria-label="流动强度" type="range" min="0" max="100" value="55"><span id="graph-flow-value">55%</span><label class="graph-glass-control">通透度 <input id="graph-transparency" aria-label="液面通透度" type="range" min="35" max="90" value="74"><span id="graph-transparency-value">74%</span></label><label class="graph-activity-toggle"><input id="graph-activity" type="checkbox" checked> 按阅读频率调节</label></div>
<div class="graph-tools"><label>视图<select id="graph-view" aria-label="图谱维度"><option value="3d">三维空间</option><option value="2d">二维液面</option></select></label><label>标题<select id="graph-labels"><option value="smart">智能避让</option><option value="all">显示全部</option><option value="off">仅选中与悬停</option></select></label><button id="graph-focus" type="button" aria-pressed="false" disabled>只看直接关联</button><button id="graph-fit" type="button">适应画布</button><button id="graph-expand" type="button" aria-pressed="false">大画布</button><span id="graph-hint">点击节点查看关联，拖动空白处平移</span></div>
<p id="graph-render-status" class="reading-meta" role="status" hidden></p>
<div class="graph-stage"><canvas id="knowledge-graph" role="img" aria-label="可拖拽的课程与笔记关系图。键盘用户可使用下方的文章列表。" tabindex="0"></canvas><canvas id="knowledge-graph-3d" aria-label="三维知识图谱：拖动空白旋转，滚轮缩放，拖动液滴移动节点。" tabindex="0" hidden></canvas></div>
<div class="graph-legend"><span><i style="background:#ef5467"></i>课程</span><span><i style="background:#ff9a81"></i>笔记</span><span><i style="background:#d69767"></i>工具</span><span><i style="background:#9e919b"></i>指南</span></div>
<div id="graph-info" class="graph-info" aria-live="polite">正在加载知识图谱…</div>
</div>

<details class="graph-keyboard"><summary>按列表访问所有文章（支持键盘操作）</summary><ul id="graph-links"></ul></details>

## 如何让图谱生长

在[笔记](notes/index.md)中添加到其他文章的 Markdown 链接，提交后构建会重新生成连接。节点位置只是探索时的临时布局，不影响文章结构。

三维视图中，拖动空白处旋转，滚轮缩放，右键拖动平移；拖住液滴可以移动节点，松手后保留惯性。触屏可单指旋转、双指缩放和平移。标题始终朝向屏幕，可点击选择。通过“视图”切换到二维；浏览器不支持 WebGL 时自动回到二维。键盘可以使用节点标题按钮或下方文章列表。

标题默认智能避让，优先显示选中、悬停和搜索匹配的文章。点击一个节点后，下方会列出可以直接打开的关联文章；开启“只看直接关联”可收起其他节点，连线仍代表真实文章链接。“适应画布”把当前可见节点放回视野，“大画布”提供更宽的探索空间，按 Escape 可退出。以上操作不会改变文章内容或知识关系。

## 液态模式

拖拽时，液滴以柔软的牵引跟随指针；松手保留当前速度，并在黏性阻力下逐渐减速。液滴相撞时先挤压、传递动量，再缓慢恢复形状。单个节点也会呈现椭圆、水滴或柔和的不规则轮廓，每篇文章拥有稳定的形态差异。轮廓会随运动、挤压和流场缓慢变化，不会突然切换形状。二维视图中，相邻液滴使用连续密度场生成共同的液面轮廓，靠近时形成液颈，拉开后自然分离；速度与接触压力影响轮廓的拉伸、压缩，液面采用半透明浅红材质，细高光沿边缘变化，后方文章连线仍然可见；“通透度”滑块可调整液面填色浓度，向右更通透。三维视图使用有厚度的透光材质，并在接近时显示短液颈。液面相融只是视觉效果，不会新增文章链接。

默认按本浏览器的文章阅读频率分配流动强度：经常阅读、近期打开的文章更活跃，少读或很久未读的文章更安静。记录仅保存在本机，不统计私密空间内容；快速刷新不重复计数。关闭“按阅读频率调节”可统一使用整体流动强度。降低“流动强度”可以减少持续漂移，方便阅读连接和标题；调到 0% 后，手动拖拽和接触仍然有效。

三维视图使用 Three.js 渲染通透、不规则的液滴，在三轴上计算连线弹性、软接触、黏性与拖拽惯性；二维视图使用 Matter.js。两种视图都以固定的 120 Hz 步长更新物理。连续接触压力、邻域黏性和阻尼共同控制碰撞，变形采用渐进恢复，液滴挤扁时向两侧展开。不同屏幕刷新率使用同一运动节奏，回到后台页面时不会突然加速补算。连线始终对应文章之间的链接。

切换到“清晰模式”可收起液态装饰。暂停会同时停止节点和流动效果，系统偏好减少动画时默认暂停。这是交互视觉模拟，不用于工程流体计算。
