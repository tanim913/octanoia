import { useEffect } from 'react'
import { LIKERT_LABELS, type ChoiceItem, type Item, type LikertItem } from '../engine/model'

const LETTERS = ['A', 'B', 'C', 'D']

export function Question({
  item,
  value,
  onAnswer,
  keyboard = true,
  night = false,
}: {
  item: Item
  value: number | undefined
  onAnswer: (v: number) => void
  keyboard?: boolean
  night?: boolean
}) {
  useEffect(() => {
    if (!keyboard) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (item.kind === 'likert' && /^[1-5]$/.test(e.key)) onAnswer(Number(e.key) - 3)
      if (item.kind === 'choice') {
        const i = LETTERS.indexOf(e.key.toUpperCase())
        if (i >= 0 && i < item.options.length) onAnswer(i)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, onAnswer, keyboard])

  return item.kind === 'likert' ? (
    <Likert item={item} value={value} onAnswer={onAnswer} night={night} />
  ) : (
    <Choice item={item} value={value} onAnswer={onAnswer} night={night} />
  )
}

function Likert({ item, value, onAnswer, night }: { item: LikertItem; value?: number; onAnswer: (v: number) => void; night: boolean }) {
  return (
    <fieldset className={`q q-likert${night ? ' q-night' : ''}`} data-ui>
      <legend className="q-text">{item.text}</legend>
      <div className="likert" role="radiogroup" aria-label="How much is this like you?">
        {LIKERT_LABELS.map((label, i) => {
          const v = i - 2
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={value === v}
              className={`likert-opt${value === v ? ' is-on' : ''}`}
              onClick={() => onAnswer(v)}
            >
              <span className="likert-dot" style={{ ['--s' as string]: 0.55 + Math.abs(v) * 0.22 }} aria-hidden="true" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function Choice({ item, value, onAnswer, night }: { item: ChoiceItem; value?: number; onAnswer: (v: number) => void; night: boolean }) {
  return (
    <fieldset className={`q q-choice${night ? ' q-night' : ''}`} data-ui>
      <legend className="q-text">{item.text}</legend>
      <div className="choices" role="radiogroup" aria-label="Pick the one most like you">
        {item.options.map((o, i) => (
          <button
            key={o.text}
            type="button"
            role="radio"
            aria-checked={value === i}
            className={`choice-opt${value === i ? ' is-on' : ''}`}
            onClick={() => onAnswer(i)}
          >
            <span className="choice-key" aria-hidden="true">{LETTERS[i]}</span>
            <span>{o.text}</span>
          </button>
        ))}
      </div>
      <button type="button" className={`link small none-fit${value === -1 ? ' is-on' : ''}`} onClick={() => onAnswer(-1)}>
        None of these fit me
      </button>
    </fieldset>
  )
}
