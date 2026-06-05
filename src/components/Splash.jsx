import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import heroVideo from '../assets/hero_section.mp4'
import './Splash.css'

/* ─── Titles that the typewriter cycles through ─── */
const TITLES = ['Software Engineer', 'AI Engineer', 'Full Stack Developer']

/* ─── Terminal boot lines (step 1) ─── */
const BOOT_LINES = [
  { text: '> Initializing portfolio...', delay: 0 },
  { text: '> Loading projects...', delay: 400 },
  { text: '> Compiling modules...', delay: 800 },
  { text: "> Welcome to Angelo's world.", delay: 1200 },
]

/* ─── Floating particles ─── */
function Particles() {
  const count = 40
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 1.5,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 15,
      opacity: 0.03 + Math.random() * 0.04,
    }))
  ).current

  return (
    <div className="splash-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="splash-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Typewriter hook ─── */
function useTypewriter(titles, speed = 80, deleteSpeed = 40, pauseMs = 2000) {
  const [display, setDisplay] = useState('')
  const [titleIdx, setTitleIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = titles[titleIdx]
    let timer

    if (!deleting && charIdx <= current.length) {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, charIdx))
        setCharIdx((c) => c + 1)
      }, speed)
    } else if (!deleting && charIdx > current.length) {
      timer = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => {
        setCharIdx((c) => c - 1)
        setDisplay(current.slice(0, charIdx - 1))
      }, deleteSpeed)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setTitleIdx((i) => (i + 1) % titles.length)
    }

    return () => clearTimeout(timer)
  }, [charIdx, deleting, titleIdx, titles, speed, deleteSpeed, pauseMs])

  return display
}

