import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RING, ringPosition } from '../scenes/layout'
import { PROFILES } from '../data/functions'

export function Wordmark({ night = false }: { night?: boolean }) {
  return (
    <Link to="/" className="wordmark" aria-label="Octanoia home">
      <svg viewBox="-12 -12 24 24" aria-hidden="true">
        {RING.map((fn) => {
          const [x, y] = ringPosition(fn, 8)
          return <circle key={fn} cx={x} cy={-y} r={2.6} fill={PROFILES[fn].color} />
        })}
        <circle r={2} fill={night ? '#eeecea' : '#333231'} />
      </svg>
      Octanoia
    </Link>
  )
}

export function TopBar({ night = false, action }: { night?: boolean; action?: React.ReactNode }) {
  return (
    <header className="wrap topbar">
      <Wordmark night={night} />
      <nav aria-label="Main">
        <NavLink to="/read">Read</NavLink>
        <NavLink to="/library">The notes</NavLink>
        <NavLink to="/how-scoring-works">Scoring</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {action}
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="wrap footer">
      <span>Octanoia · the eight functions of your mind</span>
      <nav aria-label="Footer">
        <Link to="/test/quick">Take the test</Link>
        <Link to="/read">Read</Link>
        <Link to="/library">The notes</Link>
        <Link to="/library/sources">Sources</Link>
        <Link to="/how-scoring-works">Scoring</Link>
        <Link to="/privacy">Privacy</Link>
      </nav>
      <span className="right">
        Made by{' '}
        <a href="https://github.com/tanim913" target="_blank" rel="noopener noreferrer" className="maker">
          K M Azizullah Tanim
        </a>{' '}
        · © {new Date().getFullYear()}
      </span>
    </footer>
  )
}

/** Adds .in to children with .reveal as they enter the viewport, staggered. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal:not(.in)'))
    if (!('IntersectionObserver' in window)) return els.forEach((el) => el.classList.add('in'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const siblings = Array.from(el.parentElement?.querySelectorAll(':scope > .reveal') ?? [])
          el.style.transitionDelay = `${Math.max(0, siblings.indexOf(el)) * 75}ms`
          el.classList.add('in')
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

export function NoteChip({ fn, withName = false }: { fn: keyof typeof PROFILES; withName?: boolean }) {
  return (
    <span className="note" style={{ ['--c' as string]: PROFILES[fn].color }}>
      <i aria-hidden="true" />
      {fn}
      {withName && <span style={{ fontWeight: 400 }}> {PROFILES[fn].name}</span>}
    </span>
  )
}
