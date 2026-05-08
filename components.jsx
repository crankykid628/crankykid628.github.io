/* global React */
const { useState, useEffect, useMemo, useRef } = React;

// ----- Icons -----
const Icon = {
  Sun: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  Moon: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Search: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  Arrow: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  Back: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Github: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"/></svg>,
  Rss: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>,
};

// ----- Header -----
function Header({ route, onNav, theme, onToggleTheme }) {
  const links = [
    { id: "home", label: "HOME" },
    { id: "archive", label: "LS" },
    { id: "tags", label: "TAGS" },
    { id: "about", label: "WHOAMI" },
  ];
  return (
    <header className="site-header">
      <div className="nav-inner">
        <div className="brand" onClick={() => onNav({ page: "home" })}>
          <div className="brand-mark">~</div>
          <span>{window.BLOG_CONFIG.name}'s blog</span>
        </div>
        <nav className="nav-links">
          {links.map(l => (
            <span key={l.id}
              className={"nav-link" + (route.page === l.id ? " active" : "")}
              onClick={() => onNav({ page: l.id })}>
              {l.label}
            </span>
          ))}
          <button className="nav-icon-btn" title="Toggle theme" onClick={onToggleTheme}>
            {theme === "dark" ? <Icon.Sun/> : <Icon.Moon/>}
          </button>
        </nav>
      </div>
    </header>
  );
}

// ----- Hero -----
function Hero() {
  const glyphs = useMemo(() => {
    const items = [
      "0x7fff8c2e1000", "rop_chain += p64(pop_rdi)", "/* segfault */",
      "GET /admin?id=../etc/passwd", "buf[64] = 0x41414141",
      "ret2libc → execve(\"/bin/sh\")", "0xdeadbeef", "%n%n%n",
      "if (auth.token === null)", "kerberoast → hashcat -m 13100",
      "system(\"/bin/sh\")", "0x90 0x90 0x90 NOP",
    ];
    return items.map((t, i) => ({
      text: t,
      top: 6 + ((i * 37) % 84) + "%",
      left: ((i * 53) % 90) + "%",
      delay: (i * 0.3) + "s",
    }));
  }, []);
  return (
    <section className="hero">
      <div className="hero-grid"/>
      <div className="hero-scanlines"/>
      <div className="hero-glyphs">
        {glyphs.map((g, i) => <span key={i} style={{top: g.top, left: g.left, animationDelay: g.delay}}>{g.text}</span>)}
      </div>

      {/* Bebop-only decorative SVG */}
      <svg className="hero-bebop-craft" viewBox="0 0 240 240" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="120" cy="120" r="92" strokeDasharray="3 6"/>
        <circle cx="120" cy="120" r="60"/>
        <path d="M120 28 L120 212 M28 120 L212 120"/>
        <path d="M120 60 L100 92 L100 148 L120 180 L140 148 L140 92 Z"/>
        <path d="M100 100 L78 110 L78 138 L100 148 M140 100 L162 110 L162 138 L140 148"/>
        <circle cx="120" cy="120" r="6" fill="currentColor"/>
        <text x="200" y="225" fontFamily="monospace" fontSize="9" fill="currentColor" stroke="none">SES.001</text>
      </svg>
      <div className="hero-bebop-corner">
        <div className="bebop-tag">SESSION #001 / TRANSMISSION OPEN</div>
        <div className="bebop-brief">A signal from the cracks of the network. Notes scraped from CTFs, broken binaries, and machines that should not have been left exposed. The bounty is knowledge. The crew is one. Tune in.</div>
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">notes from the trenches</div>
        <h1 className="hero-title">
          {window.BLOG_CONFIG.heroLine1} <span className="accent">{window.BLOG_CONFIG.heroLine2}</span>
        </h1>
        <p className="hero-sub">{window.BLOG_CONFIG.bio}</p>
      </div>

      <div className="hero-corner-meta">
        <span>SYS://blog.limbokid</span>
        <span>UPLINK · STABLE</span>
      </div>
    </section>
  );
}

