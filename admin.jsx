/* global React */
const { useState, useEffect, useMemo, useRef } = React;

const STORAGE_KEY = "blog-posts-v1";

// ---------- 載入/儲存 ----------
function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // 第一次使用 - 從 data.jsx 的 POSTS 載入預設值
  return window.POSTS;
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// ---------- Markdown-ish 解析 ----------
// 文章內文支援簡易 Markdown:
//   ## 標題      → h2
//   ```lang     → code block (用 ``` 結束)
//   其他      → 段落
function parseMarkdown(md) {
  if (!md) return [];
  const blocks = [];
  const lines = md.split("\n");
  let i = 0;
  let para = [];
  const flushPara = () => {
    if (para.length) {
      const text = para.join("\n").trim();
      if (text) blocks.push({ type: "p", text });
      para = [];
    }
  };
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      flushPara();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
    } else if (line.startsWith("```")) {
      flushPara();
      const lang = line.slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", lang, text: code.join("\n") });
    } else if (line.trim() === "") {
      flushPara();
      i++;
    } else {
      para.push(line);
      i++;
    }
  }
  flushPara();
  return blocks;
}

// 把 body 陣列轉回 markdown (給編輯器用)
function blocksToMarkdown(body) {
  if (!body) return "";
  return body.map(b => {
    if (b.type === "h2") return "## " + b.text;
    if (b.type === "code") return "```" + (b.lang || "") + "\n" + b.text + "\n```";
    return b.text;
  }).join("\n\n");
}

// ---------- 自動算閱讀時間 ----------
function estimateReadTime(text) {
  // 中文字 + 英文字 大約用 300 字/分鐘
  const chars = text.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 300));
}

// ---------- 重算 tag 統計 ----------
function recomputeIndexes(posts) {
  window.POSTS = posts;
  const counts = {};
  posts.forEach(p => p.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  window.TAG_COUNTS = counts;
  window.ALL_TAGS = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  const groups = {};
  posts.forEach(p => {
    const y = p.date.slice(0, 4);
    if (!groups[y]) groups[y] = [];
    groups[y].push(p);
  });
  window.POSTS_BY_YEAR = Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

// ---------- 編輯器面板 ----------
function AdminEditor({ post, onSave, onCancel, onDelete }) {
  const isNew = !post;
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [date, setDate] = useState(post?.date || new Date().toISOString().slice(0, 10));
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [tagsStr, setTagsStr] = useState(post?.tags?.join(", ") || "");
  const [bodyMd, setBodyMd] = useState(blocksToMarkdown(post?.body) || "");

  // 標題自動產生 slug (新文章)
  useEffect(() => {
    if (isNew && title && !slug) {
      const auto = title.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);
      setSlug(auto || "post-" + Date.now());
    }
  }, [title]);

  function handleSave() {
    if (!title.trim()) { alert("請輸入標題"); return; }
    if (!slug.trim()) { alert("請輸入 slug"); return; }
    const body = parseMarkdown(bodyMd);
    const tags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);
    const newPost = {
      slug: slug.trim(),
      title: title.trim(),
      date,
      excerpt: excerpt.trim() || (body.find(b => b.type === "p")?.text.slice(0, 120) || ""),
      tags,
      readTime: estimateReadTime(bodyMd),
      body,
    };
    onSave(newPost, isNew);
  }

  return (
    <div className="admin-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="admin-modal">
        <div className="admin-header">
          <h2>{isNew ? "新增貼文" : "編輯貼文"}</h2>
          <button className="admin-close" onClick={onCancel}>✕</button>
        </div>
        <div className="admin-body">
          <label className="admin-field">
            <span>標題</span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="文章標題" />
          </label>
          <div className="admin-row">
            <label className="admin-field">
              <span>Slug (網址)</span>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="my-first-post" />
            </label>
            <label className="admin-field">
              <span>日期</span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </label>
          </div>
          <label className="admin-field">
            <span>標籤 (用逗號分隔)</span>
            <input type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="pwn, writeup, ctf" />
          </label>
          <label className="admin-field">
            <span>摘要 (首頁顯示，留空會自動從內文擷取)</span>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} />
          </label>
          <label className="admin-field">
            <span>內文 (支援簡易 Markdown:  <code>## 標題</code>、<code>```lang</code> 程式碼)</span>
            <textarea
              className="admin-body-input"
              value={bodyMd}
              onChange={e => setBodyMd(e.target.value)}
              rows={18}
              placeholder={"開頭一段介紹...\n\n## 第一個小節\n\n這裡寫內容。\n\n```python\nprint('hello')\n```\n\n更多段落..."}
            />
          </label>
        </div>
        <div className="admin-footer">
          {!isNew && <button className="admin-btn danger" onClick={() => {
            if (confirm("確定要刪除這篇文章嗎?")) onDelete(post.slug);
          }}>刪除</button>}
          <div style={{flex: 1}} />
          <button className="admin-btn ghost" onClick={onCancel}>取消</button>
          <button className="admin-btn primary" onClick={handleSave}>儲存</button>
        </div>
      </div>
    </div>
  );
}

