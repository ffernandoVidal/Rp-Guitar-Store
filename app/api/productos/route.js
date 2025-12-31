import { verifyToken } from '@/lib/auth'
import { 
  getAllProductos, 
  getProductoById,
  getProductosByCategoria,
  createProducto,
  updateProducto,
  deleteProducto,
  updateStock,
  searchProductos
} from '@/lib/db-productos'

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

// GET - Obtener productos (público y admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const categoria = searchParams.get('categoria')
    const query = searchParams.get('q')
    const includePrivate = searchParams.get('includePrivate') === 'true'
    
    let productos
    
    if (id) {
      const producto = getProductoById(id)
      if (!producto) {
        return Response.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        )
      }
      
      // Si no incluye datos privados, remover precios mayoristas
      if (!includePrivate) {
        delete producto.precioMayorista
      }
      
      return Response.json(producto)
    }
    
    if (query) {
      productos = searchProductos(query)
    } else if (categoria) {
      productos = getProductosByCategoria(categoria)
    } else {
      productos = getAllProductos()
    }
    
    // Filtrar información privada para usuarios no admin
    if (!includePrivate) {
      productos = productos.map(p => {
        const { precioMayorista, ...publicData } = p
        return publicData
      })
    }
    
    return Response.json(productos)
    
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return Response.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear producto (requiere autenticación)
export const POST = requireAuth(async (request, user) => {
  try {
    const data = await request.json()
    
    // Validar datos requeridos
    if (!data.nombre || !data.categoria) {
      return Response.json(
        { error: 'Nombre y categoría son requeridos' },
        { status: 400 }
      )
    }
    
    const nuevoProducto = createProducto(data)
    
    return Response.json({
      success: true,
      producto: nuevoProducto,
      message: 'Producto creado exitosamente'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error al crear producto:', error)
    return Response.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
})

// PUT - Actualizar producto (requiere autenticación)
export const PUT = requireAuth(async (request, user) => {
  try {
    const data = await request.json()
    const { id, ...updateData } = data
    
    if (!id) {
      return Response.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      )
    }
    
    const productoActualizado = updateProducto(id, updateData)
    
    if (!productoActualizado) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    return Response.json({
      success: true,
      producto: productoActualizado,
      message: 'Producto actualizado exitosamente'
    })
    
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return Response.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
})

// DELETE - Eliminar producto (requiere autenticación)
export const DELETE = requireAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return Response.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      )
    }
    
    const eliminado = deleteProducto(id)
    
    if (!eliminado) {
      return Response.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }
    
    return Response.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    })
    
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return Response.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
})
