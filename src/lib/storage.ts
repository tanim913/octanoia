import { FUNCTIONS, type Answers, type Fn } from '../engine/model'

export type RunMode = 'quick' | 'deep' | 'sharpen'

export interface StoredResult {
  id: string
  createdAt: string
  testVersion: string
  mode: RunMode
  answers: Answers
  /** Snapshot for history charts; always re-derivable from answers. */
  scores: Record<Fn, number>
  topType: string
  /** Set once saved to the user's Supabase profile. */
  remoteId?: string
}

const RESULTS_KEY = 'octanoia.results.v1'

// One-time move of results saved before the rename from “Octave”.
const LEGACY_KEY = 'octave.results.v1'
if (typeof localStorage !== 'undefined' && !localStorage.getItem(RESULTS_KEY) && localStorage.getItem(LEGACY_KEY)) {
  localStorage.setItem(RESULTS_KEY, localStorage.getItem(LEGACY_KEY)!)
  localStorage.removeItem(LEGACY_KEY)
}

export function loadResults(): StoredResult[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.map(sanitizeResult).filter((r): r is StoredResult => r !== null) : []
  } catch {
    return []
  }
}

const MODES: RunMode[] = ['quick', 'deep', 'sharpen']
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/**
 * Checks a result that came from outside the app (an imported file, the server, old storage)
 * and returns a clean copy, or null if it isn't a real result. Only known fields survive.
 */
export function sanitizeResult(raw: unknown): StoredResult | null {
  if (!isObj(raw)) return null
  const { id, createdAt, testVersion, mode, answers, scores, topType, remoteId } = raw
  if (typeof id !== 'string' || !/^[\w-]{1,64}$/.test(id)) return null
  if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) return null
  if (typeof testVersion !== 'string' || !/^[a-z0-9.-]{1,32}$/.test(testVersion)) return null
  if (typeof mode !== 'string' || !MODES.includes(mode as RunMode)) return null
  if (!isObj(answers) || !isObj(scores)) return null

  const cleanAnswers: Answers = {}
  const entries = Object.entries(answers)
  if (entries.length > 400) return null
  for (const [k, v] of entries) {
    if (!/^[\w.-]{1,40}$/.test(k) || typeof v !== 'number' || !Number.isInteger(v) || v < -2 || v > 10) return null
    cleanAnswers[k] = v
  }
  const cleanScores = {} as Record<Fn, number>
  for (const f of FUNCTIONS) {
    const v = scores[f]
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 100) return null
    cleanScores[f] = v
  }
  return {
    id,
    createdAt: new Date(Math.min(Date.parse(createdAt), Date.now())).toISOString(),
    testVersion,
    mode: mode as RunMode,
    answers: cleanAnswers,
    scores: cleanScores,
    topType: typeof topType === 'string' && /^[EI][NS][FT][JP]$/.test(topType) ? topType : '',
    remoteId: typeof remoteId === 'string' && /^[\w-]{1,64}$/.test(remoteId) ? remoteId : undefined,
  }
}

export function saveResult(r: StoredResult) {
  const all = loadResults().filter((x) => x.id !== r.id)
  all.unshift(r)
  localStorage.setItem(RESULTS_KEY, JSON.stringify(all.slice(0, 50)))
}

export function getResult(id: string): StoredResult | undefined {
  return loadResults().find((r) => r.id === id)
}

export function deleteResult(id: string) {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(loadResults().filter((r) => r.id !== id)))
}

export function newId() {
  return (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)) as string
}

/** Download every local result as a JSON file the user can keep. */
export function exportResults(results = loadResults()) {
  const blob = new Blob([JSON.stringify({ app: 'octanoia', exportedAt: new Date().toISOString(), results }, null, 2)], {
    type: 'application/json',
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `octanoia-results-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

/** Merge results from an exported file. Returns how many were added. */
export async function importResults(file: File): Promise<number> {
  const notOurs = 'That file doesn’t look like an Octanoia export.'
  if (file.size > 2_000_000) throw new Error(notOurs)
  let data: unknown
  try {
    data = JSON.parse(await file.text())
  } catch {
    throw new Error(notOurs)
  }
  const incoming = Array.isArray(data) ? data : isObj(data) ? data.results : null
  if (!Array.isArray(incoming)) throw new Error(notOurs)
  const existing = new Set(loadResults().map((r) => r.id))
  let added = 0
  for (const raw of incoming.slice(0, 50)) {
    const r = sanitizeResult(raw)
    if (!r || existing.has(r.id)) continue
    // a copy from someone else's file was never saved to *this* person's profile
    saveResult({ ...r, remoteId: undefined })
    existing.add(r.id)
    added++
  }
  return added
}
