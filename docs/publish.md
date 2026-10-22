# 上传笔记与发布网站

## 网页上传

1. 打开本站右上角的 GitHub 仓库链接。
2. 进入 `docs/notes/`，点击 **Add file → Upload files**。
3. 上传 Markdown 文件，检查文件名和内容后提交到 `main`。
4. 等待 GitHub Actions 构建成功；新文章会加入导航、搜索和图谱。

只使用英文、数字和连字符命名文件更方便维护，例如 `binary-search.md`。文章第一行使用 `# 文章标题`，这个标题会用在导航与知识关系图中。

## 图片和 PDF

将附件放入 `docs/attachments/`，笔记中使用相对链接。PDF 通过链接打开，图片可以嵌入正文：

```markdown
![实验结果](../attachments/result.png)
[查看实验材料](../attachments/material.pdf)
```

## 编辑现有文章

点击文章右上角的铅笔按钮，在 GitHub 修改 Markdown。使用提交说明记录修改目的。

## 建立关系图

文章中添加到其他 Markdown 的相对链接，构建时自动生成连线。推荐使用明确的链接文本，方便阅读和检索。

## 讨论设置

在仓库 Settings → General → Features 中开启 Discussions。每篇文章底部提供讨论入口。

如果希望评论直接出现在页面内，需要安装并配置 Giscus。将生成的 `repo_id`、`category_id` 填入 `mkdocs.yml` 的 `extra.giscus`。未配置时使用仓库讨论链接，不会显示虚假的评论。
