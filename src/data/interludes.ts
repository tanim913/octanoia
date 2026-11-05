import type { ChapterId } from '../engine/model'

export interface Interlude {
  after: ChapterId
  title: string
  body: string[]
  quote?: { text: string; source: string }
}

// Short teaching cards between chapters. They teach concepts,
// never which question measures which function.
export const INTERLUDES: Interlude[] = [
  {
    after: 'new-place',
    title: 'Everyone plays all eight notes',
    body: [
      'Octanoia measures eight ways the mind works, called cognitive functions. You use every one of them. What differs between people is which notes you return to naturally, and which ones take effort.',
      'Think of handedness: you can write with either hand, but one feels like you.',
    ],
    quote: { text: 'The natural preference remains, like right- or left-handedness.', source: 'Isabel Myers, Gifts Differing, p.7' },
  },
  {
    after: 'making',
    title: 'Taking in, and deciding',
    body: [
      'Four of the notes are about taking in information: through the senses (Sensing) or through patterns and possibilities (Intuition).',
      'The other four are about deciding what to do with it: by impersonal logic (Thinking) or by what matters and to whom (Feeling). Feeling here is a way of judging. It doesn’t mean being emotional.',
    ],
    quote: { text: 'Sensation tells us that a thing is. Thinking tells us what the thing is, feeling tells us what it is worth to us.', source: 'Jung, quoted by Beebe, ch.10' },
  },
  {
    after: 'people',
    title: 'Outward and inward',
    body: [
      'Each of the four comes in two attitudes. Extraverted versions take their cue from the world outside: the situation, other people, shared standards. Introverted versions take their cue from an inner reference: memory, an inner model, a private ideal.',
      'This isn’t about being outgoing or shy. A quiet person can lead with an extraverted function.',
    ],
    quote: { text: 'Introverted consciousness doubtless views the external conditions, but it selects the subjective determinants as the decisive ones.', source: 'Jung, Psychological Types, p.472' },
  },
  {
    after: 'deciding',
    title: 'Opposites on one axis',
    body: [
      'Some notes sit on the same axis as opposites, like Introverted Intuition and Extraverted Sensing. You can’t lean on both at the same moment, so a strong pull toward one usually means the other is harder to reach.',
      'That is why your results show axes as well as single scores.',
    ],
    quote: { text: 'Whenever we employ a function or attitude, we are axiomatically choosing against its opposite.', source: 'Lenore Thomson, Personality Type, p.25' },
  },
  {
    after: 'meaning',
    title: 'A captain and a first mate',
    body: [
      'Most people have one leading function and a second one that supports it, usually facing the other way: if the leader works inwardly, the helper works outwardly.',
      'For introverts, the leader is often hidden. People mostly meet the helper.',
    ],
    quote: { text: 'In the introvert the General is inside the tent … It is the Aide whom others meet.', source: 'Isabel Myers, Gifts Differing, p.13' },
  },
  {
    after: 'going-wrong',
    title: 'The note that slips under stress',
    body: [
      'Your least developed function doesn’t disappear. Under pressure it tends to burst out in a raw, unfamiliar form: the careful planner who suddenly catastrophises, the logical mind swamped by hurt feelings.',
      'Noticing this pattern is one of the most useful things type can teach.',
    ],
    quote: { text: 'The shadow is something that happens when a person isn’t looking.', source: 'Isabel Myers, Gifts Differing, p.84' },
  },
  {
    after: 'time-off',
    title: 'A snapshot, not a box',
    body: [
      'No one is a pure type. Your answers today reflect your life right now: a new job, a relationship or a big change can blur the picture, and that is normal.',
      'Octanoia will show you ranked fits and exactly how each score was formed. You decide what fits.',
    ],
    quote: { text: 'Type theory … is a description of, not a prescription for, human behavior.', source: 'Lenore Thomson, Personality Type, p.11' },
  },
]
