import { ALL_ITEMS } from '../data/items'
import type { Answers, Fn } from '../engine/model'
import { scoreAnswers, type ScoreResult } from '../engine/score'
import { fitTypes, scoresOf, type FitResult } from '../engine/typeFit'

export interface Analysis {
  score: ScoreResult
  fit: FitResult
  scores: Record<Fn, number>
  hasStress: boolean
}

export function analyze(answers: Answers): Analysis {
  const score = scoreAnswers(ALL_ITEMS, answers)
  const scores = scoresOf(score.scores)
  const hasStress = ALL_ITEMS.some((i) => i.facet === 'stress' && answers[i.id] !== undefined)
  const fit = fitTypes(scores, hasStress ? scoresOf(score.stress) : undefined)
  return { score, fit, scores, hasStress }
}
