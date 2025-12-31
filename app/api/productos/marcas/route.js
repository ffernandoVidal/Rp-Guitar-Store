import { getAllProductos } from '@/lib/db-productos'

export async function GET() {
  try {
    const productos = getAllProductos()
    
    // Extraer marcas únicas y ordenarlas alfabéticamente
    const marcasSet = new Set()
    productos.forEach(producto => {
      if (producto.marca && producto.marca.trim() !== '') {
        marcasSet.add(producto.marca.trim())
      }
    })
    
    const marcas = Array.from(marcasSet).sort((a, b) => {
      // "Otra" siempre al final
      if (a === 'Otra') return 1
      if (b === 'Otra') return -1
      return a.localeCompare(b, 'es')
    })
    
    // Asegurar que "Otra" esté al final si no existe
    if (!marcas.includes('Otra')) {
      marcas.push('Otra')
    }
    
    return Response.json(marcas)
  } catch (error) {
    console.error('Error al obtener marcas:', error)
    return Response.json({ error: 'Error al obtener marcas' }, { status: 500 })
  }
}