// ----- PostCard -----
function PostCard({ post, onOpen, onTag, index }) {
  const idx = String((index ?? 0) + 1).padStart(2, "0");
  return (
    <article className="post-card fade-up" data-index={idx} onClick={() => onOpen(post)}>
      <div className="post-meta">
        <span>{formatDate(post.date)}</span>
        <span className="dot"/>
        <span>{post.readTime} min read</span>
      </div>
      <h2 className="post-title">{post.title}</h2>
      <p className="post-excerpt">{post.excerpt}</p>
      <div className="post-tags">
        {post.tags.map(t => (
          <span key={t} className="tag" onClick={(e) => { e.stopPropagation(); onTag(t); }}>{t}</span>
        ))}
      </div>
    </article>
  );
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

// ----- Sidebar -----
function Sidebar({ onNav, onTag }) {
  const recent = window.POSTS.slice(0, 4);
  const topTags = window.ALL_TAGS.slice(0, 12);
  return (
    <aside className="sidebar">
      <div className="side-card profile-card">
        <div className="avatar">{window.BLOG_CONFIG.initials}</div>
        <h3 className="profile-name">{window.BLOG_CONFIG.name}</h3>
        <p className="profile-role">{window.BLOG_CONFIG.role}</p>
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-num">{window.POSTS.length}</span>
            <span className="stat-label">posts</span>
          </div>
          <div className="stat">
            <span className="stat-num">{window.ALL_TAGS.length}</span>
            <span className="stat-label">tags</span>
          </div>
          <div className="stat">
            <span className="stat-num">{window.BLOG_CONFIG.years}</span>
            <span className="stat-label">years</span>
          </div>
        </div>
      </div>

      <div className="side-card">
        <h4 className="side-title">Recent</h4>
        <div className="side-recent">
          {recent.map(p => (
            <div key={p.slug} className="side-recent-item" onClick={() => onNav({ page: "post", slug: p.slug })}>
              <div className="t">{p.title}</div>
              <div className="d">{formatDate(p.date)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="side-card">
        <h4 className="side-title">Top Tags</h4>
        <div className="side-tags">
          {topTags.map(t => (
            <span key={t.name} className="tag" onClick={() => onTag(t.name)}>
              {t.name}<span className="count">{t.count}</span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ----- Pages -----
function HomePage({ onNav }) {
  const onTag = (t) => onNav({ page: "tags", filter: t });
  const onOpen = (p) => onNav({ page: "post", slug: p.slug });
  return (
    <>
      <Hero/>
      <div className="layout">
        <main className="post-list">
          {window.POSTS.map((p, i) => <PostCard key={p.slug} post={p} index={i} onOpen={onOpen} onTag={onTag}/>)}
        </main>
        <Sidebar onNav={onNav} onTag={onTag}/>
      </div>
    </>
  );
}

function ArchivePage({ onNav }) {
  return (
    <div className="layout">
      <main>
        <header className="page-header">
          <div className="page-eyebrow">$ ls -la posts/</div>
          <h1 className="page-title">Archive</h1>
          <p className="page-sub">{window.POSTS.length} posts, in reverse-chronological order.</p>
        </header>
        {window.POSTS_BY_YEAR.map(([year, posts]) => (
          <section key={year} className="archive-year">
            <h2 className="archive-year-label">
              {year}<span className="archive-year-count">{posts.length} posts</span>
            </h2>
            <div className="archive-list">
              {posts.map(p => (
                <div key={p.slug} className="archive-item fade-up" onClick={() => onNav({ page: "post", slug: p.slug })}>
                  <span className="archive-date">{p.date.slice(5)}</span>
                  <span className="archive-title">{p.title}</span>
                  <span className="archive-tags">
                    {p.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Sidebar onNav={onNav} onTag={(t) => onNav({ page: "tags", filter: t })}/>
    </div>
  );
}

function TagsPage({ onNav, filter }) {
  const [active, setActive] = useState(filter || null);
  useEffect(() => { setActive(filter || null); }, [filter]);
  const visible = active ? window.POSTS.filter(p => p.tags.includes(active)) : window.POSTS;
  return (
    <div className="layout">
      <main>
        <header className="page-header">
          <div className="page-eyebrow">$ tags --all</div>
          <h1 className="page-title">Tags</h1>
          <p className="page-sub">{window.ALL_TAGS.length} tags across {window.POSTS.length} posts. Click to filter.</p>
        </header>
        <div className="tag-cloud">
          <span className={"tag-chip" + (!active ? " active" : "")} onClick={() => setActive(null)}>
            all<span className="count">{window.POSTS.length}</span>
          </span>
          {window.ALL_TAGS.map(t => (
            <span key={t.name} className={"tag-chip" + (active === t.name ? " active" : "")} onClick={() => setActive(t.name)}>
              #{t.name}<span className="count">{t.count}</span>
            </span>
          ))}
        </div>

        <div className="archive-list">
          {visible.map(p => (
            <div key={p.slug} className="archive-item fade-up" onClick={() => onNav({ page: "post", slug: p.slug })}>
              <span className="archive-date">{p.date}</span>
              <span className="archive-title">{p.title}</span>
              <span className="archive-tags">
                {p.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
              </span>
            </div>
          ))}
        </div>
      </main>
      <Sidebar onNav={onNav} onTag={(t) => setActive(t)}/>
    </div>
  );
}

function AboutPage({ onNav }) {
  return (
    <div className="layout">
      <main>
        <header className="page-header">
          <div className="page-eyebrow">$ whoami</div>
          <h1 className="page-title">{window.BLOG_CONFIG.name}</h1>
          <p className="page-sub">{window.BLOG_CONFIG.role}</p>
        </header>
        <div className="post-body" style={{fontSize: 17}}>
          <p>Hi — I'm {window.BLOG_CONFIG.name}. I write about cybersecurity here: mostly notes I take while working through CTFs, security courses, and HackTheBox machines, plus the occasional deeper dive when something clicks for me.</p>
          <p>The posts are equal parts <em>"future me will need this"</em> and <em>"writing it down is the best way to learn it"</em>. If you find any of this useful — even better.</p>
          <h2>What I'm into right now</h2>
          <p>Binary exploitation (mostly Linux, dipping into Windows kernel), Active Directory pentesting, fuzzing infrastructure, and reading way too much cryptography on weekends.</p>
          <h2>Find me</h2>
          <p>GitHub · Twitter · CTFtime — handles in the footer. The fastest way to reach me is e-mail.</p>
        </div>
      </main>
      <Sidebar onNav={onNav} onTag={(t) => onNav({ page: "tags", filter: t })}/>
    </div>
  );
}

function highlight(line, lang) {
  // Simple, vibe-only syntax highlighting (no real parser)
  const kwByLang = {
    c: ["void","int","char","return","if","else","for","while","#include","static","const"],
    python: ["from","import","def","return","if","else","for","while","class","with","as","in","not"],
    http: ["GET","POST","PUT","DELETE","HTTP/1.1","Host","Authorization"],
  };
  const kws = kwByLang[lang] || [];
  let html = line
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // strings
  html = html.replace(/(&#39;|')([^&]*?)(&#39;|')/g, '<span class="tok-str">\'$2\'</span>');
  html = html.replace(/(["])((?:\\.|(?!\1).)*)\1/g, '<span class="tok-str">"$2"</span>');
  // numbers
  html = html.replace(/\b(0x[0-9a-fA-F]+|\d+)\b/g, '<span class="tok-num">$1</span>');
  // comments
  html = html.replace(/(#.*$|\/\/.*$|\/\*.*?\*\/)/g, '<span class="tok-com">$1</span>');
  // keywords
  if (kws.length) {
    const re = new RegExp("\\b(" + kws.join("|") + ")\\b", "g");
    html = html.replace(re, '<span class="tok-kw">$1</span>');
  }
  return html;
}

function CodeBlock({ block }) {
  const lines = block.text.split("\n");
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{block.lang || "text"}</span>
        <span style={{cursor:"pointer"}} onClick={(e) => {
          navigator.clipboard?.writeText(block.text);
          e.target.textContent = "copied";
          setTimeout(() => { e.target.textContent = "copy"; }, 1200);
        }}>copy</span>
      </div>
      <pre>{lines.map((l, i) =>
        <div key={i} dangerouslySetInnerHTML={{__html: highlight(l, block.lang) || "&nbsp;"}}/>
      )}</pre>
    </div>
  );
}

function PostPage({ slug, onNav }) {
  const post = window.POSTS.find(p => p.slug === slug);
  if (!post) return <div className="layout single"><main><p>Post not found.</p></main></div>;
  const body = post.body || [
    { type: "p", text: post.excerpt },
    { type: "p", text: "(Full post coming soon — this is a draft excerpt. The blog scaffolding shows what a complete post page will look like, including code blocks, headings, and inline highlighting.)" },
    { type: "h2", text: "Outline" },
    { type: "p", text: "1. Background and motivation\n2. The setup — tools and target\n3. The exploit, step by step\n4. Mitigations and defender's view\n5. Further reading" },
  ];
  return (
    <div className="layout single">
      <main>
        <span className="post-back" onClick={() => onNav({ page: "home" })}>
          <Icon.Back/> back to all posts
        </span>
        <header className="post-hero">
          <div className="post-meta">
            <span>{formatDate(post.date)}</span>
            <span className="dot"/>
            <span>{post.readTime} min read</span>
            <span className="dot"/>
            <span>by {window.BLOG_CONFIG.name}</span>
          </div>
          <h1>{post.title}</h1>
          <div className="post-tags">
            {post.tags.map(t => (
              <span key={t} className="tag" onClick={() => onNav({ page: "tags", filter: t })}>{t}</span>
            ))}
          </div>
        </header>
        <div className="post-body">
          {body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "code") return <CodeBlock key={i} block={b}/>;
            return <p key={i}>{b.text}</p>;
          })}
        </div>
      </main>
    </div>
  );
}

// ----- Footer -----
function Footer() {
  return (
    <footer className="site-footer">
      <div className="row">
        <div style={{display:"flex", justifyContent:"center", gap: 18, marginBottom: 12}}>
          <a><Icon.Github/></a>
          <a><Icon.Rss/></a>
        </div>
        <div>© 2024 — 2026 · {window.BLOG_CONFIG.name} · powered by curiosity & coffee</div>
      </div>
    </footer>
  );
}

Object.assign(window, { Header, HomePage, ArchivePage, TagsPage, AboutPage, PostPage, Footer });
