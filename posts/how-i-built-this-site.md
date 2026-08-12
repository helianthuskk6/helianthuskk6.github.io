# 我是如何搭建这个网站的

这个网站没有使用任何复杂的框架，它就是一个**纯静态站点**：HTML、CSS 和一点点 JavaScript。好处是：

- 不需要安装环境，双击就能看懂
- 免费托管在 GitHub Pages 上
- 所有内容都通过一个配置文件管理，改起来很方便

## 网站里都有什么

```
personal-blog/
├── index.html        # 首页
├── about.html        # 关于我
├── blog.html         # 博客列表
├── post.html         # 文章阅读页
├── projects.html     # 项目展示
├── contact.html      # 联系我
├── data/
│   ├── site.json     # ★ 全站配置（个人信息都在这里）
│   └── posts.json    # 文章列表
├── posts/            # 文章内容（Markdown 格式）
└── css/ js/ assets/  # 样式、脚本、图片
```

## 怎么改我的信息

打开 `data/site.json`，你会看到这样的结构：

```json
{
  "site": { "title": "我的个人空间", "author": "你的名字" },
  "hero": { "name": "你的名字", "roles": ["前端开发者"] },
  "social": { "github": "https://github.com/你的用户名" },
  "theme": { "accent": "#6366f1", "accent2": "#a855f7" }
}
```

把里面的占位内容替换成你自己的，**保存刷新就能看到效果**，不需要重新构建。

## 怎么添加一篇新文章

1. 在 `posts/` 文件夹里新建一个 Markdown 文件，比如 `my-first-post.md`；
2. 在 `data/posts.json` 里加一条记录，填上标题、日期、标签和摘要；
3. 保存并刷新页面，文章就会出现在博客列表里。

## 怎么发布到 GitHub

1. 把整个文件夹推送到 GitHub 仓库（用户名.github.io 或普通仓库都可以）；
2. 在仓库设置（Settings → Pages）里选择分支部署；
3. 等一两分钟，你的网站就上线了，完全免费。

具体步骤可以参考项目的 README 文件。

> 最好的网站，是用自己的故事填满的网站。
