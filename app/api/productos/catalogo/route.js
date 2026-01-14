import { NextResponse } from 'next/server'
import { getAllProductos, getProductosByCategoria } from '@/lib/db-productos-mysql'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Mapeo de nombres de categorías a IDs
const CATEGORIA_MAP = {
  'guitarras': 1,
  'pedales': 2,
  'amplificadores': 3,
  'bajos': 4,
  'accesorios': 5
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoriaNombre = searchParams.get('categoria')
    
    let productos = []
    
    if (categoriaNombre) {
      // Convertir nombre de categoría a ID
      const categoriaId = CATEGORIA_MAP[categoriaNombre.toLowerCase()]
      
      if (categoriaId) {
        // Obtener productos de una categoría específica desde MySQL
        productos = await getProductosByCategoria(categoriaId)
      } else {
        console.warn(`Categoría no encontrada: ${categoriaNombre}`)
      }
    } else {
      // Obtener todos los productos desde MySQL
      productos = await getAllProductos()
    }

    return NextResponse.json({ 
      success: true, 
      productos,
      total: productos.length 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error al cargar productos:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      productos: []
    }, { status: 500 })
  }
}
