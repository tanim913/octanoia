import { Footer, NoteChip, TopBar } from '../../components/Shell'
import { ROLES } from '../../engine/types16'
import Constellation from '../../scenes/Constellation'
import './library.css'

const SECTIONS: { title: string; body: string[]; quote?: [string, string] }[] = [
  {
    title: 'Taking in and deciding',
    body: [
      'Sensing and Intuition are ways of perceiving. Sensing takes in what is actually there; Intuition takes in patterns, meanings and possibilities. Jung called these “irrational” because they simply register what is given, without judging it.',
      'Thinking and Feeling are ways of judging. Thinking decides by impersonal logic; Feeling decides by worth, meaning what matters and to whom. Feeling is a rational process, not an emotion.',
    ],
    quote: ['Feeling, I tell my audiences, is the function that sorts out feelings.', 'John Beebe, Energies and Patterns, ch.2'],
  },
  {
    title: 'Outward and inward',
    body: [
      'Each function can be extraverted or introverted. Jung’s test is not sociability but where the deciding reference comes from: the outer situation and shared standards, or an inner model, memory or ideal.',
      'That is why a quiet person can lead with an extraverted function, and a talkative one with an introverted function.',
    ],
    quote: ['Extraversion is … when the most frequent and essential decisions and actions are determined, not by subjective values but by objective relations.', 'Jung, Psychological Types, p.417'],
  },
  {
    title: 'Opposites share an axis',
    body: [
      'The eight notes form four axes of opposites: Ni with Se, Ne with Si, Ti with Fe and Te with Fi. On the constellation they sit directly across from each other.',
      'You can’t use both ends of an axis in the same moment, so the more you lean on one, the less practised the other tends to be.',
    ],
  },
  {
    title: 'A leader and a helper',
    body: [
      'Most people develop one function most fully, their dominant, and a second one to balance it, the auxiliary. One takes in, the other decides; one faces outward, the other inward.',
      'For introverts the dominant works inside, so what others meet first is usually the helper.',
    ],
    quote: ['An extreme perceptive with no judgment is all sail and no rudder.', 'Isabel Myers, Gifts Differing, p.11'],
  },
  {
    title: 'The weakest note',
    body: [
      'Opposite the dominant sits the inferior function: least practised, least under control, and often where our highest ideals live. Under stress it can burst out in a raw, exaggerated form.',
      'Lenore Thomson observes that real growth rarely comes from forcing the weakest note. It comes from developing the helper, which then lets the rest of the eight come into play.',
    ],
    quote: ['This feeling of being stuck is always the give-away.', 'Lenore Thomson, Personality Type, p.84'],
  },
  {
    title: 'A spectrum, not a box',
    body: [
      'No one is a pure type. Life events, culture and relationships all change how strongly each note shows, and how you answer a questionnaire on a given day.',
      'Octanoia gives you ranked fits with their reasons so you can judge for yourself. The final judge of your type is you.',
    ],
    quote: ['There can never occur a pure type in the sense that he is entirely possessed of the one mechanism with a complete atrophy of the other.', 'Jung, Psychological Types, p.13'],
  },
]

export default function ConceptsPage() {
  return (
    <div>
      <TopBar />
      <main className="wrap concepts">
        <header className="concepts-head">
          <h1 className="display">How the notes work together</h1>
          <div className="concepts-stage">
            <Constellation scores={{ Se: 62, Te: 55, Ne: 60, Fe: 58, Ni: 62, Fi: 58, Si: 60, Ti: 55 }} height={380} label="The eight notes arranged with opposites facing each other" />
            <p className="small muted">Extraverted notes across the top, introverted below. Opposites face each other across the centre.</p>
          </div>
        </header>
        {SECTIONS.map((s) => (
          <section key={s.title} className="concept">
            <h2 className="head">{s.title}</h2>
            <div className="concept-body">
              {s.body.map((b) => <p key={b} className="lead">{b}</p>)}
              {s.quote && (
                <blockquote>
                  <p>“{s.quote[0]}”</p>
                  <cite className="small muted">{s.quote[1]}</cite>
                </blockquote>
              )}
            </div>
          </section>
        ))}
        <section className="concept">
          <h2 className="head">A cast of eight characters</h2>
          <div className="concept-body">
            <p className="lead">
              John Beebe gave each position in a type its own character. The first four are parts of us we tend to own; the last four mostly appear when we feel challenged, as defences.
            </p>
            <ol className="role-grid">
              {ROLES.map((r, i) => (
                <li key={r.key} className={i >= 4 ? 'shadow' : ''}>
                  <span className="lead">{r.name}</span>
                  <span className="small muted">Area of {r.area}</span>
                  <span className="small">{r.does}</span>
                </li>
              ))}
            </ol>
            <p className="small muted">
              Example: an INFJ’s hero is <NoteChip fn="Ni" />, its good parent <NoteChip fn="Fe" />, its eternal child <NoteChip fn="Ti" /> and its inner guide <NoteChip fn="Se" />.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
