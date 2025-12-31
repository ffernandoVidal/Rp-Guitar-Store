import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() || ''

    if (!query) {
      return NextResponse.json({ productos: [] })
    }

    // Leer productos
    const productosPath = path.join(process.cwd(), 'data', 'amplificadores.json')
    const productosData = fs.readFileSync(productosPath, 'utf-8')
    const { amplificadores } = JSON.parse(productosData)
    
    // Mapear al formato esperado
    const guitarras = amplificadores.map(item => ({
      id: item.slug || item.id,
      nombre: item.nombre,
      marca: item.marca,
      categoria: item.categoria,
      imagen: item.imagenes ? item.imagenes[0] : '',
      precio: item.precio,
      descripcion: item.descripcion,
      stock: item.stock
    }))

    // Buscar en nombre, marca y descripción
    const resultados = guitarras.filter(producto => {
      const nombreMatch = producto.nombre.toLowerCase().includes(query)
      const marcaMatch = producto.marca.toLowerCase().includes(query)
      const descripcionMatch = producto.descripcion.toLowerCase().includes(query)
      
      return nombreMatch || marcaMatch || descripcionMatch
    })

    // Convertir formato
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
