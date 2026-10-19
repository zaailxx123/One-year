import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

// ─── data ─────────────────────────────────────────────────────────────────────

const slides = [
  { id: "things",  label: "things we did" },
  { id: "honest",  label: "the honest part" },
  { id: "her",     label: "what makes her her" },
  { id: "snoopy",  label: "snoopy & always" },
];

const things = [
  {
    label: "roblox",
    text: "should i  give up from the vid lmao",
  },
  {
    label: "8ball",
    text: "competitive for no reason. every single time.",
  },
  {
    label: "monopoly",
    text: "I STOLE UR TACTIC AND GOT BETTER IN IT.",
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #f2ece4;
    --surface:      #faf7f3;
    --text:         #1c1714;
    --muted:        #7a6e66;
    --accent:       #8c6a50;
    --accent-light: #e8d9cc;
    --line:         #ddd5ca;
    --white:        #fffcf9;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  /* ── topbar ── */
  .topbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
    z-index: 200;
  }
  .topbar-brand {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1rem;
    color: var(--accent);
  }
  .topbar-nav {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  .topbar-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--line);
    cursor: pointer;
    border: none; padding: 0;
    transition: background 0.2s, transform 0.2s;
  }
  .topbar-dot.active  { background: var(--accent); transform: scale(1.45); }
  .topbar-dot:hover   { background: var(--muted); }

  /* ── slides ── */
  .slides-container {
    position: fixed;
    top: 52px; left: 0; right: 0; bottom: 0;
    overflow: hidden;
  }
  .slide {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    opacity: 0;
    transform: translateX(36px);
    transition: opacity 0.42s ease, transform 0.42s ease;
    pointer-events: none;
  }
  .slide.visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: all;
  }
  .slide.exit-left {
    opacity: 0;
    transform: translateX(-36px);
  }
  .slide-inner {
    max-width: 620px;
    margin: 0 auto;
    padding: 56px 28px 96px;
  }

  /* ── type ── */
  .chapter {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    color: var(--accent);
    margin-bottom: 12px;
    font-weight: 400;
    text-transform: lowercase;
  }
  .slide-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5.5vw, 3.2rem);
    font-weight: 300;
    line-height: 1.15;
    margin-bottom: 36px;
  }
  .slide-title em { font-style: italic; }

  .prose {
    font-size: 0.96rem;
    line-height: 1.88;
    color: var(--muted);
    margin-bottom: 32px;
  }
  .prose p + p { margin-top: 14px; }
  .prose strong { color: var(--text); font-weight: 500; }
  .prose em { font-style: italic; }

  /* ── things grid ── */
  .things-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 32px;
  }
  .thing-card {
    background: var(--white);
    border: 1px solid var(--line);
    padding: 18px 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.2s;
  }
  .thing-card:hover { border-color: var(--accent); }
  .thing-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    color: var(--text);
  }
  .thing-text {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.6;
  }

  /* ── pullquote ── */
  .pullquote {
    border-left: 2px solid var(--accent);
    padding: 8px 0 8px 20px;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.25rem;
    line-height: 1.55;
    color: var(--text);
    margin-bottom: 32px;
  }

  /* ── honest section ── */
  .apology-block {
    background: var(--white);
    border: 1px solid var(--line);
    padding: 28px 24px;
    margin-bottom: 32px;
    position: relative;
  }
  .apology-block p {
    font-size: 0.94rem;
    line-height: 1.85;
    color: var(--muted);
  }
  .apology-block p + p { margin-top: 12px; }
  .apology-block strong { color: var(--text); font-weight: 500; }
  .aside {
    font-size: 0.78rem;
    font-style: italic;
    color: var(--accent);
    margin-top: 16px;
    display: block;
  }

  /* ── traits list ── */
  .traits {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 32px;
  }
  .trait-row {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
  }
  .trait-row:first-child { border-top: 1px solid var(--line); }
  .trait-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.85rem;
    color: var(--accent);
    min-width: 22px;
    font-style: italic;
  }
  .trait-text {
    font-size: 0.92rem;
    color: var(--muted);
    line-height: 1.6;
  }
  .trait-text strong { color: var(--text); font-weight: 500; }

  /* ── snoopy slide ── */
  .snoopy-block {
    background: var(--white);
    border: 1px solid var(--line);
    padding: 36px 28px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
  }
  .snoopy-icon {
    font-size: 2.8rem;
    line-height: 1;
  }
  .snoopy-serif {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 4vw, 2.3rem);
    font-weight: 300;
    line-height: 1.35;
  }
  .snoopy-serif em { font-style: italic; color: var(--accent); }
  .snoopy-rule { width: 32px; height: 1px; background: var(--accent); }
  .snoopy-sign {
    font-size: 0.74rem;
    letter-spacing: 0.12em;
    color: var(--muted);
  }

  /* ── landing ── */
  .landing-wrap {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 620px;
    margin: 0 auto;
    padding: 56px 28px 96px;
    gap: 22px;
  }
  .landing-eyebrow {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    color: var(--accent);
    font-weight: 400;
  }
  .landing-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3.2rem, 9vw, 6rem);
    font-weight: 300;
    line-height: 1.06;
  }
  .landing-title em { font-style: italic; }
  .landing-rule { width: 36px; height: 1px; background: var(--accent); }
  .landing-sub {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.75;
    max-width: 360px;
  }

  /* ── bottom nav ── */
  .bottom-nav {
    position: fixed;
    bottom: 20px; left: 0; right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 28px;
    z-index: 200;
    pointer-events: none;
  }
  .nav-btn {
    pointer-events: all;
    font-size: 0.7rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 9px 20px;
    cursor: pointer;
    border-radius: 2px;
    transition: color 0.15s, border-color 0.15s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-btn:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-1px); }
  .nav-btn.next { background: var(--accent); color: var(--white); border-color: var(--accent); }
  .nav-btn.next:hover { background: var(--text); border-color: var(--text); }
  .nav-btn:disabled { opacity: 0; pointer-events: none; }

  /* ── entry animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .slide.visible .slide-inner > *,
  .slide.visible .landing-wrap > * {
    animation: fadeUp 0.48s ease both;
  }
  .slide.visible .slide-inner > *:nth-child(1),
  .slide.visible .landing-wrap > *:nth-child(1) { animation-delay: 0.04s; }
  .slide.visible .slide-inner > *:nth-child(2),
  .slide.visible .landing-wrap > *:nth-child(2) { animation-delay: 0.10s; }
  .slide.visible .slide-inner > *:nth-child(3),
  .slide.visible .landing-wrap > *:nth-child(3) { animation-delay: 0.16s; }
  .slide.visible .slide-inner > *:nth-child(4),
  .slide.visible .landing-wrap > *:nth-child(4) { animation-delay: 0.22s; }
  .slide.visible .slide-inner > *:nth-child(5),
  .slide.visible .landing-wrap > *:nth-child(5) { animation-delay: 0.28s; }
  .slide.visible .slide-inner > *:nth-child(6),
  .slide.visible .landing-wrap > *:nth-child(6) { animation-delay: 0.34s; }

  @media (prefers-reduced-motion: reduce) {
    .slide, .slide.visible, .slide.exit-left { transition: none; }
    .slide.visible .slide-inner > *,
    .slide.visible .landing-wrap > * { animation: none; }
  }

  @media (max-width: 520px) {
    .topbar { padding: 0 18px; }
    .slide-inner, .landing-wrap { padding: 44px 18px 88px; }
    .bottom-nav { padding: 0 18px; }
    .things-grid { grid-template-columns: 1fr; }
    .snoopy-block { padding: 28px 18px; }
  }
`;

// ─── slide components ─────────────────────────────────────────────────────────

function SlideLanding() {
  return (
    <div className="landing-wrap">
      <p className="landing-eyebrow">for nazo — one year</p>
      <h1 className="landing-title">
        heyy.<br />
        <em>i hope u get<br />the reference.</em>
      </h1>
      <div className="landing-rule" />
      <p className="landing-sub">
        its been a year nazo. like fr time flies fast.
        i made this so you actually feel it.
      </p>
    </div>
  );
}

function Slide1() {
  return (
    <div className="slide-inner">
      <p className="chapter">chapter one</p>
      <h2 className="slide-title">
        the things we did,<br /><em>all of them.</em>
      </h2>
      <div className="prose">
        <p>
          a whole year and i keep coming back to the same things.
          not big moments, just the stuff we actually did together.
          the calls, the games, the random hours that disappeared
          without either of us noticing.
        </p>
        <p>
          <strong>especially the calls.</strong> those more than anything.
        </p>
      </div>
      <div className="things-grid">
        {things.map((t, i) => (
          <div className="thing-card" key={i}>
            <span className="thing-label">{t.label}</span>
            <span className="thing-text">{t.text}</span>
          </div>
        ))}
      </div>
      <div className="pullquote">
        "i really liked anything we did. i really liked them."
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="slide-inner">
      <p className="chapter">chapter two</p>
      <h2 className="slide-title">
        the honest part,<br /><em>no edits.</em>
      </h2>
      <div className="prose">
        <p>
          there's something i want to say and i'm just going to say it
          without making it weird. you were there in my worst.
          not in a "i'll check in once" way  actually there.
          and i really hope one day you get to see me at my best,
          because you deserve to see that.
        </p>
      </div>
      <div className="apology-block">
        <p>
          i fr apologize if i ever said or did something that hurt you.
          i really didn't mean it  <strong>although im sure i did at some point.</strong>
          that's just the honest version of it.
        </p>
        <span className="aside">( im sure i did )yes i'm keeping that part in.</span>
      </div>
      <div className="pullquote">
        "u were there in my worst and thank fr for that."
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="slide-inner">
      <p className="chapter">chapter three</p>
      <h2 className="slide-title">
        never knew anyone<br /><em>like you.</em>
      </h2>
      <div className="prose">
        <p>
          and i mean that literally. not as a thing you say.
          i genuinely have not met someone like you before,
          and i'm pretty sure i won't again.
          that's not nothing. that's actually a lot.
        </p>
      </div>
      <div className="traits">
        {[
          { n: "i.", text: "you're a <strong>wonderful person</strong>. fr. not just to me." },
          { n: "ii.", text: "you stayed through the hard parts without making it a big deal." },
          { n: "iii.", text: "you're funny in a way that doesn't feel like a performance." },
          { n: "iv.", text: "you showed up for calls even on days i probably wasn't easy to talk to." },
          { n: "v.", text: "you never made me feel like i was too much." },
        ].map((t, i) => (
          <div className="trait-row" key={i}>
            <span className="trait-num">{t.n}</span>
            <span className="trait-text" dangerouslySetInnerHTML={{ __html: t.text }} />
          </div>
        ))}
      </div>
      <div className="prose">
        <p>
          i'll never know anyone like you. and i'm keeping you around
          so that sentence stays true for a long time.
        </p>
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="slide-inner">
      <p className="chapter">chapter four</p>
      <h2 className="slide-title">
        snoopy misses you.<br /><em>so do i.</em>
      </h2>
      <div className="prose">
        <p>
          i don't have a big ending prepared. i just know that a year went by
          and you're still the person i want to tell things to first.
          that's rare. i'm not taking that for granted.
        </p>
        <p>
          so  happy one year nazo. i appreciate you more than i probably say.
          and <strong>deadline was my enemy</strong> but i finished this anyway.
          that's how much you mean to me lmao.
        </p>
      </div>
      <div className="snoopy-block">
        <span className="snoopy-icon">🐾</span>
        <p className="snoopy-serif">
        I wish that your future brings you love, joy, and happiness.<br />
        </p>
        <div className="snoopy-rule" />
      </div>
      <div className="prose">
        <p style={{ textAlign: "center", fontSize: "0.85rem" }}>
          ( snoopy misses you lmao. )
        </p>
      </div>
    </div>
  );
}

const slideComponents = [SlideLanding, Slide1, Slide2, Slide3, Slide4];

// ─── app ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState(null);

  const goTo = (index) => {
    if (index === current) return;
    setPrev(current);
    setCurrent(index);
    setTimeout(() => setPrev(null), 500);
  };

  const goNext = () => { if (current < slideComponents.length - 1) goTo(current + 1); };
  const goPrev = () => { if (current > 0) goTo(current - 1); };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  return (
    <>
      <style>{css}</style>

      <div className="topbar">
        <span className="topbar-brand">nazo & sena — yr. 1</span>
        <div className="topbar-nav">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`topbar-dot ${current === i + 1 ? "active" : ""}`}
              onClick={() => goTo(i + 1)}
              aria-label={s.label}
              title={s.label}
            />
          ))}
        </div>
      </div>

      <div className="slides-container">
        {slideComponents.map((SlideComp, i) => (
          <div
            key={i}
            className={[
              "slide",
              current === i ? "visible" : "",
              prev === i    ? "exit-left" : "",
            ].filter(Boolean).join(" ")}
          >
            <SlideComp />
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <button className="nav-btn" onClick={goPrev} disabled={current === 0}>
          ← back
        </button>
        <button className="nav-btn next" onClick={goNext} disabled={current === slideComponents.length - 1}>
          next →
        </button>
      </div>
      <Analytics />
    </>
  );
}
