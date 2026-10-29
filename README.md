# 之芯

**正式网站：[https://hexzane-cyber.github.io/study-garden/](https://hexzane-cyber.github.io/study-garden/)**

`http://127.0.0.1:8080/` 是当前电脑的本地预览，只有预览服务运行时才能访问。已安装 Python 的 Windows 电脑可双击仓库根目录的 `start-preview.cmd`：检查首页就绪后自动打开浏览器，预览在后台运行，启动窗口可以关闭。重复双击会复用本项目服务；双击 `stop-preview.cmd` 可以停止预览。重启电脑后需要重新启动，本工具不会设置开机自启，也不会结束占用端口的其他程序。

如果打不开，先双击 `start-preview.cmd`，不要只刷新失效的网址。仍有问题可运行 `python tools/preview.py --status` 检查服务与首页，启动日志位于 `.tooling/preview-8080.log`。使用完整的 `http://` 地址；本机预览和上面的正式网站是两个入口，浏览器中的个人记录也分别存储。

之芯是整理课程、记录笔记与连接知识的个人学习网站，基于 Material for MkDocs，采用红黑渐变与深色阅读界面。

日常维护请阅读[之芯网站编辑手册](docs/editor-manual.md)：包含页面与课程编辑、附件、知识电路、背景、本地预览、发布及恢复流程。

课程目录支持多关键词和全角英文搜索、学习方向筛选、相关度排序及筛选链接分享。筛选条件保留在网址中，刷新后可恢复；清空筛选不删除学习计划、进度或当前对比。复制失败时提供手动复制入口。

## 内容与交互

- 左侧多层课程目录、中间文章、右侧页内目录。
- 工作台只读汇总待纠错题，可确认后安排重做任务；任务保留原题入口并支持恢复上一份任务草稿。
- 中文/英文全文搜索、浅色/深色切换、代码高亮与复制。
- 课程与笔记以 Markdown 保存在 docs/，上传到 docs/notes/ 的笔记自动进入导航。
- 知识芯片：文章组成分区模块，真实链接生成直角电路走线；笔记阵列自动扩容，支持搜索定位、分类、模块和走线点击、文章入口、缩放平移、大画布和可关闭的信号动画。
- 图谱从文章中的相对 Markdown 链接自动生成；不使用 AI 推测关联。
- 图谱重力支持手动方向盘、强度调节、旋转场和主动开启的设备倾斜；二维与三维共用控制，方向平滑改变，弹性边界限制持续下落。传感器不可用时可继续手动控制，后台停止跟随。
- 液滴默认柔软接触，沿接触方向压缩并保持体积缩放；可切换缓慢相融，按实际表面距离判断接触，减小提前粘连和液颈突然生成。
- 页面底部链接到 GitHub Discussions，提供可选 Giscus 嵌入模板。
- 原先的笔记工作台保留为 /workbench/ 草稿辅助工具。
- 共建课程：站内表单预览 → GitHub Issue → 维护者审核 → 生成课程 Markdown → 正式收录。提案状态不会冒充已发布内容。
- 本机加密私密空间：PDF、Markdown、TXT、图片与 Obsidian 文件夹导入，基础双向链接浏览，笔记编辑，自动锁定、加密备份与恢复。
- 收藏文章和最近阅读记录。
- 数据与备份中心：按类型导出任务、复习卡、课程进度、阅读记录和原创习题作答，导入前预览，合并保留本机同编号内容与运行计时。读取损坏时停止写入并支持原始记录导出；加密空间仍单独备份。
- 本地复习卡：文章选文制作草稿、分组与搜索、先回忆再揭示答案、固定间隔复习、可撤销删除和 JSON 备份。数据不上传，普通浏览器存储未加密；私密资料继续使用加密空间。
- 学习互动：复习时先写临时回答再对照答案，本次目标与换卡不会自动改动原卡的到期时间；工作台支持按方向、建议时长和课程抽取行动卡，确认后再保存为任务。

## 私密空间的边界

这是浏览器本地加密空间，不是云端账号或跨设备同步服务。每个空间使用 PBKDF2-HMAC-SHA256（600,000 次）派生独立的 AES-256-GCM 密钥；每个 1 MB 分块使用随机 96 位 IV，并通过附加认证数据绑定空间、文件和分块序号。密钥不可导出，不持久化口令。文件名、路径、正文和附件均加密；空间名称在本机列表中可见。

单文件最大 128 MB，单空间最大 256 MB。加密备份为 .sgvault，不含明文文件名和正文；原口令无法找回。清理浏览器数据可能丢失未备份的资料。解锁期间，已控制设备或同源页面脚本仍可能接触明文，不能把它当作对受控设备的保护。

导入 Obsidian 请选择文件夹，支持 [[笔记]]、[[路径|别名]] 和 ![[图片]] 的基础解析；不执行插件或 HTML。改动不会同步回原 Obsidian 文件夹。

## 共建与审核

外部访客使用 /contribute/ 投稿到 GitHub Issue，不能通过投稿表单写入仓库。维护者审核后，使用卡片中的“生成收录草稿”提交 docs/courses/community/issue-N.md。构建自动识别 submission_issue 元数据并更新收录状态。

默认公开仓库不向访客授予写入权限，未配置自动合并或自动发布 Issue 内容。CODEOWNERS 指定维护者，外部 PR 的内容范围检查只允许新增社区课程 Markdown。若以后邀请具有写入权限的协作者，请在 Settings → Branches 开启主分支保护，要求 PR 审核、Code Owner 审核以及 contribution-scope 检查；CODEOWNERS 文件自身不等同于强制分支保护。

## 本地运行

```powershell
python -m pip install -r requirements.txt
python build.py
python -m http.server 8080 --directory site --bind 127.0.0.1
```

打开 http://127.0.0.1:8080 。如依赖已安装到本项目 .deps/，build.py 会自动加载它。

## GitHub Pages 部署

把本目录源码作为仓库根目录（包括 .github/）。仓库 Settings → Pages → Source 选择 GitHub Actions。提交到 main 后自动构建，发布内容来自 site/，不需要提交生成文件。

仓库默认设置为 HexZane-cyber/study-garden。如使用其他仓库，请修改 mkdocs.yml 中 repo_url、repo_name 以及 config.json。

## 上传笔记

在 GitHub 进入 docs/notes/，使用 Add file → Upload files 上传 Markdown，或直接新建文件。文件首个一级标题是文章名称。提交后自动加入导航、搜索和关系图。附件可放到 docs/attachments/，使用相对链接引用。

```markdown
# 二分搜索

这里用到了[算法基础](../courses/algorithms.md)中的知识。
```

关系图根据上面的链接自动连接两篇文章。正文支持标准 Markdown 表格、图片、代码块、提示框和任务列表。默认不加载数学排版引擎。

## 讨论

在仓库 Settings → General → Features 开启 Discussions。默认每页底部是仓库讨论链接。

要启用页面内评论，需在 https://giscus.app 为仓库安装 Giscus，选择讨论分类，把生成的 repo_id、category_id 填入 mkdocs.yml 的 extra.giscus。安装授权需要仓库所有者操作。未配置时不加载 Giscus。

## 草稿和正式内容

正式内容保存在 docs/ 中，由 Git 管理。/workbench/ 中的草稿与课程进度保存在当前浏览器，通过 JSON 导出备份。把 Markdown 上传到 docs/notes/ 才会成为主站内容。主站导航与图谱不读取浏览器私有草稿。

## 项目结构

- mkdocs.yml：目录、主题、仓库与评论配置。
- docs/：正式文章和前端资源。
- hooks.py：自动笔记导航、知识图谱、草稿工作区打包。
- docs/assets/graph.js：使用 Matter.js 0.20.0 的 Canvas 关系图。
- overrides/partials/comments.html：讨论与评论模板。
- build.py：严格构建入口。
- .github/workflows/pages.yml：自动部署。

## 验证

```powershell
python build.py
python -m unittest discover -s tests -p "test_*.py"
node tests/core.test.cjs
node tests/fluid.test.cjs
node tests/contributions.test.cjs
node tests/vault.test.cjs
node --check docs/assets/graph.js
```

课程目录交互验证（需安装 `tests/` 的既有开发依赖）：

```powershell
npm ci --prefix tests --ignore-scripts
node tests/learning-ui.test.cjs
```

覆盖筛选链接恢复、组合搜索、分页、清空时保留进度与对比、原站链接、剪贴板失败回退、历史导航，以及课程详情和路线页面的兼容性。

图谱使用稳定的目录 URL；节点位置仅用于临时探索，刷新后重新布局。提供文章列表方便键盘操作，系统偏好减少动画时默认暂停运动。

私密空间完整集成测试（使用内存数据库和虚拟页面，测试数据不进入真实浏览器）：

```powershell
npm install --prefix tests
node tests/vault-integration.test.cjs
```

## 交互优化

图谱使用固定 120 Hz 积分、带阻尼的弹簧拖拽、惯性释放、软接触压力与渐进形变；测试覆盖 30/60/144 Hz 刷新率一致性和碰撞耗散。页面按用途加载图谱、投稿和加密脚本。

私密空间支持拖入普通文件、目录筛选、类型筛选、名称/修改时间/大小排序、可中止导入和专注阅读。编辑支持 Ctrl/Command + S 加密保存，切换与手动锁定前提醒未保存修改。持久存储请求取决于浏览器，不替代备份。集成测试还覆盖锁定与异步读取竞争、原子编辑和备份冲突回滚。

液态图谱使用等密度轮廓生成连续液面，支持液颈融合与分离、速度拉伸和接触形变。按本机文章阅读次数与最近阅读时间分配各节点流动强度，频率记录存于本地，不统计私密空间内容；可在图谱页关闭。新增纯函数测试：`node tests/liquid-surface.test.cjs`、`node tests/article-activity.test.cjs`。

## 保留的三维图谱源码

当前 `/graph/` 使用知识芯片，入口脚本是 `docs/assets/chip.js`，布局与走线算法在 `docs/assets/chip-model.js`，测试为 `node tests/chip.test.cjs`。页面仅加载芯片控制器、布局和交互辅助脚本。新增公开笔记后，部署会更新图数据，芯片按实际模块数扩展。

旧版 Three.js 0.186.1 和 Matter.js 实现保留在源码中，当前页面不加载它们。旧版包含轨道旋转、液滴拖拽、软接触、重力与流场，以下构建与测试说明用于维护这些保留文件。

三维前端源码在 frontend/；发布用打包文件已提交在 docs/assets/vendor/graph3d.bundle.js，MkDocs 构建不需要 Node 依赖。修改三维源码后重新生成：

```powershell
npm ci --prefix frontend
npm run build --prefix frontend
python build.py
node tests/graph3d.test.cjs
```

三维物理测试覆盖深度分布、布局稳定、软接触、重叠分离、拖拽惯性、频率流动和重置；图谱集成测试覆盖三维控制同步及 WebGL 失败回退。

图谱关系线支持可调弧度的三维曲线，光点沿同一条曲线运动。颜色设置提供系统调色盘与颜色值输入，可分别修改单个节点、分类默认色与连线，配置仅保存在本浏览器。三维粘连由节点距离场的平滑合并生成共同表面，取代独立圆管；接触处顶点颜色连续混合。相关数学、分离、配色与持久化测试：`node tests/graph-visuals.test.cjs`。

私密空间支持 Office、PDF、Markdown、图片、音视频、CSV、源代码、电子书与压缩包批量导入。可预览文本、PDF、图片及浏览器支持的音视频；Office、电子书和压缩包保存原件并支持下载，不使用第三方预览服务。单文件仍限 128 MB，每空间 256 MB。

全站阅读工具提供 Ctrl/⌘+K 快速页面切换、字号调整、专注模式、复制链接和文章阅读位置恢复。链接按悬停/聚焦意图预加载，每页最多四个且遵循省流量与低速网络提示；仓库链接不再加载 GitHub 星标统计。

课程目录与学习进度：37 项课程与实践资源，支持方向、难度、时长预算和状态筛选、先修提示、路线下一步建议与本机进度 JSON 备份。每项资源标注本站估算的总投入范围与建议节奏。目录数据在构建时嵌入对应页面，不依赖浏览时访问外部 API。课程路径、先修引用及环路会在构建时检查。

视觉与学习工作台：赤雾、轨迹、静夜三种背景，浓度控制及默认关闭的指针光晕；首页进入 dashboard/ 管理本机任务、课程续学、专注计时、每日目标和七日统计。工作台任务与计时可以明文 JSON 备份，不含私密空间文件；课本仍在原加密资料库中。


### 原创习题与本地 AI

`docs/assets/exercises.json` 提供 28 道原创自测。`/exercises/` 可按课程查看全部相关自测与进度、保存作答、按未作答/待纠错/检查通过筛选、复制正式站点的单题链接并单独导出备份；`/local-ai/` 支持用户主动下载 WebLLM 小模型或连接本机 Ollama。AI 对话仅在页面内存中保留，不自动读取私密空间，不参与练习判分。助手还提供可恢复的提问模板、设备与存储估计、分类型失败提示，以及不含对话内容的连接诊断导出。课程页可带入公开简介与先修名称；课程、习题和自由问答按主题使用独立请求历史，旧消息仍可查看与导出。首次使用与兼容性说明见 `docs/local-ai.md`。

AI 运行库固定 WebLLM 0.2.86，更新时运行 `npm ci --prefix frontend --ignore-scripts` 和 `npm run build:ai --prefix frontend`；提交生成的两个 bundle 及许可。权重由用户点击下载，不包含在仓库。新增习题需同时补充独立答案复核测试。

课程目录、路线和课程页可查看完整先修与直接后续，去除共享基础的重复项，并跳到学习任务和已有的本课自测。补入先修需要显式点击，只修改预览中仍未开始的课程。课程状态修改会先检查现有记录、重新读取最新状态；损坏记录停止覆盖并提供原始导出，同课程跨页冲突保留新状态，单独导入只补充本机缺失记录。

工作台支持从待办直接开始任务专注，保存启动时标题与课程，回看最近 7 天记录并按课程筛选、定位原任务。结束计时不自动改变任务完成状态；已有计时不会被另一任务替换。近期记录与普通自主专注保持兼容，仍只保存在本浏览器。


本机访问检查：在项目文件夹双击 `check-preview.cmd`，窗口会保留检查结果，区分服务未启动、尚未构建、端口未识别和首页可访问，并给出下一步。也可运行 `python tools/preview.py --diagnose`。检查不会启动或停止服务，不更改代理、防火墙或浏览器数据；它只能验证本机 HTTP 响应，不能替代对具体浏览器的实际检查。
