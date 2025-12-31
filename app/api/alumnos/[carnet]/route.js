import { NextResponse } from 'next/server'
import { getAlumnoByCarnet, updateAlumno, deleteAlumno } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const alumno = getAlumnoByCarnet(params.carnet)
    if (!alumno) {
      return NextResponse.json({ success: false, error: 'Alumno no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ success: true, alumno })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const updates = await request.json()
    const alumno = updateAlumno(params.carnet, updates)
    if (!alumno) {
      return NextResponse.json({ success: false, error: 'Alumno no encontrado' }, { status: 404 })
    }
    return NextResponse.json({ success: true, alumno })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    deleteAlumno(params.carnet)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
