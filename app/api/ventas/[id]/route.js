import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const VENTAS_PATH = path.join(process.cwd(), 'data', 'ventas.json')

function readVentas() {
  const data = fs.readFileSync(VENTAS_PATH, 'utf-8')
  return JSON.parse(data)
}

function writeVentas(data) {
  fs.writeFileSync(VENTAS_PATH, JSON.stringify(data, null, 2))
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)
    const data = readVentas()
    
    data.ventas = data.ventas.filter(v => v.id !== id)
    
    writeVentas(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
