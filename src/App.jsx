import emailjs from '@emailjs/browser';
import { useState, useEffect } from "react";
import myFace from './assets/myFace.jpeg';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg:         "#0f1f16",
  bgCard:     "#162a1d",
  bgSection:  "#1a3022",
  border:     "#2a4534",
  green:      "#3d7a5e",
  greenLight: "#6aab8a",
  pale:       "#c8ddd4",
  cream:      "#eef4f0",
  accent:     "#c6a96c",
  muted:      "#7a9e8a",
};

// ─── INJECT GLOBAL STYLES ────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  section,
  div,
  main {
    min-width: 0;
  }
  html { scroll-behavior: smooth; overflow-x: hidden; max-width: 100%; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: ${C.bg};
    color: ${C.cream};
    line-height: 1.6;
    font-size: 15px;
    overflow-x: hidden;
  }
  img {
    max-width: 100%;
    display: block;
  }
  ::selection { background: ${C.green}; color: ${C.cream}; }
  :focus-visible { outline: 2px solid ${C.greenLight}; outline-offset: 3px; }

  section[id] {
    scroll-margin-top: 80px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scrollPulse {
    0%, 100% { transform: scaleX(1); opacity: 0.8; }
    50%       { transform: scaleX(0.3); opacity: 0.25; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  .fu0 { animation: fadeUp 0.65s ease both 0.05s; }
  .fu1 { animation: fadeUp 0.65s ease both 0.2s;  }
  .fu2 { animation: fadeUp 0.65s ease both 0.35s; }
  .fu3 { animation: fadeUp 0.65s ease both 0.5s;  }
  .fu4 { animation: fadeUp 0.65s ease both 0.65s; }

  .scroll-line {
    width: 40px; height: 1px; background: ${C.muted};
    display: block;
    animation: scrollPulse 2.4s ease-in-out infinite;
    transform-origin: left;
  }
  .cursor-blink {
    display: inline-block; width: 3px; height: 0.82em;
    background: ${C.accent}; margin-left: 3px;
    vertical-align: middle;
    animation: blink 1s step-end infinite;
  }

  @media (max-width: 860px) {
    .about-grid   { grid-template-columns: 1fr !important; gap: 2rem !important; }
    .contact-grid { grid-template-columns: 1fr !important; }
    .about-sticky { 
    position: static !important; 
    align-items: center !important;
    max-width: 100% !important;
    width: 100% !important;
   }
    .about-img    { max-width: 100% !important; }
    .about-section { overflow: hidden !important; padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
    .proj-tags    { display: none !important; }
    .proj-row     { grid-template-columns: 64px 1fr !important; }
    .hide-mobile  { display: none !important; }
    .step-grid    { grid-template-columns: 1fr 1fr !important; }
    .stack-chips { max-width: 100% !important; overflow: hidden !important; }
  }
  @media (max-width: 560px) {
    .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .step-grid  { grid-template-columns: 1fr !important; }
  }
`;

function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ─── SHARED ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase",
      color: C.greenLight, fontWeight: 500, marginBottom: "1rem",
    }}>
      <span style={{ width: 28, height: 1, background: C.greenLight, flexShrink: 0 }} />
      {children}
    </div>
  );
}

function SectionTitle({ children, style = {} }) {
  return (
    <h2 style={{
      fontFamily: "'Barium', 'Georgia', serif",
      fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)",
      fontWeight: 400, color: C.cream, lineHeight: 1.12,
      marginBottom: "3rem", letterSpacing: "-0.01em",
      ...style,
    }}>
      {children}
    </h2>
  );
}

function BtnPrimary({ children, href = "#", onClick, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: hov ? C.greenLight : C.green,
        color: C.bg, padding: "0.75rem 1.8rem", borderRadius: 4,
        fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em",
        textDecoration: "none", cursor: "pointer",
        transition: "background 0.2s, transform 0.15s",
        transform: hov ? "translateY(-2px)" : "none",
        ...style,
      }}
    >
      {children}
    </a>
  );
}

function BtnOutline({ children, href = "#" }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "transparent", color: hov ? C.cream : C.pale,
        padding: "0.75rem 1.8rem", borderRadius: 4,
        fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em",
        textDecoration: "none", border: `1.5px solid ${hov ? C.pale : C.border}`,
        transition: "all 0.2s", transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      {children}
    </a>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function NavLink({ children, href }) {
  const [hov, setHov] = useState(false);
  return (
    <li>
      <a href={href}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          textDecoration: "none", fontSize: "0.79rem",
          letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500,
          color: hov ? C.cream : C.muted, transition: "color 0.2s",
        }}
      >
        {children}
      </a>
    </li>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "1.1rem clamp(1.5rem, 5vw, 4rem)",
      background: scrolled ? "rgba(15,31,22,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "background 0.35s, border 0.35s",
    }}>
      <a href="#" style={{
        fontFamily: "'Barium', 'Georgia', serif",
        fontSize: "1.4rem", color: C.cream,
        textDecoration: "none", letterSpacing: "0.03em",
      }}>
        Teja<span style={{ color: C.accent }}>.</span>
      </a>
      <ul className="hide-mobile" style={{ display: "flex", gap: "2.2rem", listStyle: "none" }}>
        {["About", "Services", "Work", "Process"].map(l => (
          <NavLink key={l} href={`#${l.toLowerCase()}`}>{l}</NavLink>
        ))}
      </ul>
      <BtnPrimary href="#contact">Hire me</BtnPrimary>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

const TYPED_WORDS = ["landing pages.", "React interfaces.", "web experiences.", "purposeful UIs."];

function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = TYPED_WORDS[wordIdx];
    let t;
    if (typing) {
      if (displayed.length < target.length) {
        t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
      } else {
        t = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
      } else {
        setWordIdx((wordIdx + 1) % TYPED_WORDS.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, typing, wordIdx]);

  return (
    <section id="hero" style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "8rem clamp(1.5rem, 5vw, 4rem) 5rem",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", right: -120, top: "42%", transform: "translateY(-50%)",
        width: 560, height: 560, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${C.green}1e 0%, transparent 68%)`,
      }} />
      <div style={{
        position: "absolute", left: -100, bottom: "12%",
        width: 360, height: 360, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${C.accent}12 0%, transparent 70%)`,
      }} />

      <span className="fu0" style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        fontSize: "0.74rem", letterSpacing: "0.17em", textTransform: "uppercase",
        color: C.greenLight, fontWeight: 500, marginBottom: "1.6rem",
      }}>
        <span style={{ width: 30, height: 1, background: C.greenLight }} />
        Web Developer · Surabaya, Indonesia
      </span>

      <h1 className="fu1" style={{
        fontFamily: "'Barium', 'Georgia', serif",
        fontSize: "clamp(3rem, 7vw, 6.2rem)",
        lineHeight: 1.05, fontWeight: 400, color: C.cream,
        marginBottom: "1rem", letterSpacing: "-0.01em", maxWidth: 780,
      }}>
        I craft clean<br />
        <span style={{ color: C.accent }}>
          {displayed}
          <span className="cursor-blink" />
        </span>
      </h1>

      <p className="fu2" style={{
        fontSize: "1rem", color: C.pale, maxWidth: 430,
        lineHeight: 1.82, marginBottom: "2.6rem",
      }}>
        Fully hand-coded pages in HTML, CSS &amp; React. Built for speed,
        designed to impress, structured to turn visitors into customers.
      </p>

      <div className="fu3" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <BtnPrimary href="#work">See my work →</BtnPrimary>
        <BtnOutline href="#contact">Let's talk</BtnOutline>
      </div>

      <div className="fu4" style={{
        position: "absolute", bottom: "2.5rem",
        left: "clamp(1.5rem, 5vw, 4rem)",
        display: "flex", alignItems: "center", gap: 10,
        fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase",
        color: C.muted,
      }}>
        <span className="scroll-line" />
        Scroll to explore
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About() {
  const stack = ["HTML5", "CSS3", "JavaScript", "React", "Responsive", "Figma", "Git", "Vite", "EmailJS", "TailwindCSS"];
  return (
    <section id="about" className="about-section" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", background: C.bgSection }}>
      <SectionLabel>About me</SectionLabel>
      <div className="about-grid" style={{
        display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.45fr)",
        gap: "5rem", alignItems: "start",
      }}>
        <div
          className="about-sticky"
          style={{
            minWidth: 0,
            position: "sticky",
            top: "12rem",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{
            width: "100%", maxWidth: "260px", minWidth: 0, aspectRatio: "3/4",
            background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 8, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 8, marginBottom: "1.6rem", position: "relative", overflow: "hidden",
          }}>
            <img
              src={myFace}
              alt="Christian Teja"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span style={{
              position: "absolute", bottom: 12, right: 12,
              background: C.greenLight, color: C.bg,
              fontSize: "0.67rem", letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "4px 10px", borderRadius: 3, fontWeight: 700,
            }}>Available</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, width: "100%", boxSizing: "border-box" }}>
            {stack.map(s => (
              <span key={s} style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
                color: C.greenLight, background: `${C.green}22`,
                border: `1px solid ${C.border}`, padding: "4px 10px",
                borderRadius: 3, letterSpacing: "0.04em",
              }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <SectionTitle>Building web experiences with intention.</SectionTitle>
          <p key={0} style={{ color: C.pale, lineHeight: 1.85, marginBottom: "1.3rem", fontSize: "0.97rem" }}>
            Hi — I'm <strong style={{ color: C.cream }}>Christian <strong style={{ color: C.accent }}>Teja</strong> Pranata</strong>, a web developer based in Surabaya, Indonesia. I build landing pages for small businesses and founders who need more than something that looks decent — they need a page that gets people to act.
          </p>
          <p key={1} style={{ color: C.pale, lineHeight: 1.85, marginBottom: "1.3rem", fontSize: "0.97rem" }}>
            Every project is hand-coded from scratch using HTML, CSS, and React. No builders, no templates — just lean, fast code built around one goal: turning visitors into inquiries.
          </p>

          <div className="stats-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1, background: C.border,
            border: `1px solid ${C.border}`, borderRadius: 6,
            overflow: "hidden", marginTop: "2.5rem",
          }}>
            {[["5+", "Projects completed"], ["100%", "Hand-coded output"], ["3", "Core technologies"]].map(([num, label]) => (
              <div key={label} style={{
                background: C.bgCard, padding: "1.4rem 1.2rem",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <span style={{ fontFamily: "'Barium', serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: C.accent, lineHeight: 1 }}>{num}</span>
                <span style={{ fontSize: "0.78rem", color: C.muted, letterSpacing: "0.04em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    title: "Landing Page Design & Build",
    desc: "Fully hand-coded landing pages that communicate your value clearly and look great on every device.",
    tag: "HTML · CSS · React",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20}>
        <rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Responsive & Mobile-First",
    desc: "Every page is built to look pixel-perfect on phones, tablets, and desktops — no compromises.",
    tag: "Responsive · Fluid Layout",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20}>
        <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    title: "Performance Optimized",
    desc: "Clean minimal code with zero bloat — fast load times and better search engine rankings.",
    tag: "Fast · SEO-Friendly",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Custom React Components",
    desc: "Bespoke interactive elements — animated heroes, smooth modals, carousels, and contact forms.",
    tag: "React · Hooks · State",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20}>
        <circle cx="12" cy="12" r="2" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    title: "Conversion-Focused Layout",
    desc: "Structure and hierarchy designed to guide visitors toward your call-to-action naturally.",
    tag: "CRO · UX-Informed",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20}>
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Ongoing Support & Revisions",
    desc: "Flexible revision rounds included. I stay available post-delivery to make sure everything is right.",
    tag: "Revisions · Support",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20}>
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

function ServiceCard({ title, desc, tag, Icon }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.bgSection : C.bgCard,
        border: `1px solid ${hov ? C.green : C.border}`,
        borderRadius: 8, padding: "2rem 1.8rem",
        transition: "all 0.22s",
        transform: hov ? "translateY(-4px)" : "none",
        cursor: "default",
      }}
    >
      <div style={{
        width: 42, height: 42, background: `${C.green}25`,
        borderRadius: 6, marginBottom: "1.4rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.greenLight,
      }}>
        <Icon />
      </div>
      <h3 style={{ fontSize: "0.97rem", fontWeight: 500, color: C.cream, marginBottom: "0.6rem" }}>{title}</h3>
      <p style={{ fontSize: "0.86rem", color: C.pale, lineHeight: 1.75 }}>{desc}</p>
      <span style={{
        display: "inline-block", marginTop: "1.3rem",
        fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
        color: C.muted, letterSpacing: "0.07em",
      }}>{tag}</span>
    </div>
  );
}

function Services() {
  return (
    <section id="services" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", background: C.bg }}>
      <SectionLabel>What I offer</SectionLabel>
      <SectionTitle>Services built for real results.</SectionTitle>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1.3rem",
      }}>
        {SERVICES.map(s => <ServiceCard key={s.title} {...s} />)}
      </div>
    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

const PROJECTS = [
{ num: "001", title: "Brunsj — Bake House Surabaya", link:"https://brunsj-site.vercel.app", desc: "Warm and inviting storefront page for a local Surabaya bakery, featuring the menu, daily specials, and brand story.", tags: ["React", "CSS Animations"] },
{ num: "002", title: "Klea — Model Portfolio", link:"https://porto-klea.vercel.app", desc: "Sleek editorial portfolio for a model and muse, with full-bleed imagery, a lookbook grid, and minimal typography.", tags: ["HTML", "CSS", "JS"] },
{ num: "003", title: "UT Admin — Lecturer Dashboard", link:"", desc: "Clean and functional admin panel for Universitas Terbuka lecturers, with course management, student data, and activity controls.", tags: ["React", "Dashboard", "Responsive"] },
];

function ProjectRow({ num, title, desc, tags, link }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="proj-row"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "72px 1fr auto", textAlign: "left",
        alignItems: "center", gap: "2rem",
        padding: "1.8rem 0", borderTop: `1px solid ${C.border}`, cursor: "default",
      }}
    >
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: "0.71rem",
        color: hov ? C.accent : `${C.muted}66`,
        letterSpacing: "0.06em", transition: "color 0.2s",
      }}>{num}</span>
      <div>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{
            fontSize: "1rem", fontWeight: 500,
            color: hov ? C.cream : C.pale,
            marginBottom: "0.25rem", transition: "color 0.2s",
            textAlign: "left", textDecoration: "none", display: "block",
          }}>{title} ↗</a>
        ) : (
          <p style={{
            fontSize: "1rem", fontWeight: 500,
            color: hov ? C.cream : C.pale,
            marginBottom: "0.25rem", transition: "color 0.2s",
          }}>{title}</p>
        )}
        <p style={{ fontSize: "0.82rem", color: C.muted }}>{desc}</p>
      </div>
      <div className="proj-tags" style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {tags.map(t => (
          <span key={t} style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.67rem",
            color: C.pale, letterSpacing: "0.05em",
            background: `${C.green}20`, padding: "3px 9px", borderRadius: 3,
            border: `1px solid ${C.border}`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="work" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", background: C.bgSection }}>
      <SectionLabel>Selected work</SectionLabel>
      <SectionTitle>Recent projects.</SectionTitle>
      <div>
        {PROJECTS.map(p => <ProjectRow key={p.num} {...p} />)}
        <div style={{ borderTop: `1px solid ${C.border}` }} />
      </div>
    </section>
  );
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────

const STEPS = [
  { title: "Discovery",      body: "We start with a brief chat to understand your business, goals, and what you need from the page." },
  { title: "Build & Refine", body: "I code the page and share a live preview. You give feedback, I refine — until it feels exactly right." },
  { title: "Delivery",       body: "You receive clean, organized source files ready to deploy, with handoff documentation included." },
];

function Process() {
  return (
    <section id="process" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", background: C.bg, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SectionLabel>How I work</SectionLabel>
      </div>
      <SectionTitle>A simple, clear process.</SectionTitle>
      <div className="step-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem", maxWidth: 720, margin: "0 auto" }}>
        {STEPS.map((s, i) => (
          <div key={s.title} style={{ paddingTop: "2.5rem", position: "relative", textAlign: "center" }}>
            <span style={{
              display: "block", marginBottom: "1.2rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
              color: C.greenLight, letterSpacing: "0.08em", textAlign: "center",
            }}>{`0${i + 1}`}</span>
            <div style={{ width: "100%", height: 1, background: C.border, marginBottom: "1.5rem", position: "relative" }}>
              <span style={{
                position: "absolute", left: "50%", transform: "translateX(-50%)", top: -3,
                width: 7, height: 7, borderRadius: "50%",
                background: C.greenLight, display: "block",
              }} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 500, color: C.cream, marginBottom: "0.5rem" }}>{s.title}</h3>
            <p style={{ fontSize: "0.84rem", color: C.pale, lineHeight: 1.75 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    emailjs.send(
      'service_ujet3qw',
      'template_z7ohboc',
      {
        name:  form.name,
        email: form.email,
        message:    form.message,
      },
      'zgOoGWq3XjT0aKHtv'
    )
    .then(() => setSent(true))
    .catch(() => alert('Something went wrong. Please try again.'));
  };

  const inputStyle = {
    background: C.bgCard, border: `1px solid ${C.border}`,
    borderRadius: 4, padding: "0.75rem 1rem",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem",
    color: C.cream, outline: "none", resize: "none",
    width: "100%", transition: "border-color 0.2s",
  };

  const LINKS = [
    { label: "xtian120907@gmail.com", href: "mailto:xtian120907@gmail.com" },
    { label: "threads.com/@chrs.tjp", href: "https://www.threads.com/@chrs.tjp" },
    { label: "github.com/kaidennxyz", href: "https://github.com/kaidennxyz" },
    { label: "+62 813-3534-5484",     href: "https://wa.me/6281335345484" },
  ];

  return (
    <section id="contact" style={{ padding: "7rem clamp(1.5rem, 5vw, 4rem)", background: C.bgSection }}>
      <div className="contact-grid" style={{
        display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)",
        gap: "5rem", alignItems: "start",
      }}>
        <div>
          <SectionLabel>Get in touch</SectionLabel>
          <h2 style={{
            fontFamily: "'Barium', 'Georgia', serif",
            fontSize: "clamp(2.6rem, 8vw, 3.2rem)",
            fontWeight: 400, color: C.cream,
            lineHeight: 1.1, marginBottom: "1.2rem", letterSpacing: "-0.01em",
          }}>
            Let's build something together.
          </h2>
          <p style={{ color: C.pale, lineHeight: 1.78, marginBottom: "2rem", fontSize: "0.96rem" }}>
            Have a project in mind or just want to say hi? Fill in the form or reach me directly through any of the channels below.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.88rem", color: C.pale, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
                onMouseLeave={e => (e.currentTarget.style.color = C.pale)}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.greenLight, flexShrink: 0 }} />
                {label}
              </a>
            ))}
          </div>
        </div>

        {sent ? (
          <div style={{
            background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "3rem 2rem",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "1rem", textAlign: "center",
          }}>
            <span style={{ fontSize: "2.5rem", color: C.greenLight }}>✓</span>
            <h3 style={{ color: C.cream, fontSize: "1.1rem", fontWeight: 500 }}>Message sent!</h3>
            <p style={{ color: C.pale, fontSize: "0.9rem" }}>
              Thanks for reaching out — I'll get back to you within 1–2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {[
              { label: "Your name",     name: "name",  type: "text",  placeholder: "Your Name..." },
              { label: "Email address", name: "email", type: "email", placeholder: "youremail@example.com" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "0.74rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, fontWeight: 500 }}>
                  {label}
                </label>
                <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = C.greenLight)}
                  onBlur={e => (e.target.style.borderColor = C.border)}
                />
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: "0.74rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, fontWeight: 500 }}>
                Tell me about your project
              </label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="I need a landing page for my new product launch..."
                rows={5} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = C.greenLight)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
            </div>
            <BtnPrimary onClick={handleSubmit} style={{ alignSelf: "flex-start" }}>Send message →</BtnPrimary>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{
      background: "#0a1510",
      color: `${C.muted}99`,
      padding: "2rem clamp(1.5rem, 5vw, 4rem)",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem",
      fontSize: "0.78rem", letterSpacing: "0.05em",
      borderTop: `1px solid ${C.border}`,
    }}>
      <span style={{ fontFamily: "'Barium', serif", fontSize: "1.1rem", color: `${C.pale}88` }}>
        Teja<span style={{ color: `${C.accent}88` }}>.</span>
      </span>
      <span>© 2026 Christian Teja · Hand-crafted with HTML, CSS &amp; React</span>
      <span>Surabaya, Indonesia</span>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
