---
title: 知识电路
comments: false
---

# 知识电路

把课程与笔记连成一座三维堆叠封装的知识芯片。每篇文章对应硅片中的一个矩形功能区，文章之间的真实链接沿横纵走线连接；课程、笔记、工具和指南分别组成不同功能区。每层容纳最多 12 个功能区，新增笔记会自动增加层数；跨层关系在硅片内的对齐互连位置连接。

单击元件查看内容、章节目录与直接连接，双击打开文章；单击走线查看两端文章。可以搜索、按学习进度筛选，或放大电路板逐个探索。信号只在选中的关系上流动，空闲时画布保持静止。

<div class="chip-shell">
<div class="chip-heading"><div><small>ZHIXIN / YOUR KNOWLEDGE CIRCUIT</small><strong id="chip-summary">正在读取模块…</strong></div><a id="chip-publish" href="../publish/">发布新笔记 ↗</a></div>
<div id="chip-learning-summary" class="chip-learning-summary" role="status"></div>
<div class="chip-toolbar"><input id="chip-search" type="search" aria-label="搜索芯片模块" placeholder="搜索笔记或课程…"><select id="chip-group" aria-label="模块分类"><option value="">全部模块</option><option value="note">笔记阵列</option><option value="course">课程模块</option><option value="tool">工具接口</option><option value="guide">学习指南</option></select><select id="chip-progress" aria-label="学习进度筛选"><option value="">全部学习状态</option><option value="planned">已加入计划</option><option value="learning">正在学习</option><option value="done">已完成</option><option value="todo">未开始</option></select><button id="chip-clear" type="button" hidden>清除筛选</button><button id="chip-fit" type="button">查看整块电路板</button><button id="chip-out" type="button" aria-label="缩小芯片">−</button><span id="chip-zoom">100%</span><button id="chip-in" type="button" aria-label="放大芯片">＋</button><button id="chip-expand" type="button" aria-pressed="false">大画布</button><label><input id="chip-signals" type="checkbox" checked> 信号流动</label></div>
<div class="chip-toolbar chip-spatial-tools"><label>视图 <select id="chip-view" aria-label="电路视图"><option value="3d">三维层叠</option><option value="2d">二维总览</option></select></label><label class="chip-layer-control">查看层 <select id="chip-layer" aria-label="查看电路层"><option value="-1">全部层</option></select></label><label class="chip-layer-control">层间距 <input id="chip-layer-gap" aria-label="层间距" type="range" min="12" max="260" value="12" step="1"><output id="chip-layer-gap-value">12</output></label><button id="chip-explode" type="button" aria-pressed="false">展开芯片</button><button id="chip-lid" type="button" aria-pressed="false">打开顶盖</button><label><input id="chip-structure" type="checkbox" checked> 结构标注</label><span id="chip-3d-status" role="status">正在准备三维电路…</span></div>
<div class="chip-toolbar chip-layout-tools"><label><input id="chip-edit" type="checkbox"> 编辑布局</label><span>三维中调整矩形功能区的类型、大小与位置，保存在本浏览器</span></div>
<div id="chip-editor" class="chip-toolbar chip-layout-tools" hidden><strong id="chip-edit-name">先选择一枚模块</strong><label>功能区 <select id="chip-shape" aria-label="功能区类型"><option value="die">计算核心</option><option value="memory">存储阵列</option><option value="logic">控制逻辑</option><option value="io">I/O 接口</option></select></label><label>大小 <select id="chip-scale" aria-label="模块大小"><option value="80">小 · 80%</option><option value="100">标准 · 100%</option><option value="115">大 · 115%</option></select></label><label>X <input id="chip-position-x" aria-label="模块 X 位置" type="number" step="5" min="-290" max="290"></label><label>Z <input id="chip-position-z" aria-label="模块 Z 位置" type="number" step="5" min="-150" max="150"></label><label><input id="chip-snap" type="checkbox" checked> 网格吸附</label><button id="chip-reset-module" type="button">恢复此模块</button><span id="chip-edit-status" role="status">拖动模块在本层摆放；空白处仍可旋转。</span></div>
<div id="chip-results" class="chip-results" aria-label="模块搜索结果" hidden></div>
<div class="chip-stage"><canvas id="knowledge-chip" tabindex="0" aria-label="知识芯片，单击模块或走线，拖动平移，滚轮缩放。也可使用下方模块和连接列表。"></canvas><canvas id="knowledge-chip-3d" hidden tabindex="0" aria-label="三维层叠电路，拖动旋转、滚轮缩放，单击元件或走线，双击阅读。方向键旋转，Enter 打开已选文章。"></canvas><div id="chip-status" class="chip-status" role="status">正在布置芯片…</div><div id="chip-help" class="chip-help">单击模块或走线 · 双击模块打开文章 · 拖动平移 · 滚轮缩放</div></div>
<div id="chip-panel" class="chip-panel" aria-live="polite">选择模块查看文章，或点击走线探索关系。</div>
<div id="chip-size" class="chip-size"></div>
</div>