/* ─── Format current date for "Last login" ─── */
function formatLoginDate() {
  const d = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const pad = (n) => String(n).padStart(2, '0')
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/* ═══════════════════════════════════════════
   SPLASH COMPONENT
   ═══════════════════════════════════════════ */
export default function Splash({ onComplete }) {
  const [entered, setEntered] = useState(false)
  const typewriterText = useTypewriter(TITLES)

  /* terminal state */
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLines, setTerminalLines] = useState([])
  const [cursorVisible, setCursorVisible] = useState(true)
  const [booting, setBooting] = useState(false)
  const [transitionPhase, setTransitionPhase] = useState(null) // null | 'pulse' | 'glitch' | 'wipe'
  const inputRef = useRef(null)
  const videoRef = useRef(null)
  const terminalBodyRef = useRef(null)

  // Autoplay video silently on component mount to avoid delay when entering experience
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // ignore autoplay restrictions; video will start on user interaction
      })
    }
  }, [])
  const terminalRef = useRef(null)
  const loginDate = useRef(formatLoginDate()).current

  /* cursor blink */
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  /* auto-scroll terminal body */
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [terminalLines, terminalInput])

  /* handle entering the portfolio and unmuting */
  const handleEnter = () => {
    setEntered(true);
    if (videoRef.current) {
      // Unmute video; it is already playing muted from mount
      videoRef.current.muted = false;
      // Ensure playback continues
      videoRef.current.play().catch(() => {
        // ignore playback errors due to restrictions
      });
    }
    // Auto-focus terminal input after entering
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  /* focus the hidden input on terminal click */
  const focusInput = useCallback(() => {
    if (entered) {
      inputRef.current?.focus();
    }
  }, [entered])


  /* ─── type a line character-by-character ─── */
  const typeLine = useCallback((text, color = '#00ff88') => {
    return new Promise((resolve) => {
      let i = 0
      const lineId = Date.now() + Math.random()
      setTerminalLines((prev) => [...prev, { id: lineId, text: '', color, typing: true }])

      const interval = setInterval(() => {
        i++
        setTerminalLines((prev) =>
          prev.map((l) => (l.id === lineId ? { ...l, text: text.slice(0, i) } : l))
        )
        if (i >= text.length) {
          clearInterval(interval)
          setTerminalLines((prev) =>
            prev.map((l) => (l.id === lineId ? { ...l, typing: false } : l))
          )
          resolve()
        }
      }, 18)
    })
  }, [])

  /* ─── run boot sequence (Steps 1-5) ─── */
  const runBootSequence = useCallback(async () => {
    setBooting(true)

    /* STEP 1 — type response lines */
    for (const { text, delay } of BOOT_LINES) {
      await new Promise((r) => setTimeout(r, delay === 0 ? 0 : 400))
      await typeLine(text)
    }
    await new Promise((r) => setTimeout(r, 600))

    /* STEP 2 — terminal pulse */
    setTransitionPhase('pulse')
    await new Promise((r) => setTimeout(r, 300))

    /* STEP 3 — glitch */
    setTransitionPhase('glitch')
    await new Promise((r) => setTimeout(r, 500))

    /* STEP 4 — screen wipe */
    setTransitionPhase('wipe')
    await new Promise((r) => setTimeout(r, 800))

    /* STEP 5 — unmount */
    onComplete()
  }, [typeLine, onComplete])

  /* ─── handle key presses ─── */
  const handleKeyDown = useCallback(
    (e) => {
      if (booting) return

      if (e.key === 'Enter') {
        const cmd = terminalInput.trim()
        if (cmd === 'npm run start') {
          setTerminalLines((prev) => [
            ...prev,
            { id: Date.now(), text: `angelo@portfolio ~ $ ${cmd}`, color: '#00ff88', typing: false },
          ])
          setTerminalInput('')
          runBootSequence()
        } else if (cmd.length > 0) {
          setTerminalLines((prev) => [
            ...prev,
            { id: Date.now(), text: `angelo@portfolio ~ $ ${cmd}`, color: '#00ff88', typing: false },
            { id: Date.now() + 1, text: `command not found: ${cmd}`, color: '#ff5f57', typing: false },
          ])
          setTerminalInput('')
        }
      }
    },
    [terminalInput, booting, runBootSequence]
  )

  /* ─── compute terminal bounding rect for wipe origin ─── */
  const getWipeOrigin = () => {
    if (!terminalRef.current) return '50% 50%'
    const rect = terminalRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return `${cx}px ${cy}px`
  }

  return (
    <div
      className={`splash-root ${transitionPhase === 'glitch' ? 'splash-glitch' : ''}`}
      onClick={focusInput}
    >
      {/* ── Video background (starts paused at 0s, starts on user action) ── */}
      <video
        ref={videoRef}
        className="splash-video"
        src={heroVideo}
        preload="auto"
        loop
        muted
        playsInline
        autoPlay
      />

      {/* ── Overlays ── */}
      <div className="splash-overlay-dark" />
      <div className="splash-overlay-left" />
      <div className="splash-overlay-glow" />

      {/* ── Enter Portfolio Overlay Screen ── */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="splash-enter-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.div 
              className="splash-enter-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h2 className="splash-enter-title">ANGELO MAFILAS</h2>
              <p className="splash-enter-subtitle">Interactive Portfolio Experience</p>
              <button className="splash-enter-btn" onClick={handleEnter}>
                <span>ENTER EXPERIENCE</span>
                <div className="splash-btn-glow" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Particles (desktop only) ── */}
      <Particles />

      {/* ── Glitch extras ── */}
      {transitionPhase === 'glitch' && (
        <>
          <div className="splash-noise" />
          <div className="splash-tear splash-tear-1" />
          <div className="splash-tear splash-tear-2" />
        </>
      )}

      {/* ── Content ── */}
      <div className="splash-content" style={{ visibility: entered ? 'visible' : 'hidden' }}>
        {/* Left column: name + typewriter */}
        <div className="splash-left">
        {/* Name */}
        <motion.h1
          className="splash-name"
          initial={{ opacity: 0, y: 30 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          ANGELO<br /><span className="splash-lastname">MAFILAS</span>
        </motion.h1>

        {/* Typewriter */}
        <motion.p
          className="splash-typewriter"
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {entered && typewriterText}
          <span className="splash-typewriter-cursor">|</span>
        </motion.p>
        </div>

        {/* Right column: Terminal */}
        <div className="splash-right">
        <motion.div
          ref={terminalRef}
          className={`splash-terminal ${transitionPhase === 'pulse' ? 'splash-terminal-pulse' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
        >
          {/* scanline on pulse */}
          {transitionPhase === 'pulse' && <div className="splash-scanline" />}

          {/* Terminal header */}
          <div className="splash-terminal-header">
            <div className="splash-traffic-lights">
              <span className="splash-tl-red" />
              <span className="splash-tl-yellow" />
              <span className="splash-tl-green" />
            </div>
            <span className="splash-terminal-title">angelo@portfolio ~</span>
            <div className="splash-traffic-lights" style={{ visibility: 'hidden' }}>
              <span /><span /><span />
            </div>
          </div>

          {/* Terminal body */}
          <div className="splash-terminal-body" ref={terminalBodyRef}>
            <p className="splash-term-line" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Last login: {loginDate}
            </p>
            <p className="splash-term-line">&nbsp;</p>

            {/* history lines */}
            {terminalLines.map((line) => (
              <p key={line.id} className="splash-term-line" style={{ color: line.color }}>
                {line.text}
                {line.typing && (
                  <span className="splash-typewriter-cursor" style={{ color: line.color }}>▌</span>
                )}
              </p>
            ))}

            {/* active prompt */}
            {!booting && (
              <p className="splash-term-line splash-prompt-line">
                <span style={{ color: '#00ff88' }}>angelo@portfolio ~ $&nbsp;</span>
                <span style={{ color: '#00ff88' }}>{terminalInput}</span>
                <span
                  className="splash-cursor"
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                >
                  ▌
                </span>
              </p>
            )}
          </div>

          {/* Hidden input to capture keyboard */}
          <input
            ref={inputRef}
            className="splash-hidden-input"
            value={terminalInput}
            onChange={(e) => !booting && setTerminalInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </motion.div>
        </div>
      </div>

      {/* ── Screen Wipe (Step 4) ── */}
      <AnimatePresence>
        {transitionPhase === 'wipe' && (
          <motion.div
            className="splash-wipe"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: getWipeOrigin() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
