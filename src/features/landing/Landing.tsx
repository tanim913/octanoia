import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ItemEffect } from '../../components/Ledger'
import { NoteBars } from '../../components/NoteBars'
import { Question } from '../../components/Question'
import { Footer, TopBar, useReveal } from '../../components/Shell'
import { CHAPTERS, readMinutes } from '../../content/read'
import { PROFILES } from '../../data/functions'
import { ITEM_BY_ID, itemsFor } from '../../data/items'
import { FUNCTIONS, type Answers, type Fn } from '../../engine/model'
import { scoreAnswers } from '../../engine/score'
import { fitTypes, scoresOf, template } from '../../engine/typeFit'
import Constellation from '../../scenes/Constellation'
import { HeroForms } from '../../scenes/HeroForms'
import { RING } from '../../scenes/layout'
import { NoteForm } from '../../three/Stage'
import './landing.css'

const HERO_ITEM = ITEM_BY_ID['q-to-c1']
const IMG = (f: string) => `${import.meta.env.BASE_URL}img/${f}`

export default function Landing() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="landing">
      <Hero />
      <Pause />
      <MeetTheEight />
      <TryAScene />
      <HowItWorks />
      <Features />
      <ReadTeaser />
      <Lineage />
      <Faq />
      <Cta />
      <Credits />
      <Footer />
    </div>
  )
}

/* ───────── First viewport: the field and the eight ───────── */
function Hero() {
  return (
    <section className="hero">
      <TopBar action={<Link className="btn" to="/test/quick">Begin</Link>} />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="display hero-title">
            <span className="mask-line"><span>Your mind,</span></span>
            <span className="mask-line"><span style={{ animationDelay: '120ms' }}>in eight notes</span></span>
          </h1>
          <p className="lead serif hero-sub rise" style={{ animationDelay: '520ms' }}>
            A free cognitive-function test told through small everyday scenes. Every score comes with the answers that made it.
          </p>
          <div className="hero-actions rise" style={{ animationDelay: '640ms' }}>
            <Link className="btn btn-lg" to="/test/quick">Begin the 12-minute test</Link>
            <Link className="link" to="/test/deep">Or the deep version, 160 scenes</Link>
          </div>
        </div>
        <HeroForms className="hero-stage" />
      </div>
      <p className="wrap scroll-cue rise small" style={{ animationDelay: '900ms' }}>
        Move your pointer to paint. Scroll to meet the eight.
      </p>
    </section>
  )
}

/* ───────── A pinned pause: three lines, one at a time ───────── */
const LINES = [
  'Everyone plays all eight notes.',
  'Some ring clearly. Some barely sound.',
  'Octanoia listens for which, and shows you exactly how it heard.',
]

function Pause() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    let raf = 0
    const on = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)))
        const next = Math.min(LINES.length - 1, Math.floor(p * LINES.length))
        setActive((a) => (a === next ? a : next)) // re-render only when the line changes
      })
    }
    window.addEventListener('scroll', on, { passive: true })
    on()
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <section ref={ref} className="pause" aria-label="Everyone plays all eight notes">
      <div className="pause-stick">
        {LINES.map((l, i) => (
          <p key={l} className={`pause-line serif${i === active ? ' is-on' : ''}${i < active ? ' is-past' : ''}`} aria-hidden={i !== active}>
            {l}
          </p>
        ))}
        <ol className="pause-dots" aria-hidden="true">
          {LINES.map((l, i) => <li key={l} className={i === active ? 'is-on' : ''} />)}
        </ol>
      </div>
    </section>
  )
}

