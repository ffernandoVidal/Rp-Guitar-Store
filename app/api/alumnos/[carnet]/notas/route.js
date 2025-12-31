import { NextResponse } from 'next/server'
import { actualizarNotas } from '@/lib/db'

export async function POST(request, { params }) {
  try {
    const { nivel, notaInstrumento, notaArmonia } = await request.json()
    
    const alumno = actualizarNotas(
      params.carnet,
      parseInt(nivel),
      parseInt(notaInstrumento),
      parseInt(notaArmonia)
    )
    
    if (!alumno) {
      return NextResponse.json({ success: false, error: 'Alumno no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, alumno })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
