# Git 与知识管理

## 为什么用 Git 保存笔记

Git 能记录每次修改、比较两个版本，并把代码与笔记放在同一套工作流里。仓库是正式内容的来源，网站是便于阅读的呈现方式。

## 一次最小的更新

```bash
git pull
# 编辑 docs/notes/ 下的 Markdown
git add docs/notes/
git commit -m "docs: add learning note"
git push
```

## 笔记和代码如何配合

文章里记录问题、推理和结论，代码里保留实验。用相对链接把相关知识连接起来，避免在每篇笔记里反复复制同一段解释。

从[Markdown 写作](markdown.md)开始统一格式，再参考[发布说明](../publish.md)将笔记加入网站。
