// ==========================================================
// 貼文資料 - 在這個檔案新增/編輯你的文章
// ==========================================================
//
// 怎麼新增一篇貼文?
// 在下面的 POSTS 陣列裡，複製一個物件貼到最上面 (最新的在前面)
// 然後修改裡面的欄位:
//
//   slug:     網址用的英文識別 (例如 "my-first-post" → /#/post/my-first-post)
//   title:    文章標題
//   date:     發佈日期 "YYYY-MM-DD"
//   excerpt:  首頁顯示的摘要 (1-3 句)
//   tags:     標籤陣列，例如 ["pwn", "writeup"]
//   readTime: 預估閱讀時間 (分鐘)
//   body:     文章內文，用陣列表示，每個元素是一個段落:
//             { type: "p",    text: "一般段落文字" }
//             { type: "h2",   text: "二級標題" }
//             { type: "code", lang: "python", text: "程式碼..." }
//
// ==========================================================

const POSTS = [
  {
    slug: "hello-world",
    title: "Hello, world — 關於這個部落格",
    date: "2026-05-03",
    excerpt: "嗨，我是 limbokid。這裡是我學習資安路上的筆記本 — 從 CTF、HackTheBox、各種課程到自己研究的東西，都會記錄在這裡。",
    tags: ["about", "intro"],
    readTime: 2,
    body: [
      { type: "p", text: "嗨，我是 limbokid。這裡是我學習資安路上的筆記本。" },
      { type: "h2", text: "為什麼開這個部落格" },
      { type: "p", text: "寫部落格對我來說有兩個目的:第一,把學到的東西寫下來,是最有效的學習方式 — 你必須真的搞懂才寫得出來。第二,未來的我一定會忘記今天剛學會的東西,留個紀錄方便之後查。" },
      { type: "h2", text: "會寫些什麼" },
      { type: "p", text: "主要是 CTF 解題紀錄、HackTheBox 機器筆記、上課的整理,還有偶爾深入研究某個主題的長文。內容會圍繞在 binary exploitation、web security、reverse engineering 這些方向。" },
      { type: "h2", text: "聯絡我" },
      { type: "p", text: "如果你看到內容有錯,或想討論題目,歡迎透過頁尾的連結找我。" },
    ],
  },
];

// 標籤統計
const TAG_COUNTS = (() => {
  const counts = {};
  POSTS.forEach(p => p.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  return counts;
})();

const ALL_TAGS = Object.entries(TAG_COUNTS)
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({ name, count }));

// 依年份分組 (給 Archive 頁用)
const POSTS_BY_YEAR = (() => {
  const groups = {};
  POSTS.forEach(p => {
    const year = p.date.slice(0, 4);
    if (!groups[year]) groups[year] = [];
    groups[year].push(p);
  });
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
})();

// 保留原始預設值,讓 admin 可以「還原預設」
window.__INITIAL_POSTS__ = JSON.parse(JSON.stringify(POSTS));

Object.assign(window, { POSTS, ALL_TAGS, TAG_COUNTS, POSTS_BY_YEAR });
