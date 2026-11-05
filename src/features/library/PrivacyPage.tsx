import { Link } from 'react-router-dom'
import { Footer, TopBar } from '../../components/Shell'
import './library.css'

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: 'Taking the test without signing in',
    p: [
      'You can take every test and read every result without an account. Your answers and results stay in your browser’s local storage on this device. Nothing about them is sent anywhere.',
      'Clearing your browser data removes them. You can download a copy from your profile page at any time.',
    ],
  },
  {
    h: 'Signing in with Google',
    p: [
      'Signing in is optional. It lets you keep results across devices. Google tells us your name, email address and profile picture. We use your name to greet you on your profile. We never show your details to other people, and there is nothing on Octanoia that other people can see.',
    ],
  },
  {
    h: 'What we store when you save a result',
    p: [
      'Your answers to each question, your eight scores, the type pattern that fit best, which test you took and when. Only you can read these rows. The database enforces that rule itself, so it holds even if someone tampers with the website.',
      'Accounts and results are stored with Supabase, our database host. Sign-in goes through Google. We don’t use analytics, advertising or tracking cookies, and we never sell or share your data. The site’s fonts load from Google Fonts, which, like any web server, sees the address your request comes from.',
    ],
  },
  {
    h: 'Deleting your data',
    p: [
      'On your profile you can remove any single result, or delete your whole account. Deleting the account removes your profile and every result saved to it straight away. Results kept on this device are left alone; clear them by clearing your browser data.',
    ],
  },
  {
    h: 'What this test is',
    p: [
      'Octanoia is a tool for self-reflection, not a psychological or medical assessment. Please don’t use its results for hiring, diagnosis or any decision about another person.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div>
      <TopBar />
      <main className="wrap sources privacy">
        <header>
          <h1 className="display">Privacy</h1>
          <p className="lead sources-sub">What we keep, and why. Last updated 6 November 2026.</p>
        </header>
        <div className="privacy-body">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="lead">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </section>
          ))}
          <section>
            <h2 className="lead">Questions</h2>
            <p>
              Open an issue on the{' '}
              <a href="https://github.com/tanim913/octanoia/issues" target="_blank" rel="noopener noreferrer">
                project’s GitHub page
              </a>
              . You can see exactly how scoring works on <Link to="/how-scoring-works">the scoring page</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
