---
comments: false
---

# 液态知识关系图

在三维空间中探索知识，也可以切回二维液面。每个节点是一篇文章，连线来自文章里的真实链接。慢慢拖动液滴，让相邻知识随之流动；轻甩后松手，液滴会带着惯性滑行，再逐渐安静下来。点击节点查看关联和正文。

<div class="graph-wrap">
<div class="graph-toolbar"><input id="graph-search" aria-label="搜索知识节点" placeholder="搜索节点，例如：Python、矩阵…"><button id="graph-mode" type="button" aria-pressed="true">液态模式</button><button id="graph-pause" type="button">暂停运动</button><button id="graph-reset" type="button">重置视图</button></div>
<div class="flow-control"><span>FLOW / 流动强度</span><input id="graph-flow" aria-label="流动强度" type="range" min="0" max="100" value="55"><span id="graph-flow-value">55%</span><label class="graph-glass-control">通透度 <input id="graph-transparency" aria-label="液面通透度" type="range" min="35" max="90" value="74"><span id="graph-transparency-value">74%</span></label><label class="graph-glass-control">弯曲度 <input id="graph-bend" aria-label="连线弯曲度" type="range" min="0" max="60" value="28"><span id="graph-bend-value">28%</span></label><label class="graph-activity-toggle"><input id="graph-activity" type="checkbox" checked> 按阅读频率调节</label></div>
<div class="graph-tools"><label>视图<select id="graph-view" aria-label="图谱维度"><option value="3d">三维空间</option><option value="2d">二维液面</option></select></label><label>接触<select id="graph-contact" aria-label="液滴接触方式"><option value="soft">柔软接触</option><option value="merge">缓慢相融</option></select></label><label>标题<select id="graph-labels"><option value="smart">智能避让</option><option value="all">显示全部</option><option value="off">仅选中与悬停</option></select></label><button id="graph-focus" type="button" aria-pressed="false" disabled>只看直接关联</button><button id="graph-fit" type="button">适应画布</button><button id="graph-expand" type="button" aria-pressed="false">大画布</button><span id="graph-hint">点击节点查看关联，拖动空白处平移</span></div>
<details class="graph-gravity"><summary>重力与倾斜 · 让知识随方向流动</summary><div class="gravity-controls"><button id="graph-gravity-pad" type="button" aria-label="重力方向盘，拖动或用方向键调整，Home 归零"><span aria-hidden="true">＋<i></i></span></button><div class="gravity-settings"><label>重力模式<select id="graph-gravity-mode" aria-label="重力模式"><option value="off">关闭</option><option value="manual">手动方向</option><option value="orbit">缓慢旋转</option></select></label><label>重力强度<input id="graph-gravity-strength" aria-label="重力强度" type="range" min="0" max="100" value="50"><output id="graph-gravity-value">50%</output></label><div class="gravity-presets"><button type="button" data-gravity-direction="0,1">向下</button><button type="button" data-gravity-direction="-1,0">向左</button><button type="button" data-gravity-direction="1,0">向右</button><button type="button" data-gravity-direction="0,-1">反重力</button><button type="button" data-gravity-direction="0,0">方向归零</button><button id="graph-gravity-sensor" type="button" aria-pressed="false">跟随设备倾斜</button></div></div></div><p id="graph-gravity-status" role="status">重力默认关闭。拖动方向盘、使用方向键，或选择一种模式开始。</p></details>
<details class="graph-palette"><summary>颜色设置</summary><div class="graph-palette-controls"><label>修改对象<select id="graph-color-target" aria-label="颜色修改对象"><option value="node">当前选中节点</option><option value="course">课程默认色</option><option value="note">笔记默认色</option><option value="tool">工具默认色</option><option value="guide">指南默认色</option><option value="line">关系连线</option></select></label><label>调色盘<input id="graph-color-wheel" type="color" aria-label="图谱颜色盘" value="#ef5467"></label><label>颜色值<input id="graph-color-hex" aria-label="十六进制颜色" type="text" maxlength="7" value="#ef5467" placeholder="#ef5467" spellcheck="false"></label><button id="graph-color-apply" type="button">应用颜色</button><button id="graph-color-inherit" type="button">当前节点跟随分类</button><button id="graph-color-reset" type="button">恢复默认配色</button><span id="graph-color-status" role="status" aria-live="polite">先选择节点，或选择要修改的分类与连线。</span></div><p>单独设置的节点颜色优先于分类默认色。配色仅保存在本浏览器，三维与二维共用。</p></details>
<p id="graph-render-status" class="reading-meta" role="status" hidden></p>
<div class="graph-stage"><canvas id="knowledge-graph" role="img" aria-label="可拖拽的课程与笔记关系图。键盘用户可使用下方的文章列表。" tabindex="0"></canvas><canvas id="knowledge-graph-3d" aria-label="三维知识图谱：拖动空白旋转，滚轮缩放，拖动液滴移动节点。" tabindex="0" hidden></canvas></div>
<div class="graph-legend"><span><i data-graph-group="course" style="background:#ef5467"></i>课程</span><span><i data-graph-group="note" style="background:#ff9a81"></i>笔记</span><span><i data-graph-group="tool" style="background:#d69767"></i>工具</span><span><i data-graph-group="guide" style="background:#9e919b"></i>指南</span></div>
<div id="graph-info" class="graph-info" aria-live="polite">正在加载知识图谱…</div>
</div>

