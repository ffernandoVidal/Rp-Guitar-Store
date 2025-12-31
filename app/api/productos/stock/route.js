import { verifyToken } from '@/lib/auth'
import { updateStock, restarStock, getProductoById } from '@/lib/db-productos'

// Middleware de autenticación
function requireAuth(handler) {
  return async (request) => {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return Response.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }
    
    return handler(request, decoded)
  }
}

// POST - Actualizar stock (requiere autenticación)
export const POST = requireAuth(async (request, user) => {
  try {
    const { id, cantidad, operacion } = await request.json()
    
    if (!id || cantidad === undefined) {
      return Response.json(
        { error: 'ID y cantidad son requeridos' },
        { status: 400 }
      )
    }
    
    let productoActualizado
    
    if (operacion === 'restar') {
      try {
        productoActualizado = restarStock(id, cantidad)
      } catch (error) {
        return Response.json(
          { error: error.message },
          { status: 400 }
        )
      }
    } else {
      // Por defecto, sumar stock
      productoActualizado = updateStock(id, cantidad)
    }
    
    if (!productoActualizado) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    return Response.json({
      success: true,
      producto: productoActualizado,
      message: `Stock ${operacion === 'restar' ? 'restado' : 'actualizado'} exitosamente`
    })
    
  } catch (error) {
    console.error('Error al actualizar stock:', error)
    return Response.json(
      { error: 'Error al actualizar stock' },
      { status: 500 }
    )
  }
})

// GET - Obtener stock de un producto
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return Response.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      )
    }
    
    const producto = getProductoById(id)
    
    if (!producto) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    return Response.json({
      id: producto.id,
      nombre: producto.nombre,
      stock: producto.stock
    })
    
  } catch (error) {
    console.error('Error al obtener stock:', error)
    return Response.json(
      { error: 'Error al obtener stock' },
      { status: 500 }
    )
  }
}
