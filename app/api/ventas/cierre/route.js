import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { fecha, ventas, totales, nombreReporte } = body

    // Devolver los datos como JSON para que el cliente genere el PDF
    return NextResponse.json({
      success: true,
      data: {
        fecha,
        ventas,
        totales,
        nombreReporte,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error en cierre de caja:', error)
    return NextResponse.json(
      { error: 'Error al procesar el cierre de caja' },
      { status: 500 }
    )
  }
}