<details class="graph-keyboard"><summary>按列表访问所有文章（支持键盘操作）</summary><ul id="graph-links"></ul></details>

## 如何让图谱生长

在[笔记](notes/index.md)中添加到其他文章的 Markdown 链接，提交后构建会重新生成连接。节点位置只是探索时的临时布局，不影响文章结构。

三维视图中，拖动空白处旋转，滚轮缩放，右键拖动平移；拖住液滴可以移动节点，松手后保留惯性。触屏可单指旋转、双指缩放和平移。标题始终朝向屏幕，可点击选择。关系连线采用柔和曲线，流动光点沿曲线移动，弯曲度滑块可以调整弧度；“颜色设置”内可用调色盘修改节点、分类与连线。通过“视图”切换到二维；浏览器不支持 WebGL 时自动回到二维。键盘可以使用节点标题按钮或下方文章列表。

标题默认智能避让，优先显示选中、悬停和搜索匹配的文章。点击一个节点后，下方会列出可以直接打开的关联文章；开启“只看直接关联”可收起其他节点，连线仍代表真实文章链接。“适应画布”把当前可见节点放回视野，“大画布”提供更宽的探索空间，按 Escape 可退出。以上操作不会改变文章内容或知识关系。

运动中的标题会保留在节点同一侧，不再因为一次避让检测突然跳到另一边。画布边缘会连续限制标题位置；智能模式下，拥挤的普通标题暂时收起，留出足够空间后再显示，选中或键盘聚焦的标题优先保留。

## 重力与倾斜

展开「重力与倾斜」，可以拖动方向盘设置方向和倾斜幅度，用滑块调节整体强度，或选择向下、左右、反重力等预设。「缓慢旋转」让重力每 24 秒转一圈。方向变化经过平滑处理，节点会在重力、连接弹性和黏性之间逐渐重新分布；活动范围有弹性边界，避免持续加速飞离。二维和三维均可使用，三维方向按当前屏幕方向解释，旋转视角后仍然向屏幕所指的方向受力。

支持方向传感器的手机或平板，可主动点击「跟随设备倾斜」并按浏览器提示授权；平放时，沿屏幕方向的重力接近零，竖起或左右倾斜会改变方向。没有传感器、权限未获准或未收到有效数据时，仍可使用手动方向和缓慢旋转。倾斜数据只用于当前页面，进入后台后停止跟随，需要手动重新开启。

重力默认关闭，本次调整不会保存到浏览器。暂停运动也会暂停重力旋转和物理更新；关闭重力会逐渐消除外力，已有惯性会继续衰减。选择「反重力」是向上的视觉外力，不改变真实设备的重力。

## 液态模式

拖拽时，液滴以柔软的牵引跟随指针；松手保留当前速度，并在黏性阻力下逐渐减速。液滴相撞时先挤压、传递动量，再缓慢恢复形状。单个节点也会呈现椭圆、水滴或柔和的不规则轮廓，每篇文章拥有稳定的形态差异。轮廓会随运动、挤压和流场缓慢变化，不会突然切换形状。二维视图的“缓慢相融”使用连续密度场生成共同液面，靠近时形成液颈，拉开后分离；“柔软接触”减少未接触液滴之间的场叠加；速度与接触压力影响轮廓的拉伸、压缩，液面采用半透明浅红材质，细高光沿边缘变化，后方文章连线仍然可见；“通透度”滑块可调整液面填色浓度，向右更通透。三维视图使用有厚度的透光材质。默认“柔软接触”会保持液滴各自的轮廓，沿碰撞方向挤压、向侧面展开并逐渐恢复，变形尽量保持体积；二维也会减少接触前的长距离粘连。选择“缓慢相融”后，只有液面接近实际接触时才开始生成融合表面，液颈逐渐形成，拉开后分离。液面相融只是视觉效果，不会新增文章链接。

默认按本浏览器的文章阅读频率分配流动强度：经常阅读、近期打开的文章更活跃，少读或很久未读的文章更安静。记录仅保存在本机，不统计私密空间内容；快速刷新不重复计数。关闭“按阅读频率调节”可统一使用整体流动强度。降低“流动强度”可以减少持续漂移，方便阅读连接和标题；调到 0% 后，手动拖拽和接触仍然有效。

三维视图使用 Three.js 渲染通透、不规则的液滴，在三轴上计算连线弹性、软接触、黏性与拖拽惯性；二维视图使用 Matter.js。两种视图都以固定的 120 Hz 步长更新物理。连续接触压力、邻域黏性和阻尼共同控制碰撞，变形采用渐进恢复，液滴挤扁时向两侧展开。不同屏幕刷新率使用同一运动节奏，回到后台页面时不会突然加速补算。连线始终对应文章之间的链接。

切换到“清晰模式”可收起液态装饰。暂停会同时停止节点和流动效果，系统偏好减少动画时默认暂停。这是交互视觉模拟，不用于工程流体计算。
