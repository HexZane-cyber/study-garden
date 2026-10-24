---
title: 知识电路
comments: false
---

# 知识电路

保留会流动、可拖动的液态球球，把它们之间的连接改成芯片元件间的电路走线：从球体表面接出短引脚，沿折线路径连接，在转角处作小倒角。每个球球仍对应一篇文章，走线来自文章里的真实链接。笔记越多，电路中的节点与连接越丰富。

单击球球查看关联并打开笔记；双击球球直接阅读。点击走线，可以查看和打开两端文章。需要固定阵列布局和课程进度筛选时，可切换到[阵列视图](chip.md)。

<div class="graph-wrap">
<div class="graph-toolbar"><input id="graph-search" aria-label="搜索知识节点" placeholder="搜索节点，例如：Python、矩阵…"><button id="graph-mode" type="button" aria-pressed="true">液态模式</button><button id="graph-pause" type="button">暂停运动</button><button id="graph-reset" type="button">重置视图</button></div>
<div class="flow-control"><span>FLOW / 流动强度</span><input id="graph-flow" aria-label="流动强度" type="range" min="0" max="100" value="55"><span id="graph-flow-value">55%</span><label class="graph-glass-control">通透度 <input id="graph-transparency" aria-label="液面通透度" type="range" min="35" max="90" value="74"><span id="graph-transparency-value">74%</span></label><label class="graph-glass-control">倒角 <input id="graph-bend" aria-label="电路走线倒角" type="range" min="0" max="60" value="28"><span id="graph-bend-value">28%</span></label><label class="graph-activity-toggle"><input id="graph-activity" type="checkbox" checked> 按阅读频率调节</label></div>
<div class="graph-tools"><label>视图<select id="graph-view" aria-label="图谱维度"><option value="3d">三维空间</option><option value="2d">二维液面</option></select></label><label>接触<select id="graph-contact" aria-label="液滴接触方式"><option value="soft">柔软接触</option><option value="merge">缓慢相融</option></select></label><label>标题<select id="graph-labels"><option value="smart">智能避让</option><option value="all">显示全部</option><option value="off">仅选中与悬停</option></select></label><button id="graph-focus" type="button" aria-pressed="false" disabled>只看直接关联</button><button id="graph-fit" type="button">适应画布</button><button id="graph-expand" type="button" aria-pressed="false">大画布</button><span id="graph-hint">点击节点查看关联，拖动空白处平移</span></div>
<div class="graph-tools"><label><input id="graph-transfer" type="checkbox" checked> 靠近时吐出小液滴</label><span>小液滴飞向邻近节点并融入，仅作视觉互动。</span></div>
<details class="graph-gravity"><summary>重力与倾斜 · 让知识随方向流动</summary><div class="gravity-controls"><button id="graph-gravity-pad" type="button" aria-label="重力方向盘，拖动或用方向键调整，Home 归零"><span aria-hidden="true">＋<i></i></span></button><div class="gravity-settings"><label>重力模式<select id="graph-gravity-mode" aria-label="重力模式"><option value="off">关闭</option><option value="manual">手动方向</option><option value="orbit">缓慢旋转</option></select></label><label>重力强度<input id="graph-gravity-strength" aria-label="重力强度" type="range" min="0" max="100" value="50"><output id="graph-gravity-value">50%</output></label><div class="gravity-presets"><button type="button" data-gravity-direction="0,1">向下</button><button type="button" data-gravity-direction="-1,0">向左</button><button type="button" data-gravity-direction="1,0">向右</button><button type="button" data-gravity-direction="0,-1">反重力</button><button type="button" data-gravity-direction="0,0">方向归零</button><button id="graph-gravity-sensor" type="button" aria-pressed="false">跟随设备倾斜</button></div></div></div><p id="graph-gravity-status" role="status">重力默认关闭。拖动方向盘、使用方向键，或选择一种模式开始。</p></details>
<details class="graph-palette"><summary>颜色设置</summary><div class="graph-palette-controls"><label>修改对象<select id="graph-color-target" aria-label="颜色修改对象"><option value="node">当前选中节点</option><option value="course">课程默认色</option><option value="note">笔记默认色</option><option value="tool">工具默认色</option><option value="guide">指南默认色</option><option value="line">关系连线</option></select></label><label>调色盘<input id="graph-color-wheel" type="color" aria-label="图谱颜色盘" value="#ef5467"></label><label>颜色值<input id="graph-color-hex" aria-label="十六进制颜色" type="text" maxlength="7" value="#ef5467" placeholder="#ef5467" spellcheck="false"></label><button id="graph-color-apply" type="button">应用颜色</button><button id="graph-color-inherit" type="button">当前节点跟随分类</button><button id="graph-color-reset" type="button">恢复默认配色</button><span id="graph-color-status" role="status" aria-live="polite">先选择节点，或选择要修改的分类与连线。</span></div><p>单独设置的节点颜色优先于分类默认色。配色仅保存在本浏览器，三维与二维共用。</p></details>
<p id="graph-render-status" class="reading-meta" role="status" hidden></p>
<div class="graph-stage"><canvas id="knowledge-graph" role="img" aria-label="可拖拽的课程与笔记关系图。键盘用户可使用下方的文章列表。" tabindex="0"></canvas><canvas id="knowledge-graph-3d" aria-label="三维知识图谱：拖动空白旋转，滚轮缩放，拖动液滴移动节点。" tabindex="0" hidden></canvas></div>
<div class="graph-legend"><span><i data-graph-group="course" style="background:#ef5467"></i>课程</span><span><i data-graph-group="note" style="background:#ff9a81"></i>笔记</span><span><i data-graph-group="tool" style="background:#d69767"></i>工具</span><span><i data-graph-group="guide" style="background:#9e919b"></i>指南</span></div>
<div id="graph-info" class="graph-info" aria-live="polite">正在加载知识图谱…</div>
</div>

