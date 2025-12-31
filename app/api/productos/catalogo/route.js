import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    
    // Leer desde la base de datos del servidor (no public)
    const productosPath = path.join(process.cwd(), 'data', 'amplificadores.json')
    const productosData = fs.readFileSync(productosPath, 'utf-8')
    const db = JSON.parse(productosData)
    
    // Si se especifica categoría, leer solo de esa categoría
    let productos = []
    if (categoria) {
      // Inicializar categoría si no existe
      if (!db[categoria]) {
        db[categoria] = []
      }
      productos = db[categoria]
    } else {
      // Si no se especifica categoría, obtener todos los productos de todas las categorías
      const categorias = ['guitarras', 'pedales', 'amplificadores', 'bajos', 'accesorios']
      categorias.forEach(cat => {
        if (db[cat] && Array.isArray(db[cat])) {
          productos.push(...db[cat])
        }
      })
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
