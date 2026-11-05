import { Footer, TopBar } from '../../components/Shell'
import './library.css'

const BOOKS = [
  {
    title: 'Psychological Types',
    author: 'C. G. Jung',
    year: '1921; English translation by H. G. Baynes, 1923',
    used: 'The original definitions of the eight function-attitudes, the rational/irrational distinction, the dominant and inferior functions, and the warning that pure types do not exist. Page references are to the Baynes translation.',
  },
  {
    title: 'Gifts Differing: Understanding Personality Type',
    author: 'Isabel Briggs Myers with Peter B. Myers',
    year: '1980',
    used: 'The auxiliary function, good type development, preferences versus abilities, and the observation that people answer by what they think they should do rather than what they naturally do. Many everyday scenes draw on her chapters about work, learning and relationships.',
  },
  {
    title: 'Personality Type: An Owner’s Manual',
    author: 'Lenore Thomson',
    year: '1998',
    used: 'Rich, concrete descriptions of each function, the four axes of opposites, and the pattern of how each type gets stuck and grows through its helper function. Her brain-hemisphere model is mentioned only as a metaphor; it is not established neuroscience.',
  },
  {
    title: 'Energies and Patterns in Psychological Type',
    author: 'John Beebe',
    year: '2016',
    used: 'The eight-position model with archetypal roles (hero, parent, child, inner guide and four shadow roles), which shapes the type patterns, the cast of characters, and the questions about how functions feel to use.',
  },
]

export default function SourcesPage() {
  return (
    <div>
      <TopBar />
      <main className="wrap sources">
        <header>
          <h1 className="display">Sources</h1>
          <p className="lead sources-sub">
            Every question in Octanoia cites the passages it was built from. All descriptions on this site are written in our own words; short quotations are credited where they appear.
          </p>
        </header>
        <ol className="book-list">
          {BOOKS.map((b) => (
            <li key={b.title}>
              <h2 className="head">{b.title}</h2>
              <p className="lead">{b.author} · {b.year}</p>
              <p className="muted">{b.used}</p>
            </li>
          ))}
        </ol>
        <section className="sources-note panel">
          <h2 className="lead">What Octanoia is not</h2>
          <p>
            Octanoia is not the Myers-Briggs Type Indicator® and is not affiliated with its publisher or with any of these authors. It has not been validated as a psychometric instrument. Use it for reflection and conversation, not for hiring, diagnosis or decisions about other people.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
