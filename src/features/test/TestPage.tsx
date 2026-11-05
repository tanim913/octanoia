import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Question } from '../../components/Question'
import { Wordmark } from '../../components/Shell'
import { INTERLUDES } from '../../data/interludes'
import { CHAPTERS, ITEM_BY_ID, itemsFor } from '../../data/items'
import { TEST_VERSION } from '../../engine/model'
import { analyze } from '../../lib/analysis'
import { newId, saveResult, type RunMode } from '../../lib/storage'
import { useTest } from '../../lib/testStore'
import Constellation from '../../scenes/Constellation'
import './test.css'

export default function TestPage() {
  const { mode: param } = useParams()
  const mode = (param === 'deep' || param === 'sharpen' ? param : 'quick') as RunMode
  const t = useTest()
  const nav = useNavigate()
  const timer = useRef<number | undefined>(undefined)

  // Start or resume.
  useEffect(() => {
    if (mode === 'sharpen') return
    if (t.mode !== mode || t.itemIds.length === 0) t.start(mode, itemsFor(mode).map((i) => i.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const items = useMemo(() => t.itemIds.map((id) => ITEM_BY_ID[id]).filter(Boolean), [t.itemIds])
  const item = items[t.index]
  const answeredCount = Object.keys(t.answers).length
  const progress = items.length ? answeredCount / items.length : 0

  const finish = useCallback(() => {
    const s = useTest.getState()
    const answers = { ...s.baseAnswers, ...s.answers }
    const a = analyze(answers)
    const id = newId()
    saveResult({
      id,
      createdAt: new Date().toISOString(),
      testVersion: TEST_VERSION,
      mode: s.mode ?? mode,
      answers,
      scores: a.scores,
      topType: a.fit.ranked[0].code,
    })
    s.reset()
    nav(`/results/${id}`)
  }, [mode, nav])

  const advance = useCallback(() => {
    const s = useTest.getState()
    const cur = ITEM_BY_ID[s.itemIds[s.index]]
    const next = ITEM_BY_ID[s.itemIds[s.index + 1]]
    if (!next) return finish()
    if (s.mode !== 'sharpen' && next.chapter !== cur.chapter && INTERLUDES.some((i) => i.after === cur.chapter)) {
      s.setInterlude(cur.chapter)
    }
    s.go(s.index + 1)
  }, [finish])

  const onAnswer = useCallback(
    (v: number) => {
      if (!item) return
      t.answer(item.id, v)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(advance, 260)
    },
    [item, t, advance],
  )

  if (mode === 'sharpen' && t.mode !== 'sharpen') return <Navigate to="/profile" replace />
  if (!item) return null

  const chapter = CHAPTERS.find((c) => c.id === item.chapter)!
  const interlude = t.interlude ? INTERLUDES.find((i) => i.after === t.interlude) : null
  const chapterIdx = CHAPTERS.findIndex((c) => c.id === item.chapter)

  return (
    <div className="test">
      <header className="test-bar wrap">
        <Wordmark />
        <div className="test-meta small">
          <span className="tnum">
            {answeredCount} of {items.length} answered
          </span>
          <button type="button" className="link" onClick={() => { t.reset(); nav('/') }}>
            Leave and discard
          </button>
        </div>
      </header>
      <div className="test-progress" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>

      <main className="test-grid wrap">
        <section className="test-main" aria-live="polite">
          {interlude ? (
            <div className="interlude rise" key={interlude.after}>
              <h1 className="head">{interlude.title}</h1>
              {interlude.body.map((p) => (
                <p key={p} className="interlude-p">{p}</p>
              ))}
              {interlude.quote && (
                <blockquote className="interlude-q">
                  <p>“{interlude.quote.text}”</p>
                  <cite className="small muted">{interlude.quote.source}</cite>
                </blockquote>
              )}
              <button type="button" className="btn" onClick={() => t.setInterlude(null)} autoFocus>
                Continue to {chapter.title}
              </button>
            </div>
          ) : (
            <div key={item.id} className="rise">
              <div className="chapter-head">
                <h1 className="lead">
                  {mode === 'sharpen' ? 'Sharpening your result' : chapter.title}
                </h1>
                <p className="small muted">{mode === 'sharpen' ? 'A few extra scenes on the notes that decide between your closest patterns.' : chapter.blurb}</p>
              </div>
              <Question item={item} value={t.answers[item.id]} onAnswer={onAnswer} />
              <div className="test-nav">
                <button type="button" className="btn btn-quiet" disabled={t.index === 0} onClick={() => t.go(Math.max(0, t.index - 1))}>
                  Back
                </button>
                {t.answers[item.id] !== undefined && (
                  <button type="button" className="btn btn-quiet" onClick={advance}>
                    Next
                  </button>
                )}
                <p className="small muted keys">
                  Keys: {item.kind === 'likert' ? '1 to 5' : 'A to D'}
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="test-stage" aria-label="Your constellation forming">
          <Constellation scores={null} progress={progress} height="100%" label="Your constellation forms as you answer. Scores are revealed at the end." />
          <ol className="chapter-dots" aria-label="Chapters">
            {CHAPTERS.map((c, i) => (
              <li key={c.id} className={i < chapterIdx ? 'done' : i === chapterIdx ? 'now' : ''}>
                <span className="sr-only">{c.title}</span>
              </li>
            ))}
          </ol>
          <p className="small stage-note">Your notes stay hidden until the end, so they can’t nudge your answers.</p>
        </aside>
      </main>
      <p className="wrap small muted test-foot">
        Progress saves automatically. <Link to="/library">Read about the eight notes</Link> any time.
      </p>
    </div>
  )
}
