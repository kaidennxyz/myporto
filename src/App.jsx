import emailjs from '@emailjs/browser';
import { useState, useEffect, useRef } from "react";
import myFace from './assets/myFace.jpeg';

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── SHARED ──────────────────────────────────────────────────────────────────

function SectionLabel({ num, children }) {
  return (
    <div className="label" data-reveal>
      <b>{num}</b>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="title" data-reveal>{children}</h2>;
}

// Fades elements marked with [data-reveal] in as they scroll into view.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Services", "Work", "Process"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = e => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 860 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`} aria-label="Main">
        <a href="#" className="brand" onClick={close}>Teja<i>.</i></a>
        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <a href="#contact" className="btn btn--primary" onClick={close}>Hire me</a>
          <button
            type="button" className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open} aria-controls="menu"
            onClick={() => setOpen(o => !o)}
          >
            <span /><span />
          </button>
        </div>
      </nav>

      <div id="menu" className={`menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        <ul>
          {[...NAV_LINKS, "Contact"].map((l, i) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} onClick={close} tabIndex={open ? 0 : -1}>
                <small>{`0${i + 1}`}</small>{l}
              </a>
            </li>
          ))}
        </ul>
        <p>Web Developer · Surabaya, Indonesia</p>
      </div>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

const TYPED_WORDS = ["landing pages.", "React interfaces.", "web experiences.", "purposeful UIs."];

function Typed() {
  const [reduced] = useState(prefersReducedMotion);
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const target = TYPED_WORDS[wordIdx];
    let t;
    if (typing) {
      if (displayed.length < target.length) {
        t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
      } else {
        t = setTimeout(() => setTyping(false), 2000);
      }
    } else if (displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    } else {
      t = setTimeout(() => {
        setWordIdx((wordIdx + 1) % TYPED_WORDS.length);
        setTyping(true);
      }, 250);
    }
    return () => clearTimeout(t);
  }, [displayed, typing, wordIdx, reduced]);

  if (reduced) return TYPED_WORDS[2];
  return <>{displayed}<span className="caret" /></>;
}

function Hero() {
  const heroRef = useRef(null);
  const glowRef = useRef(null);

  // Soft light that trails the cursor — desktop pointers only, one write per frame.
  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    let raf = 0;
    const move = e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = hero.getBoundingClientRect();
        glow.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
      });
    };
    hero.addEventListener("pointermove", move, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-glow" ref={glowRef} aria-hidden="true" />
      <svg className="hero-rings" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="0.5" aria-hidden="true">
        {[190, 164, 138, 112, 86, 60, 34].map((r, i) => (
          <ellipse key={r} cx="200" cy="200" rx={r} ry={r * (0.78 + (i % 3) * 0.07)} transform={`rotate(${i * 24} 200 200)`} />
        ))}
      </svg>

      <div className="hero-inner">
        <span className="label fu">Web Developer · Surabaya, Indonesia</span>

        <h1 className="hero-title fu" style={{ "--d": "0.12s" }} aria-label="I craft clean web experiences.">
          <span aria-hidden="true">I craft clean</span>
          <span className="hero-typed" aria-hidden="true"><Typed /></span>
        </h1>

        <p className="hero-lead fu" style={{ "--d": "0.26s" }}>
          Fully hand-coded pages in HTML, CSS &amp; React. Built for speed,
          designed to impress, structured to turn visitors into customers.
        </p>

        <div className="hero-actions fu" style={{ "--d": "0.4s" }}>
          <a href="#work" className="btn btn--primary">See my work <span>→</span></a>
          <a href="#contact" className="btn btn--outline">Let's talk</a>
        </div>
      </div>

      <a href="#about" className="badge fu" style={{ "--d": "0.6s" }} aria-label="Scroll to about section">
        <svg viewBox="0 0 136 136" aria-hidden="true">
          <defs>
            <path id="badge-circle" d="M68 68 m-56 0 a56 56 0 1 1 112 0 a56 56 0 1 1 -112 0" />
          </defs>
          <text>
            <textPath href="#badge-circle">Available for freelance ✦ Scroll to explore ✦</textPath>
          </text>
        </svg>
        <span aria-hidden="true">↓</span>
      </a>

      <ul className="hero-meta fu" style={{ "--d": "0.55s" }}>
        <li><small>Based in</small><strong>Surabaya, Indonesia</strong></li>
        <li><small>Studying at</small><strong>ISTTS</strong></li>
        <li><small>Status</small><strong>Open for freelance</strong></li>
      </ul>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────

const MARQUEE = ["Landing pages", "React interfaces", "Responsive layouts", "Hand-coded", "Fast by default", "Conversion-focused"];

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About() {
  const stack = ["HTML5", "CSS3", "JavaScript", "React", "Responsive", "Figma", "Git", "Vite", "EmailJS", "TailwindCSS"];
  return (
    <section id="about" className="section section--deep">
      <div className="wrap">
        <SectionLabel num="01">About me</SectionLabel>
        <div className="about-grid">
          <div className="about-side" data-reveal>
            <div className="portrait">
              <div className="portrait-frame">
                <img src={myFace} alt="Christian Teja" loading="lazy" decoding="async" />
              </div>
              <span className="available">Available</span>
            </div>
            <div className="stack">
              {stack.map(s => <span key={s} className="chip">{s}</span>)}
            </div>
          </div>

          <div className="about-body">
            <SectionTitle>Building web experiences with <em>intention.</em></SectionTitle>
            <p data-reveal>
              Hi — I'm <strong>Christian <b>Teja</b> Pranata</strong>, a web developer based in Surabaya, Indonesia. I build landing pages for small businesses and founders who need more than something that looks decent — they need a page that gets people to act.
            </p>
            <p data-reveal>
              I'm currently a college student at <strong>Institut Sains dan Teknologi Terapan Surabaya</strong>, sharpening my craft in the classroom while building real projects for real clients outside of it.
            </p>
            <p data-reveal>
              Every project is hand-coded from scratch using HTML, CSS, and React. No builders, no templates — just lean, fast code built around one goal: turning visitors into inquiries.
            </p>

            <div className="edu" data-reveal>
              <span className="edu-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
                  <path d="M2 9l10-5 10 5-10 5L2 9z" /><path d="M6 11.5V16c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4.5M22 9v6" />
                </svg>
              </span>
              <div>
                <small>Education · Currently enrolled</small>
                <h3>Institut Sains dan Teknologi Terapan Surabaya</h3>
                <span>ISTTS · College student · Surabaya, Indonesia</span>
              </div>
            </div>

            <div className="stats" data-reveal>
              {[["5+", "Projects completed"], ["100%", "Hand-coded output"], ["3", "Core technologies"]].map(([num, label]) => (
                <div key={label}>
                  <strong>{num}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={24} height={24}>
        <rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    title: "Responsive & Mobile-First",
    desc: "Every page is built to look pixel-perfect on phones, tablets, and desktops — no compromises.",
    tag: "Responsive · Fluid Layout",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={24} height={24}>
        <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    title: "Performance Optimized",
    desc: "Clean minimal code with zero bloat — fast load times and better search engine rankings.",
    tag: "Fast · SEO-Friendly",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={24} height={24}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Custom React Components",
    desc: "Bespoke interactive elements — animated heroes, smooth modals, carousels, and contact forms.",
    tag: "React · Hooks · State",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={24} height={24}>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={24} height={24}>
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Ongoing Support & Revisions",
    desc: "Flexible revision rounds included. I stay available post-delivery to make sure everything is right.",
    tag: "Revisions · Support",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={24} height={24}>
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

function Services() {
  return (
    <section id="services" className="section">
      <div className="wrap">
        <SectionLabel num="02">What I offer</SectionLabel>
        <SectionTitle>Services built for <em>real results.</em></SectionTitle>
        <div className="services" data-reveal>
          {SERVICES.map((s, i) => (
            <article key={s.title} className="service">
              <div className="service-top">
                <s.Icon />
                <span>{`0${i + 1}`}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <small>{s.tag}</small>
            </article>
          ))}
        </div>
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
  const Row = link ? "a" : "div";
  const linkProps = link ? { href: link, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Row className="work-row" data-reveal {...linkProps}>
      <span className="work-num">{num}</span>
      <div className="work-body">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="work-tags">
        {tags.map(t => <span key={t} className="chip">{t}</span>)}
      </div>
      {link
        ? <span className="work-arrow" aria-hidden="true">↗</span>
        : <span className="work-arrow work-arrow--private" title="Private project — no public link">Private</span>}
    </Row>
  );
}

function Projects() {
  return (
    <section id="work" className="section section--deep">
      <div className="wrap">
        <SectionLabel num="03">Selected work</SectionLabel>
        <SectionTitle>Recent <em>projects.</em></SectionTitle>
        <div className="work">
          {PROJECTS.map(p => <ProjectRow key={p.num} {...p} />)}
        </div>
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
    <section id="process" className="section">
      <div className="wrap">
        <SectionLabel num="04">How I work</SectionLabel>
        <SectionTitle>A simple, <em>clear</em> process.</SectionTitle>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step" data-reveal style={{ "--d": `${i * 0.12}s` }}>
              <span className="step-num" aria-hidden="true">{`0${i + 1}`}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

const LINKS = [
  { kind: "Email",    label: "xtian120907@gmail.com", href: "mailto:xtian120907@gmail.com" },
  { kind: "Threads",  label: "@chrs.tjp",             href: "https://www.threads.com/@chrs.tjp" },
  { kind: "GitHub",   label: "kaidennxyz",            href: "https://github.com/kaidennxyz" },
  { kind: "WhatsApp", label: "+62 813-3534-5484",     href: "https://wa.me/6281335345484" },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || status === "sending") return;

    setStatus("sending");
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
    .then(() => setStatus("sent"))
    .catch(() => setStatus("error"));
  };

  return (
    <section id="contact" className="section section--deep">
      <div className="wrap">
        <div className="contact" data-reveal>
          <div>
            <div className="label">Get in touch</div>
            <h2 className="title">Let's build something <em>together.</em></h2>
            <p className="contact-lead">
              Have a project in mind or just want to say hi? Fill in the form or reach me directly through any of the channels below.
            </p>
            <ul className="contact-links">
              {LINKS.map(({ kind, label, href }) => (
                <li key={kind}>
                  <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <small>{kind}</small>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {status === "sent" ? (
            <div className="sent" role="status">
              <span className="sent-mark" aria-hidden="true">✓</span>
              <h3>Message sent!</h3>
              <p>Thanks for reaching out — I'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit}>
              {[
                { label: "Your name",     name: "name",  type: "text",  placeholder: "Your Name...",          autoComplete: "name" },
                { label: "Email address", name: "email", type: "email", placeholder: "youremail@example.com", autoComplete: "email" },
              ].map(({ label, name, ...rest }) => (
                <div key={name} className="field">
                  <label htmlFor={`f-${name}`}>{label}</label>
                  <input id={`f-${name}`} name={name} value={form[name]} onChange={handleChange} required {...rest} />
                </div>
              ))}
              <div className="field">
                <label htmlFor="f-message">Tell me about your project</label>
                <textarea id="f-message" name="message" value={form.message} onChange={handleChange}
                  placeholder="I need a landing page for my new product launch..."
                  rows={4} required
                />
              </div>
              {status === "error" && (
                <p className="form-error" role="alert">Something went wrong. Please try again.</p>
              )}
              <button type="submit" className="btn btn--ink" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : <>Send message <span>→</span></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-word" aria-hidden="true">Teja.</div>
      <div className="footer-row">
        <span>© {new Date().getFullYear()} Christian Teja · Hand-crafted with HTML, CSS &amp; React</span>
        <span>Surabaya, Indonesia</span>
        <a href="#">Back to top ↑</a>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  useReveal();
  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <div className="progress" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
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
