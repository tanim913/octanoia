import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Answers } from '../engine/model'
import type { RunMode } from './storage'

interface TestState {
  mode: RunMode | null
  /** Ordered item ids for this run. */
  itemIds: string[]
  /** Answers carried over (e.g. Sharpen builds on a previous result). */
  baseAnswers: Answers
  answers: Answers
  index: number
  /** Chapter whose interlude is being shown, if any. */
  interlude: string | null
  start: (mode: RunMode, itemIds: string[], baseAnswers?: Answers) => void
  answer: (id: string, value: number) => void
  go: (index: number) => void
  setInterlude: (c: string | null) => void
  reset: () => void
}

export const useTest = create<TestState>()(
  persist(
    (set) => ({
      mode: null,
      itemIds: [],
      baseAnswers: {},
      answers: {},
      index: 0,
      interlude: null,
      start: (mode, itemIds, baseAnswers = {}) =>
        set({ mode, itemIds, baseAnswers, answers: {}, index: 0, interlude: null }),
      answer: (id, value) => set((s) => ({ answers: { ...s.answers, [id]: value } })),
      go: (index) => set({ index }),
      setInterlude: (interlude) => set({ interlude }),
      reset: () => set({ mode: null, itemIds: [], baseAnswers: {}, answers: {}, index: 0, interlude: null }),
    }),
    { name: 'octanoia.progress.v1' },
  ),
)
