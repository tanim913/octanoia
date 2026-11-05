// What a strong or quiet score means for each function, in plain words.
// Paraphrased from the four books; see knowledge/*.md for page references.
import type { Fn } from '../engine/model'

export interface Reading {
  /** When it rings clearly for you. */
  high: string
  /** When it is quiet for you. */
  low: string
  /** A gentle way to practise it, if you want to. */
  practise: string
}

export const READINGS: Record<Fn, Reading> = {
  Se: {
    high: 'You meet the world through direct contact. You notice what is happening around you as it happens, learn by doing, and feel most alive when you are fully engaged with something physical and present.',
    low: 'You rarely let the immediate physical moment lead. You would rather understand, plan or reflect first, and the raw sensory scene tends to be background rather than the main event. Many people with a quiet Se live largely in ideas, memories or values, and can lose track of their body until it insists.',
    practise: 'Do one ordinary thing slowly and fully, such as cooking, walking or a sport, paying attention only to what your senses report.',
  },
  Si: {
    high: 'You carry a rich, personal archive of experience and check new things against it. You notice when something differs from how it was, value what has proven reliable, and stay aware of your body’s comfort and limits.',
    low: 'You don’t lean much on past experience to steer the present. Routine can feel dull, details of how things were done before slip away, and you may ignore your body’s signals until it crashes. Your attention goes to what is new, possible or meaningful rather than to what has been.',
    practise: 'Keep a short note of what worked last time before you start something similar again.',
  },
  Ne: {
    high: 'You see what a situation could become. Ideas branch quickly for you, you connect things from unrelated places, and you are energised by possibilities and new starts more than by finishing.',
    low: 'You don’t naturally spin out alternatives. You prefer to work with what is known, proven or already decided, and a flood of “what ifs” feels more tiring than exciting. Under stress, a quiet Ne can turn into imagining everything that might go wrong.',
    practise: 'When you face a decision, write down three options you would normally dismiss, without judging them yet.',
  },
  Ni: {
    high: 'You sense the single pattern or direction beneath many details. Insights tend to arrive whole, you reframe problems rather than solving them as given, and you care about what things mean more than how they look.',
    low: 'You don’t tend to look for a hidden pattern or one deeper meaning. You take things more at face value, trust what you can see or reason out, and long chains of symbolism can feel vague. Under strain, a quiet Ni may show up as a sudden, ominous feeling that something bigger is wrong.',
    practise: 'After an important event, ask yourself what it might be the beginning of, and let the answer come slowly.',
  },
  Te: {
    high: 'You organise the world by clear, shared standards. You turn goals into steps, like evidence and results, apply the same rules to everyone, and get satisfaction from things that work and get done.',
    low: 'You don’t naturally run things by plans, metrics or rules. Structure imposed from outside can feel confining, and you would rather go by what feels right, what makes sense to you, or what the moment calls for. Under stress, a quiet Te can come out as sudden harsh criticism or frantic list-making.',
    practise: 'For one small goal, write the next three concrete steps and a date, then check them off.',
  },
  Ti: {
    high: 'You need things to make sense from the inside. You rebuild explanations in your own terms, hunt for the precise word or principle, and care whether an idea holds together more than whether it is popular.',
    low: 'You don’t feel a strong need to rebuild the logic for yourself. You are happy to use what works, follow trusted experts, or go by values and people’s needs. Under pressure, a quiet Ti can surface as cold, nit-picking judgment that surprises even you.',
    practise: 'Take one belief you hold and try to explain, in your own words, exactly why it is true.',
  },
  Fe: {
    high: 'You weigh what matters by its effect on the people and bonds around you. You read the mood of a room, adjust what you say to fit it, keep the small gestures that hold relationships together, and feel lighter when people get along.',
    low: 'You don’t naturally steer by the group’s mood or shared customs. Social rituals can feel hollow, and you would rather be accurate, independent or true to yourself than smooth things over. Under stress, a quiet Fe can show up as feeling unappreciated, or as feelings that suddenly spill out.',
    practise: 'In your next conversation, notice how the other person is feeling before you share your view.',
  },
  Fi: {
    high: 'You measure things against a deeply personal sense of what is right. You are flexible on most things and immovable on a few, show care quietly rather than in words, and need your work to mean something to you.',
    low: 'You don’t tend to decide by a private, inner standard of right and wrong. You go more by what is logical, effective or generally accepted, or by what keeps people together. Under strain, a quiet Fi may break out as a sudden, righteous moral stand, or as feeling that nobody values what you care about.',
    practise: 'Before agreeing to something, pause and ask: does this sit right with me, apart from what anyone expects?',
  },
}

export type Tier = { key: 'rings' | 'present' | 'quiet' | 'faint'; label: string }

export function tierOf(score: number): Tier {
  if (score >= 62) return { key: 'rings', label: 'Rings clearly' }
  if (score >= 50) return { key: 'present', label: 'Present' }
  if (score >= 38) return { key: 'quiet', label: 'Quiet' }
  return { key: 'faint', label: 'Faint' }
}
