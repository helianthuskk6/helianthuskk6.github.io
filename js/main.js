'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const PAGE_NAME = location.pathname.split('/').pop() || 'index.html';

let SITE = null;
let POSTS = [];

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url} 加载失败 (${res.status})`);
  return res.json();
}

function setText(selector, text) {
  const el = $(selector);
  if (el && text != null) el.textContent = text;
}

/* ---------------- 站点配置 ---------------- */

async function loadSite() {
  try {
    SITE = await fetchJSON('data/site.json');
    applySite(SITE);
  } catch (err) {
    console.error(err);
    const el = $('#config-error');
    if (el) {
      el.hidden = false;
      el.textContent =
        '配置文件加载失败。请通过本地服务器（python -m http.server）或部署到 GitHub Pages 后访问，不要直接双击 HTML 文件。';
    }
  }
}

function applySite(site) {
  const { site: meta, hero, social, theme, about,/* projects,*/ contact } = site;

  document.title = meta.title;
  setText('#brand-name', meta.title);

  const avatar = meta.avatar || 'assets/avatar.svg';
  $$('.js-avatar').forEach((img) => {
    img.src = avatar;
  });

  renderNav();
  renderSocialLinks($('.js-social'), social);

  if (theme) {
    if (theme.accent) document.documentElement.style.setProperty('--accent', theme.accent);
    if (theme.accent2) document.documentElement.style.setProperty('--accent-2', theme.accent2);
  }

  setText('#footer-text', meta.footerText || `© ${new Date().getFullYear()} ${meta.author}`);

  if (hero) {
    setText('#hero-greeting', hero.greeting);
    setText('#hero-name', hero.name);
    setText('#hero-desc', hero.description);
    const btn1 = $('#hero-btn-primary');
    const btn2 = $('#hero-btn-secondary');
    if (btn1 && hero.primaryButton) {
      btn1.href = hero.primaryButton.url;
      btn1.textContent = hero.primaryButton.text;
    }
    if (btn2 && hero.secondaryButton) {
      btn2.href = hero.secondaryButton.url;
      btn2.textContent = hero.secondaryButton.text;
    }
    if (hero.roles && hero.roles.length) startTyping(hero.roles);
  }

  if (about) {
    setText('#about-intro', about.intro);
    setText('#about-background', about.background);

    const facts = $('#about-facts');
    if (facts && about.facts) {
      facts.innerHTML = about.facts
        .map(
          (f) =>
            `<div class="fact-card"><span class="fact-label">${f.label}</span><span class="fact-value">${f.value}</span></div>`
        )
        .join('');
    }

    const timeline = $('#about-timeline');
    if (timeline && about.timeline) {
      timeline.innerHTML = about.timeline
        .map(
          (t) =>
            `<li class="timeline-item"><span class="timeline-dot"></span><div class="timeline-card"><span class="timeline-date">${t.date}</span><h3>${t.title}</h3><p>${t.desc}</p></div></li>`
        )
        .join('');
    }
  }

 /* if (projects) {
    const grid = $('#projects-grid');
    if (grid) {
      grid.innerHTML = projects
        .map(
          (p) =>
            `<article class="project-card reveal"><h3>${p.name}</h3><p>${p.desc}</p><div class="project-tags">${
              (p.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')
            }</div>${
              p.link
                ? `<a class="project-link" href="${p.link}" target="_blank" rel="noopener">查看项目 →</a>`
                : ''
            }</article>`
        )
        .join('');
      initReveal();
    }
  }
*/
  if (contact) {
    setText('#contact-text', contact.text);
    const mail = $('#contact-email');
    if (mail) mail.href = 'mailto:' + (contact.email || '');
  }
}

function renderNav() {
  const nav = $('#site-nav');
  if (!nav || !SITE?.site?.nav) return;
  nav.innerHTML = SITE.site.nav
    .map((item) => {
      const active = item.url === PAGE_NAME ? ' class="nav-link active"' : ' class="nav-link"';
      return `<a${active} href="${item.url}">${item.label}</a>`;
    })
    .join('');
  $$('#site-nav a').forEach((a) =>
    a.addEventListener('click', () => document.body.classList.remove('nav-open'))
  );
}

/* ---------------- 社交链接 ---------------- */

const SOCIAL_LABELS = {
  github: 'GitHub',
  twitter: 'Twitter',
  email: '邮箱',
  bilibili: 'B站',
  weibo: '微博',
  wechat: '微信',
  zhihu: '知乎',
  rss: 'RSS',
  QQ: 'QQ',
};

const SOCIAL_ICONS = {
  github:
    '<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>',
  twitter:
    '<path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/>',
  email:
    '<path d="M12 13.4 2.4 6.2c.3-.5.8-.9 1.4-.9h16.4c.6 0 1.1.4 1.4.9L12 13.4z"/><path d="M21.6 8.1v9.8c0 1.1-.9 2-2 2H4.4c-1.1 0-2-.9-2-2V8.1l9.6 7.2 9.6-7.2z"/>',
  QQ:
    '<path d="M16.001,31.632c-2.787,0-5.346-.933-6.993-2.326-.837,.25-1.907,.652-2.582,1.151-.578,.427-.506,.861-.402,1.037,.457,.772,7.844,.493,9.977,.253v-.114Z" opacity=".4"></path><path d="M16.001,31.632c2.788,0,5.346-.933,6.994-2.326,.836,.25,1.907,.652,2.582,1.151,.578,.427,.506,.861,.401,1.037-.457,.772-7.844,.493-9.977,.253v-.114Z" opacity=".4"></path> <path d="M14.651,6.639c.044,.554-.26,1.046-.678,1.099-.419,.054-.793-.351-.838-.905-.044-.554,.26-1.046,.677-1.099,.42-.054,.795,.352,.839,.905"></path> <path d="M17.31,6.824c.086-.153,.668-.959,1.874-.666,.317,.077,.463,.191,.494,.235,.046,.066,.058,.16,.012,.286-.092,.25-.281,.244-.386,.195-.068-.032-.908-.591-1.682,.244-.053,.057-.149,.077-.239,.009-.09-.068-.127-.207-.074-.303"></path> <path d="M26.016,13.435s-4.299,1.357-9.999,1.396h-.034c-5.691-.038-9.985-1.391-9.999-1.396l-1.44,3.594c1.6,.483,3.371,.889,5.141,1.187v4.674s2.21,.446,4.424,.137v-4.3c.651,.037,1.28,.053,1.874,.046h.034c3.375,.041,7.838-.659,11.439-1.745l-1.44-3.594Z" opacity=".4"></path> <path d="M28.525,20.046c-.285-.918-.675-1.989-1.069-3.017-1.214,.366-2.527,.688-3.862,.953,.195,1.245,.304,2.773,.196,4.572-.293,4.902-3.204,7.984-7.698,8.028h-.183c-4.494-.045-7.405-3.126-7.698-8.028-.107-1.799,.001-3.328,.196-4.572-1.336-.265-2.649-.587-3.864-.953-.394,1.028-.784,2.099-1.069,3.017-1.361,4.379-.92,6.191-.584,6.232,.72,.087,2.804-3.296,2.804-3.296,0,3.438,3.104,8.717,10.212,8.765,.032,0,.157,0,.188,0,7.108-.048,10.212-5.327,10.212-8.765,0,0,2.083,3.383,2.804,3.296,.336-.041,.777-1.853-.584-6.232Z"></path> <path d="M15.983,14.831h.034c5.701-.039,9.999-1.396,9.999-1.396,.001-.042,.019-.749,.019-1.114C26.035,6.176,23.134,0,16,0,8.866,0,5.965,6.176,5.965,12.321c0,.365,.018,1.072,.019,1.114,.015,.005,4.308,1.357,9.999,1.396Zm.9-8.37c.052-1.402,.879-2.504,1.846-2.461,.968,.044,1.709,1.216,1.656,2.618-.052,1.401-.879,2.504-1.846,2.46-.967-.044-1.709-1.215-1.656-2.618Zm-3.611-2.461c.967-.043,1.793,1.059,1.846,2.461,.053,1.402-.689,2.575-1.656,2.618-.968,.044-1.795-1.059-1.847-2.46-.052-1.402,.689-2.575,1.657-2.618Zm-3.377,7.058c.259-.573,2.863-1.211,6.088-1.211h.035c3.225,0,5.829,.638,6.088,1.211,.012,.025,.019,.052,.019,.081,0,.041-.014,.079-.036,.111-.218,.318-3.11,1.888-6.071,1.888h-.035c-2.961,0-5.853-1.57-6.071-1.888-.021-.032-.036-.069-.036-.11,0-.029,.007-.057,.019-.082Z"></path>',
  X:
    '<path d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"></path>'
    
};

function renderSocialLinks(container, social) {
  if (!container || !social) return;
  const items = Object.entries(social).filter(([, value]) => value && String(value).trim());
  container.innerHTML = items
    .map(([key, value]) => {
      let href = String(value).trim();
      if (key === 'email' && !href.startsWith('mailto:')) href = 'mailto:' + href;
      const icon = SOCIAL_ICONS[key];
      const label = SOCIAL_LABELS[key] || key;
      if (icon) {
        return `<a class="social-link" href="${href}" target="_blank" rel="noopener" aria-label="${label}" title="${label}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${icon}</svg></a>`;
      }
      return `<a class="social-pill" href="${href}" target="_blank" rel="noopener">${label}</a>`;
    })
    .join('');
}

