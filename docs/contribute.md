---
comments: false
---

# 共建课程

把值得学习的课程推荐给大家。投稿先进入提案池，经过维护者审核后，才会出现在正式课程目录、搜索和知识关系图中。

<div class="contribution-steps"><span><b>01</b> 填写课程</span><span><b>02</b> GitHub 确认提交</span><span><b>03</b> 维护者审核</span><span><b>04</b> 收录到手册</span></div>

## 推荐一门课程

<form id="course-proposal" class="proposal-form">
<div class="proposal-grid">
<label>课程名称 *<input name="course_name" required maxlength="100" placeholder="例如：某大学 · 数据结构"></label>
<label>官方课程链接 *<input name="course_url" type="url" required maxlength="500" placeholder="https://课程官方网站"></label>
<label>课程分类 *<select name="category" required><option value="">请选择</option><option>数学基础</option><option>编程入门</option><option>数据结构与算法</option><option>计算机系统</option><option>网络与数据库</option><option>人工智能</option><option>嵌入式与硬件</option><option>其他</option></select></label>
<label>先修要求 *<input name="prerequisites" required maxlength="180" placeholder="需要哪些知识？是否适合零基础？"></label>
</div>
<label>推荐理由与学习建议 *<textarea name="reason" required minlength="30" maxlength="1000" rows="5" placeholder="至少 30 字：介绍课程内容、作业形式、适合人群，以及你实际学习过的部分。"></textarea></label>
<label>预计投入<input name="workload" maxlength="100" placeholder="例如：每周 6 小时，约 10 周（个人估计）"></label>
<label>补充资源<textarea name="resources" maxlength="600" rows="3" placeholder="可选：官方讲义、作业页面或有权分享的材料链接。"></textarea></label>
<label class="proposal-consent"><input name="agreement" type="checkbox" required> 我确认内容可公开分享，并理解课程需审核后才会收录。</label>
<div class="proposal-actions"><button type="submit" class="md-button md-button--primary">预览并前往 GitHub 投稿 ↗</button><button type="button" id="proposal-download" class="md-button">下载提案</button></div>
<p id="proposal-message" role="status" class="reading-meta">草稿自动保存在当前浏览器。最终提交在 GitHub 完成，需要登录 GitHub 账号。</p>
</form>

<dialog id="proposal-preview"><h2>检查课程提案</h2><p>确认后会打开 GitHub 课程表单。请在 GitHub 检查预填内容、勾选投稿确认，再点击提交。</p><pre id="proposal-preview-text"></pre><div class="proposal-actions"><a id="proposal-github-link" class="md-button md-button--primary" target="_blank" rel="noopener noreferrer">前往 GitHub 确认</a><button type="button" id="proposal-close" class="md-button">继续修改</button></div></dialog>

## 课程提案池

<div class="proposal-board-tools"><select id="proposal-filter" aria-label="筛选课程提案"><option value="all">全部状态</option><option value="pending">待审核</option><option value="more">待补充</option><option value="accepted">已收录</option><option value="closed">已关闭</option></select><button id="proposal-refresh" type="button" class="md-button">刷新提案</button><a href="https://github.com/HexZane-cyber/study-garden/issues?q=is%3Aissue+%22%5B%E8%AF%BE%E7%A8%8B%E6%8A%95%E7%A8%BF%5D%22" target="_blank" rel="noopener noreferrer">在 GitHub 查看全部 ↗</a></div>
<div id="proposal-board" aria-live="polite"><p class="reading-meta">正在加载课程提案…</p></div>

## 审核与权限

投稿会成为公开 GitHub Issue，其他人可以讨论和补充，但不能通过投稿表单改动网站。正式收录需要维护者检查课程质量、资源来源和说明，再提交 Markdown。

- **普通访客**：推荐课程、补充信息、参与讨论。
- **维护者**：审核提案、生成收录草稿、决定发布。
- **网站源码**：由 GitHub 仓库权限管理，投稿表单不授予写入权限。

提案池展示最近 100 条 Issue 中的课程提案；更多历史记录请使用 GitHub。未审核内容不进入正式课程目录和知识图谱。

<details class="admin-guide"><summary>维护者：如何审核与收录</summary><p>在 GitHub 提案中提出问题；需要补充时添加 <code>help wanted</code> 标签。审核通过后，可在提案卡片中展开“生成收录草稿”，检查生成的文章并在 GitHub 提交。提交文件带有 <code>submission_issue</code> 编号，下一次部署后会自动加入“共建课程”目录，并将提案标为“已收录”。关闭 Issue 本身不会发布文章。</p><p>收录草稿是辅助入口；能否提交由 GitHub 真实写入权限决定。已有文件请直接编辑，避免重复收录。来源链接、推荐理由和作者信息应由维护者复核。</p></details>
