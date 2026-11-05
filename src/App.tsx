import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import Landing from './features/landing/Landing'
import { AuthReturn } from './features/profile/AuthReturn'
import { FormsCanvas } from './three/Stage'
import { PaintField } from './three/PaintField'
import { scrollToTarget, startSmoothScroll } from './lib/smooth'

const TestPage = lazy(() => import('./features/test/TestPage'))
const ResultsPage = lazy(() => import('./features/results/ResultsPage'))
const LibraryIndex = lazy(() => import('./features/library/LibraryIndex'))
const FunctionPage = lazy(() => import('./features/library/FunctionPage'))
const ConceptsPage = lazy(() => import('./features/library/ConceptsPage'))
const SourcesPage = lazy(() => import('./features/library/SourcesPage'))
const ScoringPage = lazy(() => import('./features/library/ScoringPage'))
const PrivacyPage = lazy(() => import('./features/library/PrivacyPage'))
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'))
const ReadIndex = lazy(() => import('./features/read/ReadPages').then((m) => ({ default: m.ReadIndex })))
const ReadChapter = lazy(() => import('./features/read/ReadPages').then((m) => ({ default: m.ReadChapter })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    scrollToTarget(0, { immediate: true })
  }, [pathname])
  return null
}

export default function App() {
  useEffect(() => {
    startSmoothScroll()
  }, [])
  return (
    <HashRouter>
      <ScrollToTop />
      <AuthReturn />
      <PaintField />
      <FormsCanvas />
      <Suspense fallback={<div className="wrap" style={{ padding: '30vh 0' }} />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/test/:mode" element={<TestPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
          <Route path="/library" element={<LibraryIndex />} />
          <Route path="/library/concepts" element={<ConceptsPage />} />
          <Route path="/library/sources" element={<SourcesPage />} />
          <Route path="/library/:fn" element={<FunctionPage />} />
          <Route path="/how-scoring-works" element={<ScoringPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/read" element={<ReadIndex />} />
          <Route path="/read/:slug" element={<ReadChapter />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}