// ---------- 文章列表 (管理用) ----------
function AdminList({ posts, onNew, onEdit, onClose, onReset }) {
  return (
    <div className="admin-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-modal admin-list">
        <div className="admin-header">
          <h2>文章管理</h2>
          <button className="admin-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-list-toolbar">
          <button className="admin-btn primary" onClick={onNew}>+ 新增貼文</button>
          <div style={{flex: 1}} />
          <span style={{fontSize: 13, color: "var(--text-mute)"}}>共 {posts.length} 篇</span>
          <button className="admin-btn ghost small" onClick={() => {
            if (confirm("這會清掉你所有的文章和編輯,還原到範例。確定?")) onReset();
          }}>還原預設</button>
        </div>
        <div className="admin-list-body">
          {posts.length === 0 && <div className="admin-empty">還沒有文章 — 點「新增貼文」開始寫第一篇吧。</div>}
          {posts.map(p => (
            <div key={p.slug} className="admin-list-item" onClick={() => onEdit(p)}>
              <div className="admin-list-main">
                <div className="admin-list-title">{p.title}</div>
                <div className="admin-list-meta">
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>/{p.slug}</span>
                  {p.tags.length > 0 && <><span>·</span><span>{p.tags.map(t => "#"+t).join(" ")}</span></>}
                </div>
              </div>
              <button className="admin-btn ghost small">編輯 →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- 浮動「管理」按鈕 ----------
function AdminFab({ onOpen }) {
  return (
    <button className="admin-fab" onClick={onOpen} title="管理文章">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      <span>寫文章</span>
    </button>
  );
}

// ---------- 主管理元件 ----------
function AdminRoot({ onPostsChange }) {
  const [posts, setPosts] = useState(() => loadPosts());
  const [view, setView] = useState(null); // null | "list" | { editing: post|null }

  // 初次載入時把 localStorage 的資料同步到全域
  useEffect(() => {
    recomputeIndexes(posts);
    onPostsChange?.();
  }, []);

  function commit(next) {
    setPosts(next);
    savePosts(next);
    recomputeIndexes(next);
    onPostsChange?.();
  }

  function handleSave(post, isNew) {
    let next;
    if (isNew) {
      if (posts.some(p => p.slug === post.slug)) {
        alert("slug 已存在,請換一個");
        return;
      }
      next = [post, ...posts];
    } else {
      next = posts.map(p => p.slug === view.editing.slug ? post : p);
    }
    next.sort((a, b) => b.date.localeCompare(a.date));
    commit(next);
    setView("list");
  }

  function handleDelete(slug) {
    commit(posts.filter(p => p.slug !== slug));
    setView("list");
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = window.__INITIAL_POSTS__ || [];
    setPosts(fresh);
    recomputeIndexes(fresh);
    onPostsChange?.();
    setView("list");
  }

  return (
    <>
      <AdminFab onOpen={() => setView("list")} />
      {view === "list" && (
        <AdminList
          posts={posts}
          onNew={() => setView({ editing: null })}
          onEdit={(p) => setView({ editing: p })}
          onClose={() => setView(null)}
          onReset={handleReset}
        />
      )}
      {view && view.editing !== undefined && (
        <AdminEditor
          post={view.editing}
          onSave={handleSave}
          onCancel={() => setView("list")}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

window.AdminRoot = AdminRoot;