<details class="graph-keyboard"><summary>按列表访问所有文章（支持键盘操作）</summary><ul id="graph-links"></ul></details>

<details class="graph-keyboard"><summary>按列表选择电路走线（支持键盘操作）</summary><ul id="graph-edge-links"></ul></details>

## 球球与电路走线

节点仍可拖动、柔软碰撞，也支持三维旋转和二维平移。连接从球体表面接出，经过短引脚和横纵折线，在转角处作倒角；三维走线沿空间坐标轴布置。拖动时，路径随端点连续变化，不按网格突然跳动，也不再产生随时间摆动的弧线。倒角滑块控制转角的截角大小。

单击走线后，右上方会出现两端文章入口，下方列表也可用键盘选择关系。走线交叉只表示视觉重叠，不是新增连接；只有原文中的 Markdown 链接才会成为知识关系。两个液滴重叠时，暂时收起它们之间的短连接，分开后恢复。

## 阅读与操作

单击球球查看关联并通过快捷入口阅读；双击同一球球或在选中后按 Enter 可直接打开。拖拽、取消手势不会打开文章。三维标题是可直接打开的文章链接，支持键盘操作；也可使用下方的文章列表。

默认三维视图，拖动空白处旋转、滚轮缩放；可切换到二维。浏览器不支持 WebGL 时回到二维。开启“只看直接关联”可以减少视觉干扰，选择“适应画布”查看可见节点。“颜色设置”提供球球、分类和连线调色盘。大画布可用 Escape 退出。

## 液态与重力

流动强度、通透度、柔软接触、靠近时传递小液滴、按阅读频率调节活动度，以及手动重力方向均保留。系统偏好减少动画时默认暂停，点击“暂停运动”可随时停止。融合与液态是视觉近似，文章关系不会因此发生变化。

阅读频率与配色保存在本浏览器；个人私密空间中的加密文件不会出现在公开关系图中。在[笔记](notes/index.md)中添加文章和站内 Markdown 链接，重新发布后即可增加球球与电路走线。固定元件阵列与课程进度筛选在[阵列视图](chip.md)中使用。


