# 知行 · 自学手册

类似 CS自学指南的个人知识网站，基于 Material for MkDocs，采用红黑渐变与深色阅读界面。

## 内容与交互

- 左侧多层课程目录、中间文章、右侧页内目录。
- 中文/英文全文搜索、浅色/深色切换、代码高亮与复制。
- 课程与笔记以 Markdown 保存在 docs/，上传到 docs/notes/ 的笔记自动进入导航。
- Matter.js 物理引擎驱动的 Obsidian 风格关系图：连续软排斥、黏性耦合、接触形变、流场漂移、液态/清晰模式切换、节点拖拽、画布平移、滚轮缩放、搜索高亮、关联筛选、文章跳转、暂停和重置。
- 图谱从文章中的相对 Markdown 链接自动生成；不使用 AI 推测关联。
- 页面底部链接到 GitHub Discussions，提供可选 Giscus 嵌入模板。
- 原先的笔记工作台保留为 /workbench/ 草稿辅助工具。
- 共建课程：站内表单预览 → GitHub Issue → 维护者审核 → 生成课程 Markdown → 正式收录。提案状态不会冒充已发布内容。
- 本机加密私密空间：PDF、Markdown、TXT、图片与 Obsidian 文件夹导入，基础双向链接浏览，笔记编辑，自动锁定、加密备份与恢复。
- 收藏文章和最近阅读记录。

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

## 三维图谱

默认使用 Three.js 0.186.1 的 WebGL 三维视图，支持轨道旋转、缩放、平移、液滴弹性拖拽、三轴软接触和阅读频率流场。可切回二维，WebGL 初始化失败自动使用二维。所有库和光照场景均随站点打包，不依赖第三方 CDN、模型或图片。

三维前端源码在 frontend/；发布用打包文件已提交在 docs/assets/vendor/graph3d.bundle.js，MkDocs 构建不需要 Node 依赖。修改三维源码后重新生成：

```powershell
npm ci --prefix frontend
npm run build --prefix frontend
python build.py
node tests/graph3d.test.cjs
```

三维物理测试覆盖深度分布、布局稳定、软接触、重叠分离、拖拽惯性、频率流动和重置；图谱集成测试覆盖三维控制同步及 WebGL 失败回退。
