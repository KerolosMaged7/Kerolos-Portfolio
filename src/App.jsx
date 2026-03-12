import { useEffect, useRef, useState } from 'react'
import profileImg from './assets/profile.jpeg'
import './App.css'

// ─── Custom Cursor ──────────────────────────────────────────────────────────
function Cursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    let x = 0, y = 0, fx = 0, fy = 0
    const move = (e) => {
      x = e.clientX; y = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = x + 'px'
        cursorRef.current.style.top = y + 'px'
      }
    }
    const follow = () => {
      fx += (x - fx) * 0.12
      fy += (y - fy) * 0.12
      if (followerRef.current) {
        followerRef.current.style.left = fx + 'px'
        followerRef.current.style.top = fy + 'px'
      }
      requestAnimationFrame(follow)
    }
    const onHover = () => cursorRef.current?.classList.add('hover')
    const onLeave = () => cursorRef.current?.classList.remove('hover')
    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, .hoverable').forEach(el => {
      el.addEventListener('mouseenter', onHover)
      el.addEventListener('mouseleave', onLeave)
    })
    follow()
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-follower" ref={followerRef} />
    </>
  )
}

// ─── Particles Background ────────────────────────────────────────────────────
function ParticlesCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`
        ctx.fill()
      })
      // connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(26,108,247,${0.15 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="particles-canvas" />
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <span className="logo-bracket">&lt;</span>
        KM
        <span className="logo-bracket">/&gt;</span>
      </div>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map(l => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
              <span className="nav-num">0{links.indexOf(l) + 1}.</span> {l}
            </a>
          </li>
        ))}
      </ul>
      <button className="nav-resume hoverable" onClick={() => window.open('mailto:kerolosmaged003@gmail.com')}>
        Hire Me
      </button>
      <button className="hamburger hoverable" onClick={() => setMenuOpen(!menuOpen)}>
        <span/><span/><span/>
      </button>
    </nav>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  const [typed, setTyped] = useState('')
  const roles = ['Frontend Developer', 'React.js Specialist', 'UI Craftsman', 'Web Architect']
  const roleRef = useRef(0)
  const charRef = useRef(0)
  const deletingRef = useRef(false)

  useEffect(() => {
    let timeout
    const type = () => {
      const role = roles[roleRef.current]
      if (!deletingRef.current) {
        setTyped(role.slice(0, charRef.current + 1))
        charRef.current++
        if (charRef.current === role.length) {
          deletingRef.current = true
          timeout = setTimeout(type, 1800)
          return
        }
      } else {
        setTyped(role.slice(0, charRef.current - 1))
        charRef.current--
        if (charRef.current === 0) {
          deletingRef.current = false
          roleRef.current = (roleRef.current + 1) % roles.length
        }
      }
      timeout = setTimeout(type, deletingRef.current ? 60 : 90)
    }
    timeout = setTimeout(type, 800)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="hero" id="about">
      <ParticlesCanvas />
      <div className="hero-grid-bg" />

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-tag animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <span className="tag-dot" />
            Available for work
          </div>
          <h1 className="hero-name animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            Kerolos<br/>
            <span className="name-outline">Maged</span>
          </h1>
          <div className="hero-role animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <span className="mono">&gt; </span>
            <span className="typed-text">{typed}</span>
            <span className="cursor-blink">|</span>
          </div>
          <p className="hero-desc animate-fade-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
            Building responsive, user-friendly web experiences with modern React.js
            and a passion for clean, performant code. Based in Egypt.
          </p>
          <div className="hero-actions animate-fade-up" style={{ animationDelay: '0.9s', opacity: 0 }}>
            <a href="#projects" className="btn-primary hoverable">
              <span>View My Work</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#contact" className="btn-ghost hoverable">Get In Touch</a>
          </div>
          <div className="hero-socials animate-fade-up" style={{ animationDelay: '1.1s', opacity: 0 }}>
            <a href="https://github.com/KerolosMaged7" target="_blank" rel="noreferrer" className="social-link hoverable">
              <GithubIcon />
            </a>
            <a href="https://www.linkedin.com/in/kerolos-maged-173a14310" target="_blank" rel="noreferrer" className="social-link hoverable">
              <LinkedinIcon />
            </a>
            <a href="mailto:kerolosmaged003@gmail.com" className="social-link hoverable">
              <MailIcon />
            </a>
          </div>
        </div>

        <div className="hero-right animate-fade-right" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <div className="profile-container">
            <div className="profile-ring ring-1" />
            <div className="profile-ring ring-2" />
            <div className="profile-ring ring-3" />
            <div className="profile-glow" />
            <img src={profileImg} alt="Kerolos Maged" className="profile-img" />
            <div className="orbit-dot dot-1" />
            <div className="orbit-dot dot-2" />
            <div className="orbit-label react-label">React.js</div>
            <div className="orbit-label ts-label">TypeScript</div>
            <div className="stat-bubble stat-1">
              <span className="stat-num">1+</span>
              <span className="stat-text">Years</span>
            </div>
            <div className="stat-bubble stat-2">
              <span className="stat-num">10+</span>
              <span className="stat-text">Projects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}

// ─── Skills Section ──────────────────────────────────────────────────────────
function Skills() {
  const skills = [
    { name: 'React.js', level: 90, icon: '⚛' },
    { name: 'JavaScript', level: 88, icon: 'JS' },
    { name: 'TypeScript', level: 75, icon: 'TS' },
    { name: 'HTML5 / CSS3', level: 95, icon: '</>' },
    { name: 'Tailwind CSS', level: 82, icon: '🎨' },
    { name: 'Bootstrap', level: 85, icon: 'B' },
    { name: 'Git / GitHub', level: 80, icon: '⎇' },
    { name: 'SQL / MySQL', level: 65, icon: '🗄' },
    { name: 'Zustand', level: 70, icon: 'Z' },
    { name: 'TanStack Query', level: 68, icon: 'TQ' },
  ]

  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="skills-section" id="skills" ref={ref}>
      <div className="section-bg-accent" />
      <div className="container">
        <SectionHeader num="02" title="Skills & Technologies" sub="What I work with" />
        <div className="skills-grid">
          {skills.map((s, i) => (
            <div key={s.name} className={`skill-card hoverable ${visible ? 'visible' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="skill-top">
                <span className="skill-icon">{s.icon}</span>
                <span className="skill-name">{s.name}</span>
                <span className="skill-pct">{s.level}%</span>
              </div>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ '--target': `${s.level}%`, transitionDelay: `${i * 0.08 + 0.3}s` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="tech-tags">
          {['Vite', 'jQuery', 'REST APIs', 'Responsive Design', 'Figma', 'Agile'].map(t => (
            <span key={t} className="tech-tag hoverable">{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Projects Section ────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    {
      title: 'HealthSync',
      emoji: '🏥',
      desc: 'Comprehensive healthcare management system built as graduation project. Full-featured platform for patients and healthcare providers.',
      tags: ['React.js', 'JavaScript', 'CSS3'],
      grade: 'Grade: A',
      highlight: true,
      link: null,
    },
    {
      title: 'Kuwait International Law School',
      emoji: '⚖️',
      desc: 'Professional institutional website for Kuwait International Law School with modern UI and smooth navigation experience.',
      tags: ['React 18', 'TypeScript', 'Vite', 'CSS Modules', 'React Router'],
      link: 'https://github.com/KerolosMaged7/Kuwait-International-Law-School',
      date: '02/2026 – 03/2026',
    },
    {
      title: 'MarketMate',
      emoji: '🛒',
      desc: 'Full CRUD system for product management. Enables creating, reading, updating, and deleting marketplace listings with clean UI.',
      tags: ['HTML5', 'CSS3', 'JavaScript'],
      link: null,
      date: '01/2025',
    },
    {
      title: 'Gallerita',
      emoji: '🖼️',
      desc: 'Dynamic image gallery with smooth animations and responsive masonry layout. Built during CodeAlpha internship.',
      tags: ['HTML5', 'CSS3', 'JavaScript'],
      link: null,
    },
    {
      title: 'Advanced Calculator',
      emoji: '🧮',
      desc: 'Scientific calculator with advanced mathematical operations, keyboard support, and clean interface.',
      tags: ['HTML5', 'CSS3', 'JavaScript'],
      link: null,
    },
    {
      title: 'Portfolio v1',
      emoji: '👨‍💻',
      desc: 'First personal portfolio showcasing projects and skills built from scratch with vanilla web technologies.',
      tags: ['HTML5', 'CSS3', 'JavaScript'],
      link: null,
    },
  ]

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <SectionHeader num="03" title="Projects" sub="Things I've built" />
        <div className="projects-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project: p, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className={`project-card hoverable ${p.highlight ? 'featured' : ''} ${visible ? 'visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}>
      {p.highlight && <div className="featured-badge">⭐ Graduation Project</div>}
      <div className="project-emoji">{p.emoji}</div>
      <h3 className="project-title">{p.title}</h3>
      {p.date && <span className="project-date">{p.date}</span>}
      <p className="project-desc">{p.desc}</p>
      <div className="project-tags">
        {p.tags.map(t => <span key={t} className="ptag">{t}</span>)}
      </div>
      <div className="project-footer">
        {p.grade && <span className="project-grade">{p.grade}</span>}
        {p.link && (
          <a href={p.link} target="_blank" rel="noreferrer" className="project-link hoverable">
            GitHub <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Experience Section ──────────────────────────────────────────────────────
function Experience() {
  const items = [
    {
      role: 'Frontend Developer',
      org: 'Informatique Education – Assiut Branch',
      date: '03/2026 – Present',
      type: 'work',
      points: ['Building and maintaining web interfaces using React.js and modern frontend technologies', 'Collaborating on educational platform development serving students and instructors in the Assiut region'],
    },
    {
      role: 'Frontend Development Internship',
      org: 'CodeAlpha',
      date: '08/2024 – 10/2024',
      type: 'internship',
      points: ['Built Gallerita – Dynamic Image Gallery', 'Developed Advanced Scientific Calculator', 'Created personal portfolio from scratch'],
    },
    {
      role: 'Internship Trainee',
      org: 'CIB Egypt',
      date: '07/2024 – 08/2024',
      type: 'internship',
      points: ['Gained exposure to banking technology systems', 'Learned enterprise-level software workflows'],
    },
    {
      role: 'Frontend Workshop',
      org: 'Petra Software',
      date: '07/2023 – 08/2023',
      type: 'training',
      points: ['Intensive frontend development training', 'HTML, CSS, JS fundamentals and best practices'],
    },
    {
      role: 'Bachelor of Computer & Information Systems',
      org: 'University – Egypt',
      date: '09/2021 – 07/2025',
      type: 'education',
      points: ['GPA: 3.12 / 4.0', 'Graduation Project: HealthSync (Healthcare Management System) – Grade: A'],
    },
  ]

  return (
    <section className="experience-section" id="experience">
      <div className="section-bg-accent accent-right" />
      <div className="container">
        <SectionHeader num="04" title="Experience" sub="My journey so far" />
        <div className="timeline">
          {items.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
          <div className="timeline-line" />
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ item, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const typeColors = { work: '#1a6cf7', internship: '#00d4ff', training: '#4d9fff', education: '#8b5cf6' }
  const color = typeColors[item.type]

  return (
    <div ref={ref} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${visible ? 'visible' : ''}`}
      style={{ animationDelay: `${index * 0.15}s` }}>
      <div className="timeline-dot" style={{ background: color, boxShadow: `0 0 20px ${color}` }} />
      <div className="timeline-card hoverable">
        <span className="tl-type" style={{ color, borderColor: `${color}40` }}>{item.type}</span>
        <h3 className="tl-role">{item.role}</h3>
        <p className="tl-org">{item.org}</p>
        <p className="tl-date mono">{item.date}</p>
        <ul className="tl-points">
          {item.points.map((pt, j) => <li key={j}>{pt}</li>)}
        </ul>
      </div>
    </div>
  )
}

// ─── Certifications Section (inline in Experience area) ──────────────────────
function Certifications() {
  const certs = [
    { title: "CS50's Introduction to Programming with Python", org: 'Harvard University', year: '2023' },
    { title: 'Introduction to Python Programming', org: 'Udacity', year: '2023' },
    { title: 'Web Development (Theory & Practice)', org: 'SoloLearn', year: '2022' },
  ]

  return (
    <section className="certs-section">
      <div className="container">
        <SectionHeader num="05" title="Certifications" sub="Continuous learning" />
        <div className="certs-grid">
          {certs.map((c, i) => (
            <div key={i} className="cert-card hoverable">
              <div className="cert-icon">🎓</div>
              <h4 className="cert-title">{c.title}</h4>
              <p className="cert-org">{c.org}</p>
              <span className="cert-year">{c.year}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact Section ─────────────────────────────────────────────────────────
function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-glow" />
      <div className="container">
        <SectionHeader num="06" title="Get In Touch" sub="Let's work together" />
        <div className="contact-inner">
          <div className="contact-left">
            <p className="contact-text">
              I'm currently open to new opportunities. Whether you have a question,
              a project idea, or just want to say hi — my inbox is always open!
            </p>
            <div className="contact-info">
              <a href="mailto:kerolosmaged003@gmail.com" className="contact-item hoverable">
                <MailIcon /> <span>kerolosmaged003@gmail.com</span>
              </a>
              <a href="tel:+201277855921" className="contact-item hoverable">
                <PhoneIcon /> <span>+20 127 785 5921</span>
              </a>
              <div className="contact-item">
                <PinIcon /> <span>Assiut, Egypt</span>
              </div>
            </div>
            <div className="contact-socials">
              <a href="https://github.com/KerolosMaged7" target="_blank" rel="noreferrer" className="social-pill hoverable">
                <GithubIcon /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/kerolos-maged-173a14310" target="_blank" rel="noreferrer" className="social-pill hoverable">
                <LinkedinIcon /> LinkedIn
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Thanks! I will get back to you soon.') }}>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required className="form-input" />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required className="form-input" />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" className="form-input" />
            </div>
            <div className="form-group">
              <textarea rows="5" placeholder="Your Message" required className="form-input" />
            </div>
            <button type="submit" className="btn-primary w-full hoverable">
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-line" />
      <p className="footer-text">
        Designed & Built by <span className="footer-name">Kerolos Maged</span>
        <span className="mono"> // 2025</span>
      </p>
    </footer>
  )
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ num, title, sub }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`section-header ${visible ? 'visible' : ''}`}>
      <span className="section-num mono">{num}.</span>
      <div>
        <p className="section-sub">{sub}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-line" />
    </div>
  )
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const GithubIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
const LinkedinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.36 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const PinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
