import { Suspense } from 'react'
import BuscarClient from './BuscarClient'

export default function BuscarPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Cargando búsqueda...</div>}>
      <BuscarClient />
    </Suspense>
  )
}
