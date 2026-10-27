---
title: 之芯网站编辑手册
comments: false
---

# 之芯网站编辑手册

这份手册针对「之芯」现有源码编写，核对日期为 **2026-10-26**。适合从“修改一段文字”逐步学到“新增课程、修改界面、预览和发布”。功能与路径以当前项目为准，不把旧版球形图谱当作正在使用的入口。

- 正式网站：[之芯](https://hexzane-cyber.github.io/study-garden/)
- 源码仓库：[HexZane-cyber/study-garden](https://github.com/HexZane-cyber/study-garden)
- 日常上传入口说明：[上传与发布](publish.md)

> 最常见的修改是编辑 `docs/` 下的 Markdown。不要直接修改 `site/` 里的生成文件，也不要把根目录的旧 `index.html` 当成正式首页。

## 1. 先选适合自己的编辑方式

| 你要做什么 | 建议方式 | 是否需要本地环境 |
| --- | --- | --- |
| 改一段文字、修一个课程链接 | GitHub 网页编辑 | 不需要 |
| 上传几篇公开笔记和附件 | GitHub 文件上传，检查相对路径 | 不需要 |
| 新增正式课程、修改导航或多处内容 | 本地编辑、构建后提交 | 需要 Python |
| 修改三维芯片材质、相机或交互 | 修改前端源码并重新打包 | 需要 Python 和 Node.js |
| 只推荐课程，不维护项目代码 | [共建课程](contribute.md)提交 Issue | 不需要仓库写入权限 |
| 存放私人笔记、未公开课本 | [个人私密空间](private.md) | 不提交到公开仓库 |

**发布边界：** 网站和仓库中的正式内容是公开的。工作台草稿、课程进度、复习卡和加密资料库是浏览器本地数据；它们不会因为点击 GitHub 提交而自动发布，也不会自动成为网站文章。

## 2. 找对文件：项目地图

以下路径都相对于含有 `mkdocs.yml` 的 **study-garden 项目目录**：

| 路径 | 负责什么 | 什么时候改 |
| --- | --- | --- |
| `docs/index.md` | 正式网站首页 | 改首页介绍、按钮与入口 |
| `docs/notes/*.md` | 公开笔记 | 添加和编辑文章；递归扫描子文件夹 |
| `docs/courses/*.md` | 正式课程指南 | 改重点、先修、资源、练习建议 |
| `docs/courses/community/*.md` | 审核后收录的社区课程 | 维护投稿课程 |
| `docs/attachments/` | 建议存放图片、公开附件 | 自行创建后上传并引用 |
| `docs/assets/course-catalog.json` | 课程筛选、时长、先修和学习路线数据 | 让课程进入进度系统 |
| `docs/course-links.md` | 优质课程链接汇总 | 只新增资源入口 |
| `docs/university-courses.md` | 名校课程重点与先修 | 增补课程介绍 |
| `docs/course-practice.md` | 习题、测验、提交平台入口 | 维护作业与平台信息 |
| `docs/course-materials.md` | 讲义、笔记、试卷和答案清单 | 维护材料条目 |
| `docs/assets/course-materials/` | 公开材料索引、署名和获准的 PDF 副本 | 有依据地更新资料 |
| `mkdocs.yml` | 站名、导航、Markdown 扩展、资源加载、评论配置 | 改网站结构 |
| `docs/assets/extra.css` | 网站样式、背景与各功能界面 | 改视觉效果 |
| `docs/assets/appearance.js` | 背景选择、浓度与本机外观偏好 | 改外观控制逻辑 |
| `hooks.py` | 自动导航、图谱数据、课程校验、构建注入 | 修改自动生成规则 |
| `overrides/main.html` | 按页面加载脚本的主题模板 | 新增或调整功能脚本 |
| `frontend/chip3d.js`、`frontend/chip-materials.js` | 当前三维芯片渲染与材质 | 改三维外观 |
| `docs/assets/chip.js`、`chip-model.js`、`chip-stack.js` | 芯片控制、二维布局、层叠模型 | 改芯片布局和交互 |
| `build.py` | 严格构建入口 | 通常只运行，不必改 |
| `.github/workflows/pages.yml` | GitHub Actions 构建、验证和部署 | 改发布流程 |

### 哪些文件不是日常编辑入口

- `site/` 是构建结果，下次构建会重新生成。
- `docs/assets/graph-data.json` 和 `published-courses.json` 由构建生成，不手工维护。
- 根目录 `index.html`、`app.js`、`style.css`、`config.json` 和 `content/*.json` 为旧草稿工作台提供内容，不是当前正式首页或课程目录。
- `frontend/graph3d.js` 等旧液态球形图谱文件仍保留；当前 `/graph/` 加载的是知识芯片。
- `.tooling/`、`.deps/`、离线材料 ZIP 等被 Git 忽略。新克隆的仓库不保证有这些本机辅助文件，不要让日常写文章依赖它们。

## 3. 最简单：在 GitHub 修改现有页面

1. 进入仓库，打开 `docs/` 中对应的 `.md` 文件。
2. 点击编辑按钮。也可以从网站文章的铅笔入口跳过去。
3. 修改文字，查看 Preview，检查链接和图片路径。
4. 点击 **Commit changes**，填写清楚的说明，例如“修正信号课程的官方讲义链接”。
5. 只有一处简单修改且规则允许时，可提交到 `main`；涉及结构或多文件时，建议新分支和 Pull Request。
6. 提交进入 `main` 后，在仓库 **Actions** 查看 **Deploy Study Garden**。必须等部署步骤成功，再到正式网址检查。

GitHub 自身的 Markdown 预览不完全等于本站效果：Material 提示框、构建注入的学习时长和三维交互，要在站点构建后检查。若主分支保护限制直接提交，请按仓库规则走分支与 PR，不要绕过保护。

依据：[GitHub 官方文件编辑说明](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)。

## 4. 新增公开笔记、图片和 PDF

### 4.1 一篇笔记的最小例子

新建 `docs/notes/my-first-note.md`，内容可以是：

```markdown
# 我的第一篇学习笔记

## 我想解决的问题

用自己的话写清楚问题。

## 关键结论

写明结论及其适用条件。

## 例题与复盘

- [ ] 独立完成一道代表性习题

## 相关知识

复习[信号与系统](../courses/ee-signals.md)中的对应内容。
```

构建时，这篇笔记会自动加入“我的笔记”导航、搜索和知识电路。文章标题取自首个一级标题。推荐用英文、数字和连字符命名文件，用中文一级标题显示给读者；文件保存为 UTF-8。

`docs/notes/` 下的子文件夹也会被扫描，但当前自动导航会把文章追加到同一个“我的笔记”分组，**不自动按子文件夹生成多层目录**。如果需要自定义复杂导航，要调整自动导航规则，避免和 `mkdocs.yml` 手写条目重复。

### 4.2 附件路径怎么算

在 `docs/attachments/` 放入 `result.png` 和 `exercise.pdf`。位于 `docs/notes/my-first-note.md` 的文章这样引用：

```markdown
![实验结果](../attachments/result.png)
[查看题目 PDF](../attachments/exercise.pdf)
```

`../` 表示从当前文章所在文件夹向上一级。若笔记在 `docs/notes/signals/`，同一附件需要 `../../attachments/result.png`。图片与 PDF 都要一起提交；只提交 Markdown 不会自动上传附件。

网站托管在 `/study-garden/` 子路径下，不要随手写 `/attachments/result.png` 这样的域名根路径。使用相对链接更可靠。文件名大小写也要一致：Windows 本地能打开，不代表 Linux 构建时大小写错误仍能通过。

### 4.3 Obsidian 笔记转公开文章

把准备公开的单篇 Markdown 和附件整理后放入 `docs/`，不要把整个库及 `.obsidian` 配置直接当作网站源码上传。

| Obsidian 写法或效果 | 发布到之芯时怎么处理 |
| --- | --- |
| `[[笔记]]` | 转成到实际 `.md` 的相对 Markdown 链接 |
| `![[图片.png]]` | 转成 `![说明](相对路径/图片.png)` |
| `> [!tip]` | 使用后文的 Material 提示框语法 |
| `cssclasses: image-ink`、`paper` 图片融合 | 这是 Obsidian 本地 CSS，不会自动带到网站 |
| 数学公式、Mermaid | 先核对本站渲染配置，不假定与 Obsidian 相同 |
| 私人批注和 `%% 注释 %%` | 发布前检查原文，不把“预览中隐藏”当作保密 |

## 5. 本站可用的写作语法

基本标题、列表、表格、代码块、脚注和任务列表可直接使用。长文章建议一个一级标题，再用二三级标题分段，右侧目录由标题生成。

### 5.1 提示框与折叠答案

```markdown
!!! tip "先独立尝试"
    这里缩进四个空格，才属于提示框正文。

??? question "展开参考思路"
    先说明条件，再给出解题步骤。
```

`!!!` 是普通提示框；`???` 是默认折叠的详情框；`???+` 默认展开。真实试题、参考答案和本站自编练习应明确区分。

### 5.2 可复制代码块

````markdown
```python
values = [1, 2, 3]
print(sum(values))
```
````

代码块展示代码，不会因此在访客设备上自动运行。链接、提示框和代码高亮配置来自 `mkdocs.yml`。

### 5.3 数学公式与图表的当前边界

当前配置已有 `pymdownx.arithmatex` 的通用输出，但全站模板没有加载 MathJax 或 KaTeX 渲染器，**不能保证公式像 Obsidian 一样自动排版**。Mermaid 的专用围栏与渲染脚本也未配置，普通 `mermaid` 代码块不能当作已经具备图表渲染能力。

需要正式支持时，应一并添加渲染器、加载策略和测试，再发布；不要只加一个 Markdown 扩展名称就宣称功能完成。临时可以使用经过检查的公式图片或 SVG，并附文字说明。

依据：[MkDocs 写作说明](https://www.mkdocs.org/user-guide/writing-your-docs/)、[Material 提示框](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)、[数学渲染配置](https://squidfunk.github.io/mkdocs-material/reference/math/)；具体启用范围已与本项目配置核对。

## 6. 添加课程：文章和进度目录要分别维护

### 6.1 只增加课程链接

如果只是推荐一门课，可以编辑 [优质课程链接](course-links.md)、[名校课程重点与先修](university-courses.md) 或 [习题与提交](course-practice.md)，补充官方链接、版本、先修、重点和核对日期。这样不会自动创建独立课程页面或学习进度卡。

正式[课程目录](catalog.md)现支持组合关键词、学习方向和可分享的筛选网址。搜索使用课程标题、编号、提供方、简介、分类与 `courses[].tracks`；维护方向归属时应保留准确的名称。分享的是筛选条件，学习进度仍由访问者自己的浏览器记录决定。

不要把“课程公开”写成“所有作业和答案都能下载”；平台账号、报名、校内访问限制要分别说明。邀请码若由教师或平台提供，只链接其官方说明入口，不编造通用码，也不把校内码公开转发。

### 6.2 新增一篇正式课程指南

1. 参考已有 `docs/courses/ee-signals.md` 的结构。
2. 新建 `docs/courses/my-course.md`。
3. 用一级标题命名，补充课程版本、先修、重点、官方资源、练习和验收标准。
4. 需要进度控件时，在正文中保留这一行：

```html
<div id="course-progress"></div>
```

5. 在 `mkdocs.yml` 的合适分类中添加页面导航。
6. 如需加入课程筛选与进度系统，再完成下一步的数据注册。

### 6.3 注册课程数据

编辑 `docs/assets/course-catalog.json`，在 `courses` 数组中追加对象。下面是字段结构示例，需要把示例课程名、地址、路径和估算替换成真实内容：

```json
{
  "id": "my-course",
  "title": "学校 · 课程名称",
  "path": "courses/my-course.md",
  "url": "courses/my-course/",
  "category": "电子信息",
  "level": "基础",
  "provider": "课程提供方",
  "official": "https://example.org/course/",
  "prerequisites": ["ee-calculus", "math"],
  "tracks": ["信息通信基础"],
  "hours": 6,
  "summary": "用一句话说明课程价值和学习范围。",
  "edition": "明确学期或资料版本",
  "checked": "2026-10-26",
  "totalHours": [60, 100],
  "studyScope": "本站估算包含的阅读、练习和项目范围。",
  "difficultyNote": "需要哪些基础，主要困难是什么。"
}
```

关键校验规则来自 `hooks.py`：

- `id` 只用小写字母、数字、连字符，且不能重复；不要随意修改已有 ID，否则本机进度关联可能改变。
- `path` 对应的 Markdown 必须存在，不能使用 `..` 跳出目录。
- `url` 与文章路径对应，例如 `courses/my-course.md` 对应 `courses/my-course/`。
- `official` 必须是 HTTPS 地址；示例域名不能当作真实课程来源。
- `level` 只能为 `入门`、`基础`、`进阶`。
- `hours` 是每周建议小时数，必须为 1–40 的整数。
- `totalHours` 是总投入的上下限，必须是两个 1–2000 的整数，且下限不大于上限。
- `studyScope` 和 `difficultyNote` 都要填写。
- `prerequisites` 引用现有课程 ID，不能引用标题或制造先修环路。

这个 JSON 的顶层还有 `version` 和 `tracks`，不要把整个文件替换成单个课程对象。`courses[].tracks` 用于课程的方向归属；顶层 `tracks` 中的课程 ID 数组还负责路线顺序。新建方向时应同步两处；只修改其中一处，不能假定路线和筛选一定一致。

难度和总时长是本站学习建议，不是学校官方承诺。若同一门课在文章表格、资源汇总和目录数据中都出现，应同步更新。构建会从目录数据注入“难度与学习时长”段落，不要重复手写一套互相矛盾的数据。

## 7. 修改左侧导航与页面标题

在 `mkdocs.yml` 的 `nav:` 下按现有缩进添加条目，例如：

```yaml
  - 自学专题:
      - 专题首页: topics/index.md
      - 专题课程: courses/my-course.md
```

这是示例；写进去之前先创建对应文件。YAML 使用空格缩进，不用 Tab，保持同层条目的缩进一致。导航显示名可以不同于文件名。

当前有两个自动导航区：`docs/notes/` 中除 `index.md` 外的文章，以及 `docs/courses/community/` 当前层中除 `index.md` 外的课程。它们由 `hooks.py` 追加。普通 `docs/courses/` 新页面不在这个自动规则内，需自己加导航。

站名与描述改 `site_name`、`site_description`；浏览器标签和正文标题的具体显示也受页面标题、主题模板影响。只想改首页标题，不必更改仓库名或网站 URL。

## 8. 知识电路怎样随内容更新

当前入口是 [知识电路](graph.md)。它加载 `chip.js` 与打包后的 `chip3d.bundle.js`，保留二维总览和三维层叠视图。

构建扫描 `docs/` 下的 `.md` 文件：

1. 每篇文章成为一个模块；按课程、笔记、工具、指南目录分类。
2. 普通 Markdown 相对链接指向另一篇实际存在的 `.md` 时，生成两者的关系。
3. 图片嵌入、外部网址、单纯的同页标题跳转不会形成两篇文章之间的关系。
4. 构建读取最终 HTML 标题锚点，为芯片模块提供文章章节目录。

例子：`docs/notes/convolution.md` 中写入下面的普通链接，即可关联信号课程：

```markdown
这部分需要先复习[信号与系统](../courses/ee-signals.md)。
```

当前生成器不把 `[[信号与系统]]` 自动转换成图谱关系，也不会根据文章词义猜测连线。普通网页网址形式的同站链接也不替代这个 `.md` 相对链接规则。

新增笔记后，三维同类模块按每层最多 12 个扩展层数。布局拖动和位置设置属于本浏览器偏好，不等于修改文章或把布局发布给所有访客。清理浏览器数据可能丢失这些本机设置。

## 9. 外观与背景：分清本机偏好和网站源码

### 9.1 只改变自己的观看效果

页面工具条的“外观与背景”提供赤雾、轨迹、静夜和浓度调节。它们保存在当前浏览器，不会提交到 GitHub；换浏览器或设备可能需要重新设置。减弱动画、关闭信号流动或使用二维总览，也有助于较弱设备保持流畅。

### 9.2 改给所有访客看的样式

编辑 `docs/assets/extra.css`，构建并发布后才是全站样式变更。当前背景不仅有 `body` 的颜色，还包含 `body::before`、`body::after` 和不同 `data-scene` 场景的覆盖规则；只改最前面的一处 `body`，可能被后面的规则盖住。

建议在文件末尾加小范围覆盖，而不是删除原有功能样式。下面只演示替换**深色模式的默认赤雾场景**，不会替你改变当前网站：

```css
html[data-scene="mist"] body[data-md-color-scheme="slate"]::before {
  background: linear-gradient(135deg, #11172a 0%, #302348 55%, #532c55 100%);
}
```

这是背景图层，其最终强度还受“背景浓度”影响。浅色模式使用 `data-md-color-scheme="default"`，需要单独选择适合浅底的文字和配色，不要把整站文字强行统一成白色。

Obsidian 的 `.theme-light`、`--mf-gradient` 属于另一套外观；直接复制进网站 CSS 不会自动接管 Material 的配色。要改场景按钮和默认浓度，查看 `appearance.js`；它会优先读取已有本机偏好，因此改了默认值后，旧浏览器未必立刻按新默认显示。

### 9.3 改三维芯片

三维渲染主要修改 `frontend/chip3d.js`、`frontend/chip-materials.js`；不要直接手改压缩后的 `docs/assets/vendor/chip3d.bundle.js`。源码修改后运行前端构建，再运行网站构建：

```powershell
npm ci --prefix frontend
npm run build --prefix frontend
python build.py
```

`frontend/build.cjs` 会同时生成旧三维图谱和当前芯片的打包文件。发布此类修改时，需要提交相关源码及重新生成的 bundle。仅修改课程 Markdown 不需要运行 npm。

## 10. 课程材料、试卷与答案如何维护

公开阅读页是 [课程笔记与历年试卷](course-materials.md)，机器可读索引位于 `docs/assets/course-materials/catalog.json`。当前源码记录 137 份已验证 PDF，只有其中 5 份提供站内副本；不要把“索引中有链接”写成“全部都由本站托管”。

日常补充建议：

1. 找到学校、教师或课程提供方的原始页面，记录学期和具体文件。
2. 区分讲义、题卷、参考答案、练习和项目说明；含手写答案的试卷不要混成空白自测卷。
3. 检查实际取回的是 PDF，而不是登录页或错误页；记录核对日期。
4. 把条目加到 `docs/course-materials.md` 的对应课程分区。
5. 同步索引元数据和页面统计。没有实际验证的页数、大小、SHA-256 不要编造。
6. 需要站内副本时，先确认许可和署名要求，再维护 `ATTRIBUTION.txt`。无法确认允许再分发时，保留官方链接。

现有索引条目常用字段有 `course`、`kind`、`title`、`url`、`source`、`term`、`checked`；下载验证记录还含 `bytes`、`pages` 和 `sha256`。`kind` 当前使用 `notes`、`exam`、`answers`、`practice`、`project`。

本机 `.tooling/generate-materials-page.py` 会覆盖材料页、索引和离线包，它依赖本机研究记录和已下载文件，不是新克隆仓库就能直接执行的通用入口。之前清理已移走解压目录；若使用这套旧脚本，应先把保留的 `course-materials-2026-10-26.zip` 解压回同名目录，并核对它依赖的 `.tooling/materials-research/` 数据。只改普通课程文章时，完全不需要重新下载或解压这批材料。

## 11. 社区共建怎样避免乱改项目

标准流程是：访客在共建页填写提案 → 提交到 GitHub Issue → 维护者审核 → 生成收录草稿 → 维护者提交正式课程 Markdown → 部署。

投稿表单不会直接给访客仓库写入权限。收录草稿位于 `docs/courses/community/issue-N.md`，其中 `N` 对应真实 Issue 编号。元数据示例：

```yaml
---
submission_issue: 123
---

# 审核后确认的课程标题
```

这只是格式示例，不能把任意 Issue 编号写进去冒充已审核。构建会根据该字段生成已收录状态。社区课程进入自动导航，不代表它同时进入 37 项正式课程的筛选和进度系统；后者还需要维护者注册目录数据。

`tools/check_contribution.py` 当前限制非仓库所有者的 PR **只能新增** `docs/courses/community/` 当前层的 Markdown，文件名用小写字母、数字和连字符，单篇不超过 100 KB，必须有一级标题，不能包含原始 HTML 或可执行 URL。它不允许外部投稿改主题、脚本、工作流或覆盖已有课程。

这个检查不是完整的内容审查；管理员还应配置主分支保护或 Rulesets，要求审核及相应检查通过。`CODEOWNERS` 文件本身不等于已强制启用分支保护，提交 Issue 也不等于内容已发布。

## 12. 本地预览：真正修改前先能运行

Windows 已安装 Python 时，可以双击仓库根目录的 `start-preview.cmd`。它会打开 `http://127.0.0.1:8080/`；已有构建时直接预览，缺少 `site/index.html` 时才尝试构建。保持启动窗口运行，按 `Ctrl+C` 停止。源码修改后仍需运行 `python build.py` 更新页面。

`ERR_CONNECTION_REFUSED` 且地址为 `127.0.0.1:8080` 时，先启动预览服务。这个地址只表示当前电脑；正式网站是 [之芯](https://hexzane-cyber.github.io/study-garden/)，打开正式站点不需要本机启动预览。

### 12.1 进入正确项目目录

在 PowerShell 中进入你保存源码的 `study-garden` 文件夹；先检查当前目录是否有 `build.py`、`mkdocs.yml` 和 `docs/`。以下命令均在这个目录运行。

如果直接使用当前这台电脑已有的源码副本，构建可以独立运行，不要求它已经连接 Git。需要通过本地 Git 提交时，先看下一章的仓库检查。

### 12.2 安装依赖并构建

已有本地 `.deps/` 时，`build.py` 会自动加载，不必反复安装。全新环境可以使用虚拟环境：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe build.py
.\.venv\Scripts\python.exe -m http.server 8080 --directory site --bind 127.0.0.1
```

不需要激活脚本或修改 PowerShell 执行策略。打开 `http://127.0.0.1:8080/`，用 `Ctrl+C` 停止预览服务器。端口被占用时把最后一条命令中的 `8080` 换成 `8081`，浏览器地址也一起改。

用项目已有依赖时，简化为：

```powershell
python build.py
python -m http.server 8080 --directory site --bind 127.0.0.1
```

注意：这条静态服务器命令**不会自动重新构建**。编辑源码后重新运行 `python build.py`，再刷新浏览器。`site/` 中有旧文件不代表最新构建成功；先看构建命令退出结果。

如果创建了 `.venv/`，发布前把 `.venv/` 加入你的本地排除或 `.gitignore`，不要提交虚拟环境。它不是当前项目默认依赖目录。

### 12.3 该运行哪些检查

普通内容修改先运行严格构建；涉及目录、链接、课程数据时，再运行项目已有 Python 检查：

```powershell
python build.py
python -m unittest discover -s tests -p "test_*.py"
```

使用虚拟环境时，把两条命令中的 `python` 都换成 `.\.venv\Scripts\python.exe`。修改 JS 时还要运行对应测试；例如：

```powershell
node --check docs/assets/appearance.js
node tests/chip.test.cjs
node tests/chip-stack.test.cjs
node tests/graph3d.test.cjs
```

后面三个例子用于芯片/三维相关修改，不是每次改错别字都要重打包三维代码。仓库主分支部署工作流还会执行更完整的回归检查，以 `.github/workflows/pages.yml` 为准。

## 13. Git 提交与 GitHub Pages 发布

### 13.1 先确认它真的是正确的克隆仓库

```powershell
git rev-parse --show-toplevel
git remote -v
git status --short
git log -1 --oneline
```

如果显示的仓库根目录是项目的上级、`remote` 为空，或提示还没有任何提交，不要直接在上级目录 `git add .`。当前工作区曾以源码副本方式维护，不能因为上级有 `.git` 就当成已经连接远端的完整克隆。

更稳妥的方式是在**另一个空目录**克隆：

```powershell
git clone https://github.com/HexZane-cyber/study-garden.git study-garden-edit
Set-Location .\study-garden-edit
git switch -c codex/edit-content
```

然后只把本次需要的源文件改动复制过去，重新构建和检查。不要把旧副本中的所有文件盲目覆盖远端新版本。

### 13.2 提交范围要明确

以下示例假设你只修改了 `docs/notes/my-first-note.md`，且它真实存在：

```powershell
git diff
git status --short
git add docs/notes/my-first-note.md
git diff --cached
git commit -m "docs: add first study note"
git push -u origin codex/edit-content
```

在 GitHub 创建 PR、检查差异并合并。不要提交 `site/`、依赖目录、个人离线材料包、浏览器导出的私人数据或登录凭据。`git add` 应按实际改动逐个列出；示例不会替你上传其他附件，附件需要单独加入提交。

### 13.3 当前发布流程

`pages.yml` 在 `main` 收到 push 或手动触发时运行：安装 Python 依赖 → 严格构建 → 项目测试 → 上传 `site/` → 部署 Pages。

仓库 Pages 的发布源应为 **GitHub Actions**。不需要把 `site/` 提交到 `main`，也不需要另外执行 `mkdocs gh-deploy` 建立一套不同的发布方式。Node bundle 由维护者提前生成并提交，现有 Pages 工作流没有重新运行前端 npm 打包。

成功标准是工作流部署步骤成功，随后在正式网址核对内容。单纯“文件已保存到电脑”或“PR 已创建”都不代表网站已更新。

依据：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)及本项目 `pages.yml`。

## 14. 改坏了怎样恢复

### 没有提交时

先复制当前文件到项目外备份，或用编辑器撤销恢复需要的部分。不要随意运行 `git reset --hard`、`git clean` 这类可能丢弃未保存工作的命令。

### 已经提交并发布时

在正确的克隆仓库中查看历史：

```powershell
git log --oneline -10
```

找到造成问题的普通提交后，可以用 `git revert` 新建一个反向提交，再按正常 PR 流程合并发布。例如下面的值必须替换成真实提交号：

```powershell
git revert --no-edit <需要撤销的提交号>
```

这是命令格式示意，尖括号不是要原样输入的字符。合并提交的撤销还有主线选择等额外含义，不要直接套用这个普通提交示例。恢复时应重新构建并检查，不要改写公共分支历史来掩盖问题。

依据：[Git 官方 git-revert 说明](https://git-scm.com/docs/git-revert)。

## 15. 常见问题排查表

| 现象 | 先检查什么 |
| --- | --- |
| 改了首页却没有变化 | 是否误改了根目录 `index.html`；正式首页是 `docs/index.md` |
| 新笔记没有出现在导航 | 是否在 `docs/notes/`，是否重新构建并部署，文件扩展名是否为 `.md` |
| 有课程文章，但筛选和进度里没有 | 是否注册 `course-catalog.json`，是否补导航和进度控件 |
| 课程构建失败 | ID 重复、路径不符、先修引用不存在或成环、时长和难度字段不合法 |
| 芯片没有某条连线 | 是否为到另一篇存在的 `.md` 的普通相对链接，而不是双链或外部 URL |
| 本地能打开图片，线上不行 | 附件是否提交、大小写是否一致、是否误用了域名根路径 |
| 背景修改没有效果 | 是否被后面的场景规则覆盖，是否为本机偏好而非全站源码变化 |
| 改了三维源码但线上还是旧效果 | 是否重建并提交 `chip3d.bundle.js`，是否真正部署成功 |
| 正式域名连接超时 | 区分本地构建与主机网络可达性；改文章或刷新 JS 不能保证修复网络超时 |
| `127.0.0.1` 打不开 | 预览服务器是否仍运行、端口是否正确、构建是否生成了 `site/` |
| 发布成功但看到旧内容 | 对照 Actions 的提交号，确认访问的是正式地址，并尝试刷新缓存 |
| 私密空间内容没有跟着网站部署 | 这是本机加密数据，需单独导出 `.sgvault`；不是部署故障 |

## 16. 每次编辑完成前的简短检查

1. 读者能否从导航或索引找到新内容？
2. 官方来源、课程版本、难度与估算范围是否表达准确？
3. 所有相对路径和附件大小写是否一致？
4. Obsidian 特有语法是否已转换？公式是否按当前能力处理？
5. 本地严格构建是否成功，相关页面能否打开？
6. 提交范围是否仅包含本次源文件？
7. `main` 合并后，Actions 部署是否成功，正式页面是否核对？

日常写作按“改一个小点 → 本地检查 → 看提交差异 → 发布核对”的节奏进行，比一次改动大量内容更容易发现和恢复问题。


## 维护原创习题和本地 AI

原创题保存在 `docs/assets/exercises.json`，每题使用不变的 `id`。新增题目需要填写课程 `course`（必须来自课程目录的 ID）、方向、难度、预计分钟数、题干、逐条提示和参考解析。`number` 题还要写 `expected`、`unit` 与正数 `absTolerance`；`choice` 题填写 `options` 与从 0 开始的 `correct`；`explain` 不自动判分。不要把学校试卷改称本站原创，答案请独立计算复核。

记录由 `practice-model.js` 验证，`practice.js` 负责界面；练习 JSON 导入仅合并合法字段，并保留当前已有的非空作答。练习记录可在原创习题页面单独导出，也可到综合备份勾选“原创习题记录”。AI 只拿到用户主动选择的那道题与作答，不应接入私密空间的自动扫描。

AI 控制界面在 `docs/assets/local-ai.js`，输入约束与提示词在 `local-ai-model.js`。WebLLM 源文件在 `frontend/local-ai-runtime.js` 和 `frontend/local-ai-worker.js`，版本固定在 `frontend/package-lock.json`。只有主动点击加载或缓存操作才下载运行库；模型权重不提交到 GitHub。更换模型时需要同步网页列表、运行库与工作线程白名单、显存与下载量说明，并验证模型库路径。

重新生成 AI 运行库：

```powershell
npm.cmd ci --prefix frontend --ignore-scripts
npm.cmd run build:ai --prefix frontend
python build.py
python -m unittest discover -s tests -p 'test_*.py'
node tests/practice.test.cjs
node tests/local-ai.test.cjs
```

生成的 `docs/assets/vendor/local-ai-*.bundle.js` 和两份依赖许可需一起提交。正常文档构建直接使用已提交的包，不需要下载模型。浏览器运行依赖设备 WebGPU 与首次下载网络条件，维护时应区分“模拟 API 测试通过”和“真实设备完成模型推理”；没有实际加载就不能声称实测成功。


### 练习状态与单题链接

练习状态由本机作答推导，不新增备份字段：数值/选择题检查通过才显示“检查通过”，检查未通过显示“待纠错”，修改后回到“已作答待检查”。解释题始终保留自查状态。筛选不删除记录；修改过程中不自动移走当前卡片，点“刷新题目列表”再按最新状态显示。

`mkdocs.yml` 的 `site_url` 是正式网站根地址，当前为 `https://hexzane-cyber.github.io/study-garden/`。构建模板将它传给习题脚本，使本机预览也能复制正式站点的单题链接。迁移域名时要同步更新此配置并重建；单题 URL 只包含公开题号，不包含作答。


### 本地 AI 的草稿与连接诊断

通用提问模板、设备建议、错误分类及诊断字段在 `docs/assets/local-ai-model.js`；界面行为在 `local-ai.js`。模板只填入输入框，用户发送后才调用模型。保留一份被替换的草稿，生成失败时保留上一条提问，全部只在内存中保存；不要自动持久化私人问题。

设备检测需要用户主动点击检测或加载按钮。`StorageManager.estimate()` 返回的站点存储余量不是显存，不应以它或系统内存推断某模型必定可运行。检测结果不完整时应明确显示“未提供”，不能编造硬件数值。

诊断导出采用字段白名单：网页来源（不带路径和查询参数）、运行方式、模型、有效回环服务地址、当前阶段、运行库是否加载、错误分类与有限的能力信息。不要把完整状态对象、原始异常、输入框或聊天记录直接序列化到诊断文件。每次修改需执行 `node tests/local-ai.test.cjs`、`node tests/local-ai-ui.test.cjs` 与 `node tests/local-ai-support-ui.test.cjs`，验证草稿恢复、取消和诊断中没有对话数据。


### 课程 AI 入口与讨论范围

课程页的三个 AI 入口由 `hooks.py` 生成，URL 只包含课程 ID 与 `review`、`prerequisites` 或 `quiz` 辅助方式。助手页面从构建时的 `ai-course-data` 读取字段白名单：`id/title/url/provider/category/level/summary/prerequisites`。课程页本身不加载 AI 脚本或运行库。

发送时由 `local-ai-model.js` 构造有限长度的公开背景，再与本主题对话合并。`local-ai.js` 在主题切换时清空下一次请求使用的历史数组，页面中的旧消息仍保留供用户主动导出；消息带有主题标签。新主题清除旧主题的失败提问恢复入口，跨主题恢复草稿回到自由问答。不要把全部聊天 DOM、学习进度或私密空间内容作为课程上下文。

回归检查包含 `node tests/local-ai-course-ui.test.cjs`：检查 URL 选择优先级、禁用存储时的公开链接、切换课程/习题/自由问答后的请求内容、复用模型、草稿恢复、分主题导出与个人记录未被修改。更新入口和字段投影后运行严格构建及 `test_page_assets.py`，确保课程页不会下载 AI 引擎。


### 错题任务与草稿恢复

工作台读取 `PracticeModel` 的本机检查状态，分页列出待纠错题，不修改作答或计时。模板只在工作台加载轻量的 `practice-model.js` 与公开题库，不加载习题编辑器或 AI 引擎。跨标签页事件和回到前台时刷新列表；损坏的练习记录会保留原文并提示到习题页恢复。

任务可附带可选的 `exercise` 原题编号，只保存受限字符的编号，不保存答案、任意 URL 或参考解析。新任务草稿必须经“加入任务”确认。原题编号随当前工作台单独备份和综合备份保留；目录里已不存在的编号不会生成外部链接。编辑标题保留来源，同日原题待办按编号去重。

课程动作、学习挑战和错题安排统一经过草稿填入函数，保留上一份尚未提交的草稿及原题关联。修改这些行为后运行 `planner.test.cjs`、`planner-practice-ui.test.cjs`、`planner-integration.test.cjs`、`backup.test.cjs`，核对确认前无写入、任务完成与判分互不影响、正在运行的计时和其他页面记录保持完整。


### 综合备份中的原创习题记录

综合备份新增可选的 `practice` 类型。格式仍为 `zhixin-local-data` 版本 1，旧版四类数据文件可以继续导入；单独的练习文件仍在习题页恢复。备份中心需要先加载 `practice-model.js` 与公开题库，再调用备份模型，页面不加载习题编辑器或 AI。

原有非空答案优先；空白答案允许由备份补入。格式错误、题库未知编号或本机原始记录损坏时应停止写入并提供原始记录导出，不要悄悄丢弃未知题号。所有选中类型必须先完成校验，再开始写入；写入中失败会尝试回退本轮已写入的值，并检测其他页面的并发修改。

`backup-model.js` 的读写方法增加末尾 `questions` 参数；旧调用仍可处理原有类型与空白练习记录，非空练习记录必须提供题库。任务的可选 `exercise` 编号由计划模型保留。工作台单独备份导入同样采用本机同编号记录优先，并在合并前检查任务与专注记录容量，避免旧备份覆盖更新或自动截断。

改动后运行 `backup.test.cjs`、`backup-integration.test.cjs`、`backup-practice.test.cjs` 与 `backup-practice-ui.test.cjs`，核对空白合并、已有答案保留、预览前零写入、损坏数据保护及多类型写入回退。
