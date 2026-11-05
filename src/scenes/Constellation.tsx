import { lazy, Suspense } from 'react'
import ConstellationFlat from './ConstellationFlat'
import { THREE_ON } from '../three/Stage'
import type { ConstellationProps } from './layout'

const Constellation3D = lazy(() => import('./Constellation3D'))

export default function Constellation(props: ConstellationProps) {
  if (!THREE_ON) return <ConstellationFlat {...props} />
  return (
    <Suspense fallback={<ConstellationFlat {...props} />}>
      <Constellation3D {...props} />
    </Suspense>
  )
}
