import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const ventasFilePath = path.join(process.cwd(), 'data', 'ventas.json')

function readVentas() {
  if (!fs.existsSync(ventasFilePath)) {
    const initialData = {
      ventas: [],
      cajas: [],
      nextId: 1,
      nextCajaId: 1
    }
    fs.writeFileSync(ventasFilePath, JSON.stringify(initialData, null, 2))
    return initialData
  }
  const data = fs.readFileSync(ventasFilePath, 'utf8')
  return JSON.parse(data)
}

function writeVentas(data) {
  fs.writeFileSync(ventasFilePath, JSON.stringify(data, null, 2))
}

// POST - Registrar dinero inicial en caja
export async function POST(request) {
  try {
    const body = await request.json()
    const { dineroInicial, fecha } = body

    if (dineroInicial === undefined || !fecha) {
      return NextResponse.json(
        { error: 'Dinero inicial y fecha son requeridos' },
        { status: 400 }
      )
    }

    const data = readVentas()
    
    // Asegurar que existe el array de cajas y nextCajaId
    if (!data.cajas) {
      data.cajas = []
    }
    if (!data.nextCajaId) {
      data.nextCajaId = 1
    }

    const nuevaCaja = {
      id: data.nextCajaId,
      dineroInicial: parseFloat(dineroInicial),
      fecha,
      fechaRegistro: new Date().toISOString()
    }

    data.cajas.push(nuevaCaja)
    data.nextCajaId += 1
    writeVentas(data)

    return NextResponse.json(nuevaCaja, { status: 201 })
  } catch (error) {
    console.error('Error al registrar caja:', error)
    return NextResponse.json(
      { error: 'Error al registrar dinero en caja' },
      { status: 500 }
    )
  }
}

// GET - Obtener registros de caja
export async function GET() {
  try {
    const data = readVentas()
    return NextResponse.json(data.cajas || [])
  } catch (error) {
    console.error('Error al obtener cajas:', error)
    return NextResponse.json(
      { error: 'Error al obtener registros de caja' },
      { status: 500 }
    )
  }
}
