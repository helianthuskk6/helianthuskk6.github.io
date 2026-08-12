## 目录结构

```
personal-blog/
├── index.html        # 首页（头像、简介、最新文章）
├── about.html        # 关于我（介绍、基本信息、背景、时间线）
├── blog.html         # 博客文章列表
├── post.html         # 文章阅读页（自动渲染 Markdown）
├── projects.html     # 项目作品展示
├── contact.html      # 联系我
├── 404.html          # 自定义 404 页面
├── data/
│   ├── site.json     # 全站配置：个人信息、主题、社交链接
│   └── posts.json    # 文章列表（标题、日期、标签、摘要）
├── posts/            # 文章正文（Markdown 格式）
├── css/style.css     # 样式（亮/暗主题、响应式）
├── js/
│   ├── main.js       # 页面逻辑：配置注入、主题切换、列表渲染
│   └── markdown.js   # 轻量 Markdown 渲染器
└── assets/           # 头像、图标等图片资源
```

## 快速开始

### 本地预览

网站通过浏览器加载本地文件，因此请用本地服务器预览（不要直接双击 HTML 文件）：

```bash
cd personal-blog
python -m http.server 8000
```

然后打开浏览器访问 <http://localhost:8000>。

## 自定义指南

### 1. 修改个人信息（最重要的文件：`data/site.json`）

| 字段 | 作用 |
| --- | --- |
| `site.title` / `site.author` | 网站名称、作者名 |
| `site.avatar` | 头像图片路径（把照片放到 `assets/` 后替换路径） |
| `site.nav` | 顶部导航菜单，可增删页面 |
| `site.footerText` | 页脚文字 |
| `hero.*` | 首页大标题区：名字、动态职位、简介、按钮 |
| `social.*` | 社交链接，支持 github / email / twitter / bilibili / weibo / wechat / zhihu / juejin / rss，留空则自动隐藏 |
| `theme.accent` / `theme.accent2` | 网站主题色（任意十六进制颜色） |
| `about.*` | 关于页：简介、基本信息卡片、背景故事、时间线 |
| `projects` | 项目卡片列表 |
| `contact.*` | 联系页文案和邮箱 |

修改后保存，刷新页面即可看到效果。

### 2. 更换头像与图标

把你的照片放到 `assets/` 文件夹里（例如 `assets/me.jpg`），然后把 `data/site.json` 中的 `site.avatar` 改成 `assets/me.jpg`。建议使用正方形图片。

### 3. 写一篇新文章

1. 在 `posts/` 里新建一个 Markdown 文件，例如 `posts/my-first-post.md`；
2. 在 `data/posts.json` 的 `posts` 数组中添加一条记录：

```json
{
  "slug": "my-first-post",
  "title": "我的第一篇文章",
  "date": "2026-08-12",
  "tags": ["随笔"],
  "summary": "一句话摘要，会显示在文章卡片上。",
  "file": "posts/my-first-post.md"
}
```

3. 刷新博客页，文章就会自动出现。

文章支持常见 Markdown 语法：标题、加粗、斜体、列表、引用、链接、图片、代码块、分隔线。

### 4. 添加新页面

复制任意一个页面文件（如 `contact.html`），改内容后在 `data/site.json` 的 `site.nav` 中添加：

```json
{ "label": "新页面", "url": "new-page.html" }
```

### 5. 深浅色主题

右上角的月亮/太阳按钮可以在亮色与暗色之间切换，选择会被记住。跟随系统偏好也默认支持。


```bash
cd personal-blog
git init
git add .
git commit -m "我的个人博客"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<你的用户名>.github.io.git
git push -u origin main
```

3. 等 1-2 分钟，访问 `https://<你的用户名>.github.io` 就能看到你的网站。

### 方式二：项目网站

仓库使用普通名字（如 `my-blog`）：

1. 上传代码后，进入仓库 **Settings → Pages**；
2. Build and deployment 选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`；
3. 保存后网站地址为 `https://<你的用户名>.github.io/my-blog/`。

> 项目网站的链接会带仓库名前缀，属于正常现象。

### 绑定自己的域名（可选）

1. 在域名服务商添加一条 CNAME 记录指向 `<你的用户名>.github.io`；
2. 在仓库 **Settings → Pages → Custom domain** 里填上你的域名并保存；
3. 在项目根目录放一个 `CNAME` 文件，内容就是你的域名。

---