<details class="chip-list"><summary>按列表访问模块（支持键盘操作）</summary><ul id="chip-articles"></ul></details>
<details class="chip-list"><summary>按列表选择走线（支持键盘操作）</summary><ul id="chip-nets"></ul></details>

## 电路板怎样长大

把笔记发布到本站的 `docs/notes/` 目录后，部署时会自动生成新的笔记模块。三维视图每 12 个同类元件增加一层；二维总览则扩展阵列行列与电路板外框；课程、工具和指南各有自己的区域。这里的尺寸表示知识布局，不是学习成绩或真实芯片制程。

走线的交叉仅表示视觉重叠，不会凭空增加知识关系。

在笔记中添加指向其他站内文章的 Markdown 链接，就会出现对应走线。选中模块可以阅读文章、查看直接关系；选中走线可以打开两端文章。走线可点击，但不会改动笔记内容。发布步骤见[上传与发布](publish.md)。

选中模块或走线后，可以「复制此处链接」，重新打开链接时直接定位到对应对象。浏览器前进、后退也会恢复已浏览的选择与视图。模块关联较多时，展开面板中的其余关联即可继续阅读或定位，不再只显示前六条。

本页展示已发布到站点的文章。保存在[个人私密空间](private.md)的加密笔记继续保持独立，不会自动出现在公开电路板中。

## 阅读与操作

选中任意模块后，下方固定信息面板会显示对应文章的章节目录。点击章节直接跳到该文章的位置，目录不会随三维旋转或分层动画移动；可折叠目录以腾出空间。章节标题和链接随文章重新发布自动更新，没有分节标题的文章会显示说明。

课程模块会显示本浏览器在课程目录、学习路线或课程页保存的进度。可以筛选已加入计划、正在学习、已完成或未开始的课程；选中模块后，进入课程页继续学习和修改进度。其他标签页更新记录后，芯片会同步显示。位置链接只定位公开模块，不包含自己的学习进度。

搜索会列出匹配模块的完整标题，可以定位，也能直接阅读；唯一匹配会自动定位，在搜索框按 Enter 即可打开。分类和搜索会同时筛选下方模块列表，「清除筛选」恢复整体。多条走线共用通道时，可在文章入口旁的「切换重叠走线」中选择具体关系。

三维视图中，拖动空白旋转、右键拖动平移、滚轮或双指缩放；方向键也可旋转。默认显示完整的金属顶盖、封装基板和底部焊球；点击“展开芯片”，各层会依次轻柔起落，镜头缓缓跟进，连线同步伸展；点击“收紧封装”逐层合拢。系统偏好减少动画时直接切换。展开后可查看内部结构，也可使用“层间距”调节，使用“查看层”抽出任意一层。搜索或列表定位会自动显示目标所在层。跨层走线在硅片范围内通过对齐的互连位置连接各层；选中跨层关系时恢复全部层，便于查看两端。可随时切回二维总览；三维不可用时自动回退。

芯片较大时，点击「查看整块电路板」回到整体布局，或放大后拖动阅读细节。手机和平板支持双指缩放，并随双指中心平移；双指手势不会误打开文章。「信号流动」只为选中的关系播放少量光点，关闭后保持静止；系统偏好减少动画时默认关闭。

键盘可使用下方列表选择模块或走线。在二维画布上，方向键平移；三维中则旋转视角。`+` / `−` 缩放，`0` 查看整体，`Enter` 打开已选模块，`Escape` 取消选择或退出大画布。


开启「编辑布局」后，拖动模块即可在所属层内重新摆放，功能区之间保留间距，避开互连保留区，走线会跟随位置更新。可选计算核心、存储阵列、控制逻辑或 I/O 接口，均采用矩形版图，并调整大小；X / Z 数值也能通过键盘精确修改。「网格吸附」让位置更整齐；拖动时按 Esc 可撤销，点击「恢复此模块」恢复默认类型与位置。布局只保存在当前浏览器，不会修改文章，也不随分享链接发送；清除网站数据会清除布局。切换二维时显示默认总览。

## 封装结构与观察方式

默认显示带镀镍铜顶盖的完整封装，下方是有机封装基板和 BGA 焊球。点击「打开顶盖」观察紧密堆叠的硅片；点击「展开芯片」查看硅片、中介层与连接界面。硅片内的笔记显示为矩形功能区，使用计算逻辑、存储阵列与 I/O 的不同纹理，布局可在所属硅片上调整。

这是参考实际三维封装结构绘制的知识可视化模型，不对应某一款量产芯片。内部版图是程序绘制的示意纹理；展开间距、硅片厚度及互连尺寸经过放大，以方便选择和阅读。展开状态的虚线表示原有层间连接的位置，不是实际芯片悬空拉长的导体。

结构参考：[Intel 先进封装](https://www.intel.com/content/www/us/en/foundry/packaging.html)、[TSMC 三维芯片堆叠](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/SoIC.htm)。
