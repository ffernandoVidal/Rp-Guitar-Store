import { getMarcas, createMarca, updateMarca, deleteMarca } from '@/lib/db-productos-mysql'
import { verifyToken } from '@/lib/auth'

// GET - Obtener todas las marcas
export async function GET() {
  try {
    const marcas = await getMarcas()
    return Response.json(marcas)
  } catch (error) {
    console.error('Error al obtener marcas:', error)
    return Response.json({ error: 'Error al obtener marcas' }, { status: 500 })
  }
}

// POST - Crear nueva marca (requiere autenticación)
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return Response.json({ error: 'Token inválido' }, { status: 401 })
    }
    
    const { nombre } = await request.json()
    
    if (!nombre || nombre.trim() === '') {
      return Response.json({ error: 'El nombre de la marca es requerido' }, { status: 400 })
    }
    
    const nuevaMarca = await createMarca(nombre.trim())
    return Response.json({ success: true, marca: nuevaMarca, message: 'Marca creada exitosamente' }, { status: 201 })
    
  } catch (error) {
    console.error('Error al crear marca:', error)
    return Response.json({ error: error.message || 'Error al crear marca' }, { status: 500 })
  }
}

// PUT - Actualizar marca (requiere autenticación)
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return Response.json({ error: 'Token inválido' }, { status: 401 })
    }
    
    const { id, nombre } = await request.json()
    
    if (!id || !nombre || nombre.trim() === '') {
      return Response.json({ error: 'ID y nombre son requeridos' }, { status: 400 })
    }
    
    const marcaActualizada = await updateMarca(id, nombre.trim())
    return Response.json({ success: true, marca: marcaActualizada, message: 'Marca actualizada exitosamente' })
    
  } catch (error) {
    console.error('Error al actualizar marca:', error)
    return Response.json({ error: error.message || 'Error al actualizar marca' }, { status: 500 })
  }
}

// DELETE - Eliminar marca (requiere autenticación)
export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return Response.json({ error: 'Token inválido' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return Response.json({ error: 'ID de marca requerido' }, { status: 400 })
    }
    
    await deleteMarca(id)
    return Response.json({ success: true, message: 'Marca eliminada exitosamente' })
    
  } catch (error) {
    console.error('Error al eliminar marca:', error)
    return Response.json({ error: error.message || 'Error al eliminar marca' }, { status: 500 })
  }
}
