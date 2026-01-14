import { NextResponse } from 'next/server'
import { searchProductos } from '@/lib/db-productos-mysql'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query || query.trim() === '') {
      return NextResponse.json({ productos: [] })
    }

    // Buscar en MySQL
    const resultados = await searchProductos(query)
    
    // Mapear al formato esperado por el frontend
    const productos = resultados.map(item => ({
      id: item.id,
      slug: item.slug,
      nombre: item.nombre,
      marca: item.marca,
      categoria: item.categoria,
      imagen: item.imagenes ? item.imagenes[0] : '',
      precio: item.precio,
      descripcion: item.descripcion,
      stock: item.stock
    }))

    return NextResponse.json({ productos })
    const productosFormateados = resultados.map(p => ({
      id: p.id,
      name: p.nombre,
      brand: p.marca,
      description: p.descripcion || `Guitarra eléctrica ${p.marca}`,
      slug: p.id,
      image: p.imagen,
      precio: p.precio
    }))

    return NextResponse.json({ 
      success: true, 
      productos: productosFormateados,
      total: productosFormateados.length 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      productos: []
    }, { status: 500 })
  }
}