/* ---------------- 深色 / 浅色主题 ---------------- */

const MOON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const SUN_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';

function initTheme() {
  const saved = localStorage.getItem('blog-theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.dataset.theme = saved;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.dataset.theme = 'dark';
  }
  syncThemeButton();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('blog-theme', next);
  syncThemeButton();
}

function syncThemeButton() {
  const btn = $('#theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.dataset.theme === 'dark';
  btn.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
  btn.innerHTML = isDark ? SUN_SVG : MOON_SVG;
}

/* ---------------- 打字机效果 ---------------- */

function startTyping(roles) {
  const el = $('#hero-typing');
  if (!el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 90);
    } else {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 45);
    }
  }
  tick();
}

/* ---------------- 滚动显现 ---------------- */

function initReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------------- 博客文章 ---------------- */

async function loadPosts() {
  try {
    POSTS = (await fetchJSON('data/posts.json')).posts || [];
  } catch (err) {
    POSTS = [];
    console.error(err);
  }
  return POSTS;
}

function postCard(post) {
  const tags = (post.tags || [])
    .map((t) => `<a class="tag tag-link" href="blog.html?tag=${encodeURIComponent(t)}">${t}</a>`)
    .join('');
  const url = `post.html?slug=${encodeURIComponent(post.slug)}`;
  return `
    <article class="post-card reveal">
      <div class="post-meta"><time>${post.date}</time>${tags ? `<span class="post-tags">${tags}</span>` : ''}</div>
      <h3><a href="${url}">${post.title}</a></h3>
      <p class="post-summary">${post.summary || ''}</p>
      <a class="post-more" href="${url}">阅读全文 →</a>
    </article>`;
}

