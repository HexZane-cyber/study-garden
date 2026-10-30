---
title: 内容修改操作手册
comments: false
---

# 之芯内容修改操作手册

这份手册教你自己修改之芯的文字、课程、笔记、图片和附件。按 **2026-10-30** 的项目结构核对。日常写内容不需要改 JavaScript，也不需要启动本地 AI。

最容易上手的方法是：**在 GitHub 修改 Markdown 文件，提交后等待网站部署完成。** 如果只是改几句话，直接从第二节开始；新增笔记看第三节；新增正式课程看第六节。

想直接动手，可以先用文末的“可下载模板与完整练习”。模板文件单独保存，不会自动发布成你的笔记。

## 1. 先找到要改的文件

[正式网站](https://hexzane-cyber.github.io/study-garden/)是阅读入口，[GitHub 仓库](https://github.com/HexZane-cyber/study-garden)保存公开内容的源文件。下表路径都从仓库根目录开始。

| 想修改的内容 | 打开哪个文件 |
| --- | --- |
| 首页文字与入口 | `docs/index.md` |
| 一篇现有课程介绍 | `docs/courses/` 中对应的 `.md` 文件 |
| 自己的公开笔记 | `docs/notes/` 中的 `.md` 文件 |
| 推荐课程网址 | `docs/course-links.md` |
| 名校课程重点与先修说明 | `docs/university-courses.md` |
| 作业、测验、提交平台链接 | `docs/course-practice.md` |
| 讲义、试卷、答案的资源入口 | `docs/course-materials.md` |
| 课程卡片的难度、时长、方向和先修 | `docs/assets/course-catalog.json` |
| 左侧导航名称与顺序 | `mkdocs.yml` 中的 `nav:` |

例如网站地址以 `courses/ee-signals/` 结尾，对应源文件通常是 `docs/courses/ee-signals.md`；首页对应 `docs/index.md`。也可以使用文章上的铅笔编辑入口，直接跳到对应文件。

`site/` 是自动生成的网页，不要在那里改正文；下次构建会覆盖它。仓库根目录旧的 `index.html` 也不是正式首页。

## 2. 第一次操作：修改现有文章的一句话

以修改首页介绍为例：

1. 登录有仓库写入权限的 GitHub 账号，打开[首页源文件](https://github.com/HexZane-cyber/study-garden/blob/main/docs/index.md)。
2. 点击文件上的铅笔按钮，进入编辑界面。
3. 找到介绍文字，只修改需要更改的句子。保留不认识的 HTML、页面控件和文件开头的配置。
4. 点击 **Preview** 查看文字、列表和链接的大致效果。
5. 点击 **Commit changes**，填写说明，例如“更新首页的学习方向介绍”。
6. 若仓库规则允许且只有简单文字修改，可以提交到 `main`。若选择了新分支，需要创建 Pull Request，检查差异后合并到 `main`，正式站才会更新。分支保护要求走 PR 时按该流程操作。
7. 打开[Actions 部署记录](https://github.com/HexZane-cyber/study-garden/actions/workflows/pages.yml)，找到对应提交的 **Deploy Study Garden**，等待成功后刷新正式网站。

**完成的判断：** 提交已进入 `main`、对应部署成功、正式页面能看到新句子。只在编辑框修改，或只保存到新分支，都不等于已经发布。

GitHub 的 Preview 不会完整运行之芯的交互，也不完全展示本站提示框效果，最终以部署后的页面为准。按钮名称和编辑步骤可对照 [GitHub 官方文件编辑说明](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)。

## 3. 新增一篇自己的笔记

在仓库打开 `docs/notes/`，选择 **Add file → Create new file**，文件名填写 `rc-circuit-note.md`。你已经在 `docs/notes/` 文件夹中时，不要再次把整个路径写进文件名。

复制下面的模板，再换成自己的内容：

```markdown
# RC 电路学习笔记

## 这篇笔记解决什么问题

记录我对一阶电路暂态过程的理解。

## 关键结论

写出结论、使用条件和容易混淆的地方。

## 例题与推导

先写已知条件，再按步骤记录推导。

## 还需要解决的问题

- [ ] 完成一道阶跃响应练习

## 相关课程

参照[电路与电子学](../courses/ee-circuits.md)继续学习。
```

提交并部署后，`docs/notes/` 下的新笔记会自动加入“我的笔记”导航和搜索，知识芯片也会读取新文章；不必手工编辑图谱 JSON。普通 Markdown 链接可以建立文章之间的关系。

建议文件名用英文、数字和连字符，显示给读者的一级标题可以用中文。当前笔记子目录会被扫描，但导航会放进同一个“我的笔记”分组，不会自动变成多级文件夹树。

如果已有 `.md` 文件，可以在目标目录选择 **Add file → Upload files** 上传。先检查文件名和最终目录，再提交。网页上传每个文件目前限制为 25 MiB；详细限制与步骤见 [GitHub 官方上传说明](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。

## 4. 插入图片、PDF 和其他附件

先把允许公开的附件上传到 `docs/attachments/`，目录不存在时可在本地创建后一起上传。比如放入 `rc-step.png` 和 `rc-exercises.pdf`。仅写图片链接不会自动上传文件。

假设正在编辑 `docs/notes/rc-circuit-note.md`，正文写：

```markdown
![RC 电路阶跃响应曲线](../attachments/rc-step.png)

[打开或下载练习 PDF](../attachments/rc-exercises.pdf)
```

相对路径从**当前文章所在文件夹**算起：

| 文章位置 | 引用 `docs/attachments/rc-step.png` |
| --- | --- |
| `docs/index.md` | `attachments/rc-step.png` |
| `docs/notes/rc-circuit-note.md` | `../attachments/rc-step.png` |
| `docs/notes/circuits/rc-circuit-note.md` | `../../attachments/rc-step.png` |

图片用 `![说明](路径)`，普通文件用 `[链接文字](路径)`。PDF 是打开还是直接下载取决于浏览器设置；Word、ZIP 等文件也可以用普通链接提供，并不意味着网站能预览所有格式。

文件名大小写要完全一致。不要使用 `C:\\Users\\...` 本机路径，也不要写域名根路径 `/attachments/...`，否则正式站的 `/study-garden/` 前缀可能丢失。大课本和视频优先链接官方资源，避免把大型附件堆进公开仓库。

## 5. 常用写作语法，以及 Obsidian 笔记怎么搬过来

以下是一份可以参考的 Markdown 写法：

```markdown
# 文章标题（通常只用一个）
## 主要章节
### 小节

普通段落之间留一个空行。

**加粗内容**，以及 `代码或变量名`。

- 第一项
- 第二项

1. 第一步
2. 第二步

> 引用或补充说明。

| 概念 | 说明 |
| --- | --- |
| 时间常数 | 说明定义与单位 |

!!! tip "学习提示"
    提示框正文前缩进四个空格。

??? question "展开参考思路"
    这里可以放自编练习的解题思路。
```

代码示例可以这样写，三个反引号要成对出现：

````markdown
```python
print("开始学习")
```
````

普通文章里的 `- [ ]` 是写作中的任务列表，不会自动变成学习工作台任务。

从 Obsidian 搬文章时，复制准备公开的 `.md` 和它引用的附件，再转换链接：

| Obsidian 原文 | 网站文章中的写法示例 |
| --- | --- |
| `[[另一篇笔记]]` | `[另一篇笔记](other-note.md)`，假设两篇在同一目录 |
| `![[rc-step.png]]` | `![响应曲线](../attachments/rc-step.png)` |
| `> [!tip]` 提示块 | 使用上面的 `!!! tip` 格式 |

Obsidian 的背景、插件和图片融合 CSS 不会随 Markdown 自动带到网站。当前网站虽配置了公式语法扩展，但未加载全站公式渲染器，也未配置 Mermaid 渲染；不能保证直接粘贴后呈现相同效果。需要时可先用清晰的公式或图表图片。

公开前检查正文、附件和隐藏注释，不要上传整个私人库或 `.obsidian` 配置。浏览器私密空间中的文件不会自动变成公开文章。

## 6. 修改课程，或添加一门正式课程

### 修改现有课程

课程有三处不同的内容：**文章负责讲解，目录数据负责筛选和进度，导航负责左侧入口。**

例如修改“信号与系统”：

1. 编辑 `docs/courses/ee-signals.md`，修改先修说明、学习重点、官方链接和练习建议。
2. 如果改难度或时长，在 `docs/assets/course-catalog.json` 中搜索 `"id": "ee-signals"`，只修改该课程对象。
3. 如果只是改左侧显示名称，在 `mkdocs.yml` 中找到 `courses/ee-signals.md`，修改冒号前的导航名称，保留路径。

课程数据常用字段如下：

| 字段 | 实际含义与修改方式 |
| --- | --- |
| `title`、`summary` | 课程卡片名称和简介 |
| `level` | 只能填写“入门”“基础”“进阶” |
| `hours` | 每周建议小时数，1–40 的整数 |
| `totalHours` | 总投入范围，例如 `[60, 100]`，下限不大于上限；每项为 1–2000 的整数 |
| `studyScope` | 估时包含哪些阅读、练习或项目 |
| `difficultyNote` | 主要难点和需要的基础 |
| `official` | 官方课程 HTTPS 地址 |
| `checked`、`edition` | 实际核对日期和对应资料版本 |
| `prerequisites` | 站内先修课程 ID 数组，例如 `["ee-calculus", "math"]` |
| `tracks` | 所属学习方向名称数组 |

估算时长应说明范围，不写成学校官方承诺。构建会从目录数据注入难度与学习时长；如果正文也写了这些信息，要同步修改，避免两处矛盾。

**不要为了改标题而改已有 `id`、`path` 或 `url`。** ID 关联浏览器中的学习进度和任务；文件改名还会影响旧链接。

JSON 的字段名称和字符串必须使用英文双引号；同级项之间有逗号，最后一项后面不加逗号，也不能写 `//` 注释。顶层有 `version`、`courses` 和 `tracks`，不要把整个文件替换成单个课程对象。

### 新增正式课程

如果只是想收藏一个好课程链接，先编辑 `docs/course-links.md` 就够了。需要独立课程页面、课程卡片和进度时，再完成下面的步骤：

1. 参考现有课程，新建 `docs/courses/my-course.md`，写清名称、资料版本、先修、重点、官方资源和练习安排。
2. 正文保留 `<div id="course-progress"></div>`，作为课程进度控件的位置。
3. 在 `course-catalog.json` 的 `courses` 数组追加完整课程对象。可复制一个现有对象后逐项替换；新 `id` 用未占用的小写英文、数字和连字符。
4. 新对象的 `path` 写 `courses/my-course.md`，`url` 写 `courses/my-course/`，并填全上表字段。不存在的先修不能填入 ID 数组，可先写在正文说明中。
5. 若该课属于某条学习路线，在顶层 `tracks` 对应的 ID 数组中按学习顺序加入新 ID，同时维护课程对象里的方向名称。先修不得循环依赖。
6. 在 `mkdocs.yml` 对应学科的导航下添加页面，再构建检查。完整课程对象示例见[技术编辑手册](editor-manual.md)。

涉及多个文件时，建议在同一个新分支完成，检查一致后合并；不要让正式分支暂时引用尚不存在的页面。

## 7. 更改左侧目录，以及文章里的章节目录

左侧导航在 `mkdocs.yml` 的 `nav:` 下。例如某个已有分类是：

```yaml
  - 电子信息与集成电路:
      - MIT RES.6-007 信号与系统: courses/ee-signals.md
      - 我的新课程: courses/my-course.md
```

这段仅演示结构；只有创建了 `my-course.md` 才能添加它。把新条目插到已有分类中，不要重复创建整个 `nav:`。缩进使用空格，按旁边条目对齐，不用 Tab。

改名称就改冒号前的文字；调整顺序就移动完整的一行。笔记已有自动导航，通常无需再手写一条。

文章右侧章节目录来自正文的 `##`、`###` 标题。想增加一个章节，直接在正文新增标题和内容即可。标题改名可能改变旧的章节锚点，分享过的章节链接也应重新检查。

## 8. 在自己电脑上编辑和预览

如果一次要改多篇文章，打开含有 `mkdocs.yml` 和 `build.py` 的 `study-garden` 文件夹，用 VS Code 或其他 UTF-8 文本编辑器编辑 `docs/`。保存本地文件只会改变这份本地副本，不会自动更新 GitHub。

在项目目录打开 PowerShell，执行：

```powershell
python build.py
```

看到构建成功后，双击项目目录里的 `start-preview.cmd`，再访问 `http://127.0.0.1:8080/`。以后每次改了正文，都要重新运行 `python build.py`，然后刷新浏览器；当前启动器不会持续监视并自动构建内容。

如果这是新电脑或新下载的项目，需要先安装 Python，再在项目目录创建环境并安装依赖：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe build.py
```

创建了 `.venv` 后，后续也用第三条命令构建；启动器会优先使用它。修改普通文章无需运行前端打包命令。

`127.0.0.1` 只指向你正在使用的电脑，服务未运行就打不开，也不是能分享给别人的正式网址。双击 `check-preview.cmd` 可以检查状态，`stop-preview.cmd` 可以停止预览。重启电脑后需要重新启动服务。

准备发布本地修改时，可按第二、三节在 GitHub 对应目录更新文件。如果本地副本是通过 Git 克隆的，也可以使用 Git 工具检查差异、提交并推送；直接下载 ZIP 得到的目录不能当作已配置远程仓库的 Git 工作区。无论哪种方式，都不要上传 `site/`、`.venv/`、`.tooling/` 或浏览器私人备份。

## 9. 发布没成功，或发现改错了

| 情况 | 先检查什么 |
| --- | --- |
| GitHub 已提交，但网站没变化 | 是否已经进入 `main`；对应 Actions 是否成功；再尝试 `Ctrl+F5` 刷新 |
| Actions 显示红色失败 | 打开失败任务，查看报错的文件和行号；常见原因是路径不存在、YAML 缩进或 JSON 格式错误 |
| 图片不显示 | 附件是否已提交；相对路径和文件名大小写是否匹配 |
| 新课程只出现文章，没有目录卡片 | 是否注册到 `course-catalog.json`，并且构建成功 |
| 新笔记未出现 | 是否放在 `docs/notes/`；文件扩展名是否实际为 `.md` 而非 `.md.txt` |
| 本地还是旧内容 | 保存源文件后是否重新构建；打开的端口是否是当前项目服务 |
| 正式站连接超时或重置 | 先区分网络连接失败与部署失败；修改正文不能解决所有网络问题 |

如果只是把一句话改错，直接再编辑回来并提交即可。需要找旧版本时，在 GitHub 打开该文件的 **History**，找到正确版本，把需要的段落复制到**当前版本**中再提交，避免覆盖后来添加的其他内容。

删除文章前，先检查导航、其他文章链接、课程数据和先修关系是否还引用它。仅仅不在导航显示，并不等于源文件从公开仓库消失。

## 10. 每次修改的收尾检查

- 确认改的是 `docs/` 中的源文件，正文和课程数据没有互相矛盾。
- 打开新链接，核对课程版本；图片和附件已上传且路径正确。
- 新增课程的正文、目录数据和导航一起检查。
- 确认没有带上私人记录、账号信息或不准备公开的文件。
- 等对应提交部署成功，再打开正式页面查看文字、图片和手机宽度下的排版。

第一次建议只改首页的一句话，走完“编辑 → 提交 → 部署 → 正式站核对”。完成这一次后，日常改文字和链接就是同一套操作。

## 11. 可下载模板与完整练习

### 选择模板

| 文件 | 适合做什么 | 使用位置 |
| --- | --- | --- |
| [下载笔记模板](assets/content-templates/note.md.txt){ download="my-study-note.md" } | 写一篇带图片、例题和复盘的学习笔记 | 改好后放入 `docs/notes/` |
| [下载课程正文模板](assets/content-templates/course.md.txt){ download="my-course.md" } | 为一门课写先修、重点、资源和自查 | 改好后放入 `docs/courses/`，并完成第六节的数据注册和导航 |
| [下载资源条目模板](assets/content-templates/resource.md.txt){ download="resource-entry.md" } | 补充一个课程、讲义或作业入口 | 复制填写后的段落到对应资源汇总页 |
| [下载示例配图](assets/content-templates/study-flow.svg){ download="study-flow.svg" } | 练习上传附件和引用图片 | 放入 `docs/attachments/` |

模板下载使用普通静态文件，不读取你的笔记。若浏览器直接展示文字，可右键链接“另存为”，或复制内容到文本编辑器。保存时选择 UTF-8，检查文件最终扩展名是 `.md`，不是 `.md.txt`；Windows 可在资源管理器开启“文件扩展名”显示。

模板中的“填写……”是操作提示，发布前换成自己的内容或删去。课程模板只生成正文，不会单独创建目录卡片；资源条目也不会自动变成课程。

### 跟做一次：新增带图的学习笔记

下面用 `my-study-note.md` 演示；如果你已经使用这个文件名，换一个新名称，避免覆盖旧文章。

1. 下载“笔记模板”和“示例配图”，把笔记保存为 `my-study-note.md`，图片保留为 `study-flow.svg`。
2. 用文本编辑器打开笔记，将一级标题改成自己的标题，填写问题、过程和结论。先保留模板中的图片行，体验相对路径怎样工作。
3. 在 GitHub 仓库的分支选择器中，从 `main` 创建一个内容分支，例如 `notes/my-study-note`。下面几次上传都选择这个分支，最后一起合并，避免正式站暂时缺少附件。
4. 在该分支的 `docs/notes/` 目录选择 **Add file → Upload files**，上传 `my-study-note.md` 并提交。
5. 在同一分支的 `docs/` 目录上传本地准备好的 `attachments` 文件夹，里面放 `study-flow.svg`。提交前确认页面显示的最终路径是 `docs/attachments/study-flow.svg`。如果目标目录已经存在，也可以直接进入其中上传图片。
6. 再打开笔记，确认图片行是 `![从问题到验证的学习流程](../attachments/study-flow.svg)`。如果换了自己的图片名称或格式，这里也要同步修改。
7. 创建从该分支到 `main` 的 Pull Request。在 **Files changed** 检查修改范围：本次练习应只有新笔记和示例图，不应包含整个项目副本或私人库。按仓库权限与检查要求合并。
8. 合并后等待 **Deploy Study Garden** 成功，打开正式站的“我的笔记”找到新标题，再打开 `https://hexzane-cyber.github.io/study-garden/notes/my-study-note/` 验证正文和图片。如果文件另取了名字，网址也要使用对应名称。

这次练习中，文件应对应为：

```text
study-garden/
└─ docs/
   ├─ notes/
   │  └─ my-study-note.md
   └─ attachments/
      └─ study-flow.svg
```

**完成后检查三件事：** 新笔记出现在“我的笔记”，文章能显示配图，相关课程链接能打开。笔记标题负责页面显示，文件名决定网址，因此修改显示标题通常不需要改文件名。

### 以后更新这篇笔记

回到 `docs/notes/my-study-note.md` 编辑并提交即可，不必删除后重新上传。补一张新图片时，先上传附件，再在正文中引用；换掉图片名称则同步修改路径。只修改这些源文件，不手动修改 `site/` 或 `graph-data.json`。
