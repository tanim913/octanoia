import { marked } from 'marked'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Footer, TopBar, useReveal } from '../../components/Shell'
import { CHAPTERS, readMinutes } from '../../content/read'
import { PROFILES } from '../../data/functions'
import { RING } from '../../scenes/layout'
import { NoteForm } from '../../three/Stage'
import { scrollToTarget } from '../../lib/smooth'
import './read.css'

marked.setOptions({ gfm: true })

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/** Markdown → HTML with ids on h2 for the in-page contents, and cite lines styled. */
function render(md: string) {
  const html = marked.parse(md, { async: false }) as string
  return html
    .replace(/<h2>(.*?)<\/h2>/g, (_, t) => `<h2 id="${slugify(t.replace(/<[^>]+>/g, ''))}">${t}</h2>`)
    .replace(/<p>— (.*?)<\/p>/g, '<p class="cite">— $1</p>')
    .replace(/<blockquote>\n<p>([\s\S]*?)\n— ([\s\S]*?)<\/p>/g, '<blockquote>\n<p>$1</p><p class="cite">— $2</p>')
}

export function ReadIndex() {
  const ref = useReveal<HTMLDivElement>()
  const parts = ['Foundations', 'The eight notes'] as const
  return (
    <div ref={ref}>
      <TopBar />
      <main className="wrap read-index">
        <header className="read-index-head">
          <h1 className="display">Read</h1>
          <p className="lead serif">
            A short book on the eight functions, written for people meeting them for the first time. Built from Jung, Isabel Myers, Lenore Thomson and John Beebe, in plain words, with the passages that matter cited.
          </p>
          <Link className="btn" to="/read/begin">Start at the beginning</Link>
        </header>
        {parts.map((part) => (
          <section key={part} className="read-part" aria-labelledby={slugify(part)}>
            <h2 id={slugify(part)} className="head reveal">{part}</h2>
            <ol className={part === 'Foundations' ? 'toc-list' : 'toc-notes'}>
              {CHAPTERS.filter((c) => c.part === part).map((c) => (
                <li key={c.slug} className="reveal">
                  <Link to={`/read/${c.slug}`} className="toc-item" style={c.fn ? { ['--c' as string]: PROFILES[c.fn].color } : undefined}>
                    {c.fn && <NoteForm fn={c.fn} intensity={0.6} className="toc-form" />}
                    <span className="toc-title serif">{c.title}</span>
                    <span className="toc-summary">{c.summary}</span>
                    <span className="toc-meta small muted">{readMinutes(c.body)} min read</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}

export function ReadChapter() {
  const { slug } = useParams()
  const idx = CHAPTERS.findIndex((c) => c.slug === slug)
  const c = CHAPTERS[idx]
  const html = useMemo(() => (c ? render(c.body) : ''), [c])
  const toc = useMemo(() => (c ? [...c.body.matchAll(/^## (.+)$/gm)].map((m) => m[1]) : []), [c])
  const [active, setActive] = useState<string>('')
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!c) return
    const heads = toc.map((t) => document.getElementById(slugify(t))).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-20% 0px -70% 0px' })
    heads.forEach((h) => io.observe(h))
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = document.querySelector('.read-body') as HTMLElement | null
        if (!el || !bar.current) return
        const r = el.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)))
        bar.current.style.transform = `scaleX(${p})`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [c, toc])

  if (!c) return <Navigate to="/read" replace />
  const prev = CHAPTERS[idx - 1]
  const next = CHAPTERS[idx + 1]
  const color = c.fn ? PROFILES[c.fn].color : undefined

  return (
    <div className="read-page" style={color ? { ['--c' as string]: color } : undefined}>
      <div className="read-progress" aria-hidden="true"><span ref={bar} style={{ transform: 'scaleX(0)' }} /></div>
      <TopBar />
      <header className={`wrap read-hero${c.fn ? ' has-form' : ''}`}>
        <div className="read-hero-text">
          <p className="read-part-label">{c.part} · {readMinutes(c.body)} min read</p>
          <h1 className="display">{c.title}</h1>
          <p className="lead serif read-summary">{c.summary}</p>
        </div>
        {c.fn ? (
          <NoteForm fn={c.fn} intensity={0.85} className="read-hero-form" label={`The ${c.title} form`} />
        ) : (
          <div className="read-hero-chord" aria-hidden="true">
            {RING.map((f, i) => (
              <NoteForm key={f} fn={f} intensity={0.35 + ((i * 3) % 8) / 16} className="chord-form" />
            ))}
          </div>
        )}
      </header>

      <div className="wrap read-layout">
        <nav className="read-toc" aria-label="In this chapter">
          <p className="toc-h">In this chapter</p>
          <ol>
            {toc.map((t) => (
              <li key={t}>
                <a href={`#${slugify(t)}`} className={active === slugify(t) ? 'is-on' : ''} onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(slugify(t))
                  if (el) scrollToTarget(el)
                }}>{t}</a>
              </li>
            ))}
          </ol>
          <p className="toc-h toc-h2">All chapters</p>
          <ol className="toc-all">
            {CHAPTERS.map((x) => (
              <li key={x.slug}>
                <Link to={`/read/${x.slug}`} aria-current={x.slug === c.slug ? 'page' : undefined}>
                  {x.fn ? <span className="toc-dot" style={{ background: PROFILES[x.fn].color }} /> : null}
                  {x.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <article className="read-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <nav className="wrap read-next" aria-label="Chapter navigation">
        {prev ? (
          <Link to={`/read/${prev.slug}`} className="rn rn-prev">
            <span className="small muted">Previous</span>
            <span className="serif rn-title">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/read/${next.slug}`} className="rn rn-next">
            <span className="small muted">Next</span>
            <span className="serif rn-title">{next.title}</span>
          </Link>
        ) : (
          <Link to="/test/quick" className="rn rn-next">
            <span className="small muted">You’ve finished the book</span>
            <span className="serif rn-title">Now hear your own eight notes</span>
          </Link>
        )}
      </nav>
      {c.fn && (
        <p className="wrap read-also small">
          Prefer the quick version? <Link to={`/library/${c.fn.toLowerCase()}`}>The {c.fn} summary page</Link>.
        </p>
      )}
      <Footer />
    </div>
  )
}
