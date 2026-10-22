# 知行 · 自学手册

类似 CS自学指南的个人知识网站，基于 Material for MkDocs，采用红黑渐变与深色阅读界面。

## 内容与交互

- 左侧多层课程目录、中间文章、右侧页内目录。
- 中文/英文全文搜索、浅色/深色切换、代码高亮与复制。
- 课程与笔记以 Markdown 保存在 docs/，上传到 docs/notes/ 的笔记自动进入导航。
- Matter.js 物理引擎驱动的 Obsidian 风格关系图：节点拖拽、画布平移、滚轮缩放、搜索高亮、关联筛选、文章跳转、暂停和重置。
- 图谱从文章中的相对 Markdown 链接自动生成；不使用 AI 推测关联。
- 页面底部链接到 GitHub Discussions，提供可选 Giscus 嵌入模板。
- 原先的笔记工作台保留为 /workbench/ 草稿辅助工具。

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
python -m unittest discover -s tests -p "test_*.py"
node tests/core.test.cjs
node --check docs/assets/graph.js
python build.py
```

图谱使用稳定的目录 URL；节点位置仅用于临时探索，刷新后重新布局。提供文章列表方便键盘操作，系统偏好减少动画时默认暂停运动。
