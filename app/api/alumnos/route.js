import { NextResponse } from 'next/server'
import { getAlumnos, addAlumno, verificarSolvencias } from '@/lib/db'

export async function GET() {
  try {
    // Verificar solvencias antes de devolver datos
    verificarSolvencias()
    const alumnos = getAlumnos()
    return NextResponse.json({ success: true, alumnos })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const nuevoAlumno = addAlumno(data)
    return NextResponse.json({ success: true, alumno: nuevoAlumno })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