/* ───────── Meet the eight: select a form, hear about it ───────── */
function MeetTheEight() {
  const [fn, setFn] = useState<Fn>('Ni')
  const p = PROFILES[fn]
  return (
    <section className="wrap meet" aria-labelledby="meet-h" style={{ ['--c' as string]: p.color }}>
      <div className="meet-head">
        <h2 id="meet-h" className="head reveal">Meet the eight</h2>
        <p className="reveal meet-sub">Each function has its own shape. Choose one to hear what it does.</p>
      </div>
      <div className="meet-grid">
        <div className="meet-feature" aria-live="polite">
          <NoteForm key={fn} fn={fn} intensity={0.9} active className="meet-form" label={`${p.name} form`} />
          <div className="meet-text">
            <p className="meet-note">{fn} · {p.note}</p>
            <h3 className="serif meet-name">{p.name}</h3>
            <p className="lead serif">{p.oneLine}</p>
            <ul className="meet-list">{p.looksLike.slice(0, 3).map((l) => <li key={l}>{l}</li>)}</ul>
            <p className="meet-links">
              <Link className="link" to={`/read/${fn.toLowerCase()}`}>Read the chapter</Link>
            </p>
          </div>
        </div>
        <ul className="meet-picker" role="radiogroup" aria-label="Choose a function">
          {RING.map((f) => (
            <li key={f}>
              <button
                type="button"
                role="radio"
                aria-checked={fn === f}
                className={`meet-pick${fn === f ? ' is-on' : ''}`}
                style={{ ['--c' as string]: PROFILES[f].color }}
                onClick={() => setFn(f)}
                onMouseEnter={() => setFn(f)}
                onFocus={() => setFn(f)}
              >
                <NoteForm fn={f} intensity={0.5} className="pick-form" />
                <span className="pick-code">{f}</span>
                <span className="pick-name">{PROFILES[f].name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────── Try one real scene ───────── */
function TryAScene() {
  const [value, setValue] = useState<number | undefined>(undefined)
  const effects = useMemo(() => {
    if (value === undefined || value < 0) return []
    const r = scoreAnswers([HERO_ITEM], { [HERO_ITEM.id]: value })
    return FUNCTIONS.flatMap((f) => r.scores[f].ledger)
  }, [value])
  return (
    <section className="try on-night" aria-labelledby="try-h">
      <div className="wrap try-grid">
        <div className="try-copy">
          <h2 id="try-h" className="head reveal">Try one scene</h2>
          <p className="lead serif reveal">This is a real question from the test. Answer it and see exactly which notes it moves, and by how much.</p>
        </div>
        <div className="try-demo reveal">
          <Question item={HERO_ITEM} value={value} onAnswer={setValue} keyboard={false} night />
          <div className="demo-result" aria-live="polite">
            {effects.length ? (
              <>
                <p className="small">What your answer did:</p>
                <ItemEffect effects={effects} />
                <p className="small muted">{HERO_ITEM.why}</p>
              </>
            ) : (
              <p className="small muted">Pick an answer to see which of the eight notes it moves.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── How it shows its working ───────── */
function HowItWorks() {
  const sample = useMemo(() => sampleAnalysis(), [])
  const item = ITEM_BY_ID['q-np-c2']
  return (
    <section className="wrap how" aria-labelledby="how-h">
      <h2 id="how-h" className="head reveal">A test that shows its working</h2>
      <div className="how-col">
        <div className="how-step reveal">
          <p className="how-say serif">First, you meet a scene.</p>
          <div className="panel how-call" data-ui>
            <p className="small muted">A New Place</p>
            <p>{item.text}</p>
          </div>
          <div className="how-resp" data-ui>
            {item.kind === 'choice' && item.options.map((o, i) => <div key={o.text} className={`mini-opt${i === 3 ? ' is-on' : ''}`}>{o.text}</div>)}
          </div>
        </div>
        <div className="how-step reveal">
          <p className="how-say serif">Then every answer is counted in the open.</p>
          <div className="how-resp" data-ui>
            <ItemEffect effects={FUNCTIONS.flatMap((f) => scoreAnswers([item], { [item.id]: 3 }).scores[f].ledger)} />
          </div>
        </div>
        <div className="how-step reveal">
          <p className="how-say serif">Finally, your eight notes, with their reasons.</p>
          <div className="how-final panel" data-ui>
            <div>
              <p className="small muted">A sample result</p>
              <p className="lead serif">
                Clearest note <strong>{sample.fit.ranked[0].stack[0]}</strong>. Closest pattern {sample.fit.ranked[0].code} ({sample.fit.ranked[0].fit}% fit), then {sample.fit.ranked[1].code} ({sample.fit.ranked[1].fit}%).
              </p>
            </div>
            <NoteBars scores={sample.scores} order="score" compact />
          </div>
        </div>
      </div>
    </section>
  )
}

function sampleAnalysis(yea = 0, niAnswer?: number) {
  // A sample respondent drawn from the INFJ template, answered through the real Quick bank.
  const items = itemsFor('quick')
  const t = template('INFJ')
  const answers: Answers = {}
  items.forEach((it, k) => {
    if (it.kind === 'likert') {
      const [fn, load] = Object.entries(it.loads)[0] as [Fn, number]
      const wobble = ((k * 37) % 7) / 7 - 0.45
      answers[it.id] = Math.max(-2, Math.min(2, Math.round(4 * (t[fn] - 0.5) * Math.sign(load) + wobble + yea)))
    } else {
      let best = 0
      it.options.forEach((o, i) => {
        const f = Object.keys(o.loads)[0] as Fn
        const b = Object.keys(it.options[best].loads)[0] as Fn
        if (t[f] > t[b]) best = i
      })
      answers[it.id] = best
    }
  })
  if (niAnswer !== undefined) answers['q-dc-2'] = niAnswer
  const score = scoreAnswers(items, answers)
  const scores = scoresOf(score.scores)
  return { score, scores, fit: fitTypes(scores) }
}

/* ───────── Nothing hidden: live controls on a sample result ───────── */
function Features() {
  const [ni, setNi] = useState(1)
  const [yea, setYea] = useState(false)
  const [lens, setLens] = useState<'jung' | 'myers' | 'beebe'>('myers')
  const a = useMemo(() => sampleAnalysis(yea ? 1 : 0, ni), [ni, yea])
  const top = a.fit.ranked[0]
  return (
    <section className="features" aria-labelledby="feat-h">
      <div className="feat-stage on-night">
        <div className="feat-card" data-ui>
          <p className="small muted">Sample result, live</p>
          <p className="lead serif feat-lens">
            {lens === 'jung' && <>Leading note: <strong>{PROFILES[top.stack[0]].name}</strong></>}
            {lens === 'myers' && <>Closest pattern: <strong>{top.code}</strong> · {top.fit}% fit</>}
            {lens === 'beebe' && <>Hero <strong>{top.stack[0]}</strong>, parent <strong>{top.stack[1]}</strong>, child <strong>{top.stack[2]}</strong>, inner guide <strong>{top.stack[3]}</strong></>}
          </p>
          <NoteBars scores={a.scores} compact />
          <p className="small muted">Agree-with-everything correction: {a.score.acquiescence >= 0 ? '+' : ''}{a.score.acquiescence.toFixed(2)} subtracted</p>
        </div>
      </div>
      <div className="feat-col">
        <h2 id="feat-h" className="head reveal">Nothing hidden</h2>
        <div className="feat-block">
          <p className="feat-say serif">One answer, one visible change.</p>
          <p>Move this answer to “It’s easier for you to say where something is heading than to list the facts”. Watch Ni move, and nothing else.</p>
          <label className="slider" data-ui>
            <span className="small">Your answer: <strong>{['Not me', 'Rarely me', 'Sometimes', 'Often me', 'Very me'][ni + 2]}</strong></span>
            <input type="range" min={-2} max={2} step={1} value={ni} onChange={(e) => setNi(Number(e.target.value))} />
          </label>
        </div>
        <div className="feat-block">
          <p className="feat-say serif">Agreeing with everything doesn’t inflate you.</p>
          <p>Octanoia measures your average answer and subtracts it, so only your relative leanings count.</p>
          <label className="toggle" data-ui>
            <input type="checkbox" checked={yea} onChange={(e) => setYea(e.target.checked)} />
            <span>Answer every statement one step more agreeably</span>
          </label>
        </div>
        <div className="feat-block">
          <p className="feat-say serif">Three ways to read the same result.</p>
          <p>Jung’s leading function, Myers’ four letters, or Beebe’s cast of eight characters.</p>
          <div className="segmented" role="radiogroup" aria-label="Lens" data-ui>
            {(['jung', 'myers', 'beebe'] as const).map((l) => (
              <button key={l} type="button" role="radio" aria-checked={lens === l} className={lens === l ? 'is-on' : ''} onClick={() => setLens(l)}>
                {l === 'jung' ? 'Jung' : l === 'myers' ? 'Myers' : 'Beebe'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── The reading room ───────── */
function ReadTeaser() {
  const found = CHAPTERS.filter((c) => c.part === 'Foundations').slice(0, 4)
  return (
    <section className="wrap read-teaser" aria-labelledby="rt-h">
      <div className="rt-copy">
        <h2 id="rt-h" className="head reveal">A short book on the eight</h2>
        <p className="lead serif reveal">Fourteen chapters for newcomers, from what Jung actually meant to how each function feels from the inside.</p>
        <Link className="btn reveal" to="/read">Open the book</Link>
      </div>
      <ol className="rt-list">
        {found.map((c) => (
          <li key={c.slug} className="reveal">
            <Link to={`/read/${c.slug}`}>
              <span className="serif rt-title">{c.title}</span>
              <span className="small muted">{c.summary} · {readMinutes(c.body)} min</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ───────── Lineage: real pictures of the idea’s world ───────── */
function Lineage() {
  return (
    <section className="wrap lineage" aria-labelledby="lin-h">
      <figure className="lin-main reveal">
        <img src={IMG('jung-1910.jpg')} width={900} height={1157} loading="lazy" alt="Carl Gustav Jung standing outside a building, about 1910" />
        <figcaption className="small">C. G. Jung around 1910, in the years he began working out the typology he published in 1921.</figcaption>
      </figure>
      <div className="lin-side">
        <h2 id="lin-h" className="head reveal">A century of noticing patterns</h2>
        <p className="lead serif reveal">
          Jung’s eight types came from years of watching how differently people take in the same world. Myers made them practical, Thomson made them vivid, Beebe gave each a character.
        </p>
        <div className="lin-grid">
          <figure className="reveal">
            <img src={IMG('burgholzli.jpg')} width={1600} height={733} loading="lazy" alt="Engraving of the Burghölzli clinic in Zurich among trees" />
            <figcaption className="small">The Burghölzli clinic in Zurich, where Jung worked from 1900 to 1909.</figcaption>
          </figure>
          <figure className="reveal">
            <img src={IMG('celestial-1730.jpg')} width={1800} height={1532} loading="lazy" alt="Hand-coloured 1730 star chart with constellation figures" />
            <figcaption className="small">Doppelmayr’s star chart, 1730: scattered points grouped into patterns we can name.</figcaption>
          </figure>
          <figure className="reveal">
            <img src={IMG('medieval-music.jpg')} width={1600} height={1059} loading="lazy" alt="Worn medieval chant manuscript with red and black notation" />
            <figcaption className="small">Medieval chant was sorted into eight modes. Octanoia borrows the idea: eight notes, one voice.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

/* ───────── Questions ───────── */
const FAQ: [string, string][] = [
  ['Is this the MBTI?', 'No. The MBTI is a licensed instrument that sorts four preferences. Octanoia measures all eight cognitive functions separately, then shows which of the sixteen type patterns your scores resemble, and how closely.'],
  ['Is it scientific?', 'It is grounded in the classic type literature and its arithmetic is fully published, but it has not been validated as a psychometric instrument. Treat it as a structured mirror for reflection, not a diagnosis.'],
  ['How long does it take?', 'The quick test has 64 scenes and takes about 12 minutes. The deep test has 160, including questions about how you react under pressure, and takes around 30. Your progress is saved if you leave.'],
  ['Will my results be saved?', 'They are saved in this browser only. Clearing your browsing data, using a private window or switching devices will erase them, so download a copy from your results or profile. Sign-in with Google, to keep them in a private profile, is coming.'],
  ['Why might my result change?', 'Life changes how we answer. A new job, a new relationship or a hard year can blur the picture. Octanoia keeps your history so you can watch your notes shift over time.'],
  ['Why do I get several types?', 'Because people are not boxes. You see your three closest patterns with a fit score for each. When two are nearly tied, Octanoia names the notes that decide between them and offers a short follow-up.'],
  ['How is it different from other function tests?', 'Questions are scenes instead of flat claims, nothing rewards answering “yes” to everything, and every one of your eight scores shows its working: which answers moved it and why.'],
]

function Faq() {
  return (
    <section className="wrap faq" aria-labelledby="faq-h">
      <h2 id="faq-h" className="head faq-h">Questions</h2>
      <div className="faq-list">
        {FAQ.map(([q, a]) => (
          <details key={q} name="faq" className="reveal">
            <summary>
              <span>{q}</span>
              <span className="plus" aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ───────── Close: begin ───────── */
function Cta() {
  const [mode, setMode] = useState<'quick' | 'deep'>('quick')
  const nav = useNavigate()
  return (
    <section className="cta on-night" aria-labelledby="cta-h">
      <div className="wrap cta-grid">
        <div className="cta-copy">
          <h2 id="cta-h" className="display">Hear your eight notes</h2>
          <p className="lead serif">Your eight scores, your closest patterns, and the reasons behind every number.</p>
          <div className="cta-dialog" data-ui role="group" aria-label="Start the test">
            <div className="segmented" role="radiogroup" aria-label="Test length">
              <button type="button" role="radio" aria-checked={mode === 'quick'} className={mode === 'quick' ? 'is-on' : ''} onClick={() => setMode('quick')}>Quick · 64 scenes</button>
              <button type="button" role="radio" aria-checked={mode === 'deep'} className={mode === 'deep' ? 'is-on' : ''} onClick={() => setMode('deep')}>Deep · 160 scenes</button>
            </div>
            <p className="small muted">{mode === 'quick' ? 'About 12 minutes. Good for a first look.' : 'About 30 minutes. Sharper results, plus how you react under pressure.'}</p>
            <button type="button" className="btn btn-lg btn-light" onClick={() => nav(`/test/${mode}`)}>Begin</button>
          </div>
        </div>
        <div className="cta-stage">
          <Constellation scores={sampleAnalysis().scores} height="100%" label="A sample constellation of eight notes" />
        </div>
      </div>
    </section>
  )
}

function Credits() {
  return (
    <p className="wrap small credits">
      Pictures: <a href="https://commons.wikimedia.org/wiki/File:Jung_1910.jpg">“Jung 1910”</a>, public domain; <a href="https://commons.wikimedia.org/wiki/File:Burgh%C3%B6lzli_Stich.jpg">“Burghölzli Stich”</a>, public domain;{' '}
      <a href="https://commons.wikimedia.org/wiki/File:1730_celestial_chart_-_Globi_Coelestis_In_Tabulas_Planas_Redacti_Pars_V.jpg">“Globi Coelestis In Tabulas Planas Redacti Pars V”</a> by Johann Gabriel Doppelmayr, public domain;{' '}
      <a href="https://commons.wikimedia.org/wiki/File:Medieval_music_Wellcome_V0049615.jpg">“Medieval music”</a>, Wellcome Collection, <a href="https://creativecommons.org/licenses/by/4.0">CC BY 4.0</a>. All via Wikimedia Commons.
    </p>
  )
}
