import { NextResponse } from 'next/server'
import { registrarPago } from '@/lib/db'

export async function POST(request, { params }) {
  try {
    const body = await request.json()
    const { mes, año, metodoPago } = body
    
    if (!mes || !año || !metodoPago) {
      return NextResponse.json({ success: false, error: 'Mes, año y método de pago son requeridos' }, { status: 400 })
    }
    
    const alumno = registrarPago(params.carnet, mes, año, metodoPago)
    if (!alumno) {
      return NextResponse.json({ success: false, error: 'Alumno no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ success: true, alumno })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