async function renderBlogList(selector, limit, tag) {
  const grid = $(selector);
  if (!grid) return;
  await loadPosts();
  let list = POSTS;
  if (tag) list = list.filter((p) => (p.tags || []).includes(tag));
  if (limit) list = list.slice(0, limit);
  grid.innerHTML = list.length
    ? list.map(postCard).join('')
    : '<p class="empty">暂时没有文章，快去写第一篇吧！</p>';
  initReveal();
}

async function renderPostPage() {
  const article = $('#post-content');
  if (!article) return;

  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) {
    article.innerHTML = '<p>未指定要阅读的文章。</p>';
    return;
  }

  await loadPosts();
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    article.innerHTML = '<p>找不到这篇文章，可能它已被删除。</p>';
    return;
  }

  document.title = `${post.title} | ${SITE?.site?.title || '博客'}`;
  setText('#post-title', post.title);
  setText('#post-date', post.date);
  const tags = $('#post-tags');
  if (tags) {
    tags.innerHTML = (post.tags || [])
      .map((t) => `<a class="tag tag-link" href="blog.html?tag=${encodeURIComponent(t)}">${t}</a>`)
      .join('');
  }

  try {
    const res = await fetch(post.file, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`文章加载失败 (${res.status})`);
    const md = await res.text();
    article.innerHTML = renderMarkdown(md);
  } catch (err) {
    console.error(err);
    article.innerHTML = '<p>文章内容加载失败。</p>';
  }

  // 上一篇 / 下一篇
  const idx = POSTS.findIndex((p) => p.slug === slug);
  const prev = POSTS[idx + 1];
  const next = POSTS[idx - 1];
  const nav = $('#post-nav');
  if (nav) {
    nav.innerHTML =
      (prev
        ? `<a class="post-nav-link" href="post.html?slug=${encodeURIComponent(prev.slug)}">← ${prev.title}</a>`
        : '<span></span>') +
      (next
        ? `<a class="post-nav-link" href="post.html?slug=${encodeURIComponent(next.slug)}">${next.title} →</a>`
        : '<span></span>');
  }
}

/* ---------------- 初始化 ---------------- */

async function init() {
  initTheme();
  initReveal();
  await loadSite();

  const params = new URLSearchParams(location.search);

  await renderBlogList('#posts-grid', 0, params.get('tag'));
  await renderBlogList('#latest-posts', 3);
  await renderPostPage();

  const tagInfo = $('#tag-info');
  const tag = params.get('tag');
  if (tagInfo && tag) {
    tagInfo.hidden = false;
    tagInfo.innerHTML = `正在查看标签：<strong>${tag}</strong>　<a href="blog.html">清除筛选</a>`;
  }

  const themeBtn = $('#theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const navToggle = $('#nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  }
}

document.addEventListener('DOMContentLoaded', init);
