import { requirePermissions } from '@/lib/middleware'
import { sanitizeString, validateProducto } from '@/lib/validators'
import {
  createProducto,
  deleteProducto,
  getAllProductos,
  getProductoById,
  getProductosByCategoria,
  searchProductos,
  updateProducto,
} from '@/lib/db-productos-mysql'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function toInt(value) {
  const n = parseInt(String(value), 10)
  return Number.isFinite(n) ? n : null
}

function sanitizeImagenes(imagenes) {
  if (!Array.isArray(imagenes)) return undefined
  return imagenes
    .filter((x) => typeof x === 'string')
    .map((x) => sanitizeString(x))
    .filter(Boolean)
}

function sanitizePayload(raw) {
  const precioVenta = raw?.precioVenta ?? raw?.precio_venta
  const precioMayorista = raw?.precioMayorista ?? raw?.precio_mayorista

  return {
    nombre: raw?.nombre ? sanitizeString(raw.nombre) : '',
    modelo: raw?.modelo ? sanitizeString(raw.modelo) : '',
    marca: raw?.marca ? sanitizeString(raw.marca) : undefined,
    categoria_id: raw?.categoria_id ?? raw?.categoria,
    precioVenta: precioVenta !== undefined && precioVenta !== null ? Number(precioVenta) : undefined,
    precioMayorista:
      precioMayorista !== undefined && precioMayorista !== null ? Number(precioMayorista) : undefined,
    descripcion: raw?.descripcion ? sanitizeString(raw.descripcion) : '',
    descripcionDetallada:
      raw?.descripcionDetallada || raw?.detalle ? sanitizeString(raw.descripcionDetallada || raw.detalle) : '',
    stock: raw?.stock !== undefined && raw?.stock !== null ? toInt(raw.stock) ?? 0 : 0,
    imagenes: sanitizeImagenes(raw?.imagenes),
  }
}

function validateForDb(payload) {
  const categoriaId = toInt(payload.categoria_id)
  const validation = validateProducto({
    nombre: payload.nombre,
    categoria_id: categoriaId,
    precio_venta: payload.precioVenta,
    precio_mayorista: payload.precioMayorista,
    stock: payload.stock,
  })

  return { validation, categoriaId }
}

// GET - Obtener productos (público; puede ocultar precios mayoristas)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const categoria = searchParams.get('categoria')
    const query = searchParams.get('q')
    const includePrivate = searchParams.get('includePrivate') === 'true'

    if (id) {
      const producto = await getProductoById(id, includePrivate)
      if (!producto) {
        return Response.json({ error: 'Producto no encontrado' }, { status: 404 })
      }

      if (!includePrivate) {
        delete producto.precioMayorista
      }

      return Response.json(producto)
    }

    let productos
    if (query) {
      productos = await searchProductos(query, includePrivate)
    } else if (categoria) {
      const categoriaId = toInt(categoria)
      productos = await getProductosByCategoria(categoriaId ?? categoria, includePrivate)
    } else {
      productos = await getAllProductos(false, includePrivate)
    }

    if (!includePrivate) {
      productos = productos.map((p) => {
        const { precioMayorista, ...publicData } = p
        return publicData
      })
    }

    return Response.json(productos)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return Response.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

// POST - Crear producto (admin)
export const POST = requirePermissions(['productos.create'])(async (request) => {
  try {
    const raw = await request.json()
    const payload = sanitizePayload(raw)
    const { validation, categoriaId } = validateForDb(payload)

    if (!validation.valid) {
      return Response.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Datos inválidos',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const nuevoProducto = await createProducto({
      nombre: payload.nombre,
      modelo: payload.modelo,
      marca: payload.marca,
      categoria_id: categoriaId,
      precioVenta: payload.precioVenta,
      precioMayorista: payload.precioMayorista,
      descripcion: payload.descripcion,
      descripcionDetallada: payload.descripcionDetallada,
      stock: payload.stock,
      imagenes: payload.imagenes,
    })

    return Response.json(
      {
        success: true,
        producto: nuevoProducto,
        message: 'Producto creado exitosamente',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al crear producto:', error)
    return Response.json({ error: 'Error al crear producto' }, { status: 500 })
  }
})

// PUT - Actualizar producto (admin)
export const PUT = requirePermissions(['productos.update'])(async (request) => {
  try {
    const raw = await request.json()
    const id = raw?.id

    if (!id) {
      return Response.json(
        { error: 'MISSING_ID', message: 'ID de producto requerido' },
        { status: 400 }
      )
    }

    const payload = sanitizePayload(raw)

    // Para update, solo validamos si viene categoria_id o nombre, pero mantenemos
    // la misma función para no permitir valores inválidos si se envían.
    const { validation, categoriaId } = validateForDb({ ...payload, categoria_id: payload.categoria_id ?? 1 })
    if (!validation.valid) {
      return Response.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Datos inválidos',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const productoActualizado = await updateProducto(id, {
      nombre: payload.nombre || undefined,
      modelo: payload.modelo || undefined,
      marca: payload.marca,
      categoria_id: payload.categoria_id !== undefined ? categoriaId : undefined,
      precioVenta: payload.precioVenta,
      precioMayorista: payload.precioMayorista,
      descripcion: payload.descripcion || undefined,
      descripcionDetallada: payload.descripcionDetallada || undefined,
      stock: payload.stock,
      imagenes: payload.imagenes,
    })

    if (!productoActualizado) {
      return Response.json({ error: 'NOT_FOUND', message: 'Producto no encontrado' }, { status: 404 })
    }

    return Response.json({
      success: true,
      producto: productoActualizado,
      message: 'Producto actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    return Response.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
})

// DELETE - Eliminar producto (admin)
export const DELETE = requirePermissions(['productos.delete'])(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json(
        { error: 'MISSING_ID', message: 'ID de producto requerido' },
        { status: 400 }
      )
    }

    const eliminado = await deleteProducto(id)
    if (!eliminado) {
      return Response.json({ error: 'NOT_FOUND', message: 'Producto no encontrado' }, { status: 404 })
    }

    return Response.json({ success: true, message: 'Producto eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return Response.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
})
