/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakText, TweakColor, TweakRadio */
const { useState, useEffect, useMemo } = React;

function App() {
  const [tweaks, setTweak] = useTweaks(window.TWEAKS_DEFAULTS);
  const [, forceUpdate] = useState(0);
  const refreshPosts = () => forceUpdate(n => n + 1);

  // Build BLOG_CONFIG from tweaks
  window.BLOG_CONFIG = useMemo(() => ({
    name: tweaks.name,
    initials: tweaks.name.slice(0, 1).toUpperCase(),
    role: tweaks.role,
    bio: tweaks.bio,
    heroLine1: tweaks.heroLine1,
    heroLine2: tweaks.heroLine2,
    years: 3,
  }), [tweaks]);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("blog-theme") || tweaks.defaultTheme || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("blog-theme", theme);
  }, [theme]);

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
    // derive accent-soft via color-mix already in CSS — but override for safety
    const a = tweaks.accent;
    document.documentElement.style.setProperty(
      "--accent-soft",
      theme === "dark"
        ? `color-mix(in srgb, ${a} 18%, transparent)`
        : `color-mix(in srgb, ${a} 10%, white)`
    );
  }, [tweaks.accent, theme]);

  // Apply font theme
  useEffect(() => {
    const root = document.documentElement.style;
    if (tweaks.fontTheme === "sans") {
      root.setProperty("--font-serif", "Inter, sans-serif");
    } else if (tweaks.fontTheme === "mono") {
      root.setProperty("--font-serif", "'JetBrains Mono', monospace");
    } else {
      root.setProperty("--font-serif", "'Source Serif 4', Georgia, serif");
    }
  }, [tweaks.fontTheme]);

  // Apply skin (visual style preset). Skins push their own theme/accent/font,
  // so we lock theme to dark when a skin is active for consistency.
  useEffect(() => {
    document.documentElement.setAttribute("data-skin", tweaks.skin || "htb");
    if (tweaks.skin && tweaks.skin !== "clean") {
      setTheme("dark");
    }
  }, [tweaks.skin]);

  // Routing — use hash so refresh works
  const [route, setRoute] = useState(() => parseHash());

  function parseHash() {
    const h = window.location.hash.slice(1);
    if (!h || h === "/") return { page: "home" };
    const [page, ...rest] = h.split("/").filter(Boolean);
    if (page === "post") return { page: "post", slug: rest.join("/") };
    if (page === "tags") return { page: "tags", filter: rest[0] || null };
    return { page };
  }

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function nav(r) {
    let h = "/" + r.page;
    if (r.page === "post" && r.slug) h += "/" + r.slug;
    if (r.page === "tags" && r.filter) h += "/" + r.filter;
    window.location.hash = h;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  let body;
  if (route.page === "home") body = <window.HomePage onNav={nav}/>;
  else if (route.page === "archive") body = <window.ArchivePage onNav={nav}/>;
  else if (route.page === "tags") body = <window.TagsPage onNav={nav} filter={route.filter}/>;
  else if (route.page === "about") body = <window.AboutPage onNav={nav}/>;
  else if (route.page === "post") body = <window.PostPage slug={route.slug} onNav={nav}/>;
  else body = <window.HomePage onNav={nav}/>;

  return (
    <>
      <window.Header
        route={route}
        onNav={nav}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")}
      />
      <div key={route.page + (route.slug || "") + (route.filter || "")}>
        {body}
      </div>
      <window.Footer/>

      <window.AdminRoot onPostsChange={refreshPosts}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Identity">
          <TweakText label="Name" value={tweaks.name} onChange={v => setTweak('name', v)}/>
          <TweakText label="Role" value={tweaks.role} onChange={v => setTweak('role', v)}/>
          <TweakText label="Bio" value={tweaks.bio} onChange={v => setTweak('bio', v)}/>
        </TweakSection>
        <TweakSection title="Hero">
          <TweakText label="Line 1" value={tweaks.heroLine1} onChange={v => setTweak('heroLine1', v)}/>
          <TweakText label="Line 2 (accented)" value={tweaks.heroLine2} onChange={v => setTweak('heroLine2', v)}/>
        </TweakSection>
        <TweakSection title="Style">
          <TweakRadio label="Skin" value={tweaks.skin || "htb"}
            options={[{value:"htb",label:"HTB"},{value:"bebop",label:"Bebop"},{value:"noir",label:"Noir"}]}
            onChange={v => setTweak('skin', v)}/>
        </TweakSection>
        <TweakSection title="Look">
          <TweakColor label="Accent" value={tweaks.accent} onChange={v => setTweak('accent', v)}/>
          <TweakRadio label="Default theme" value={tweaks.defaultTheme}
            options={[{value:"light",label:"Light"},{value:"dark",label:"Dark"}]}
            onChange={v => { setTweak('defaultTheme', v); setTheme(v); }}/>
          <TweakRadio label="Heading font" value={tweaks.fontTheme}
            options={[{value:"serif",label:"Serif"},{value:"sans",label:"Sans"},{value:"mono",label:"Mono"}]}
            onChange={v => setTweak('fontTheme', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
