import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Leer productos existentes
    const amplificadoresPath = path.join(process.cwd(), 'data', 'amplificadores.json')
    const productosPath = path.join(process.cwd(), 'data', 'productos.json')
    
    const amplificadoresData = JSON.parse(fs.readFileSync(amplificadoresPath, 'utf-8'))
    const productosExistentes = amplificadoresData.amplificadores || []
    
    // Mapear productos al nuevo formato
    const productosNuevos = productosExistentes.map((producto, index) => {
      // Determinar stock numérico
      let stockNumerico = 0
      if (producto.stock === true || producto.stock === 'true') {
        stockNumerico = 5 // Stock disponible por defecto
      } else if (typeof producto.stock === 'number') {
        stockNumerico = producto.stock
      }

      return {
        id: `prod-${index + 1}`,
        nombre: producto.nombre,
        marca: producto.marca || 'Sin marca',
        categoria: producto.categoria || 'amplificadores',
        stock: stockNumerico,
        precioVenta: producto.precio || 0,
        precioMayorista: producto.precio ? Math.round(producto.precio * 0.8) : 0,
        descripcion: producto.descripcion || '',
        descripcionDetallada: producto.descripcion || '',
        especificaciones: {
          tipo: producto.modelo || '',
          cuerpo: '',
          mastil: '',
          diapason: '',
          otros: producto.caracteristicas ? producto.caracteristicas.join(', ') : ''
        },
        imagenes: producto.imagenes || [],
        slug: producto.slug || `producto-${index + 1}`,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
      }
    })
    
    // Crear nuevo archivo de productos
    const nuevaDB = {
      productos: productosNuevos,
      nextId: productosNuevos.length + 1
    }
    
    // Guardar
    fs.writeFileSync(productosPath, JSON.stringify(nuevaDB, null, 2))
    
    // Resumen por categorías
    const resumen = productosNuevos.reduce((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + 1
      return acc
    }, {})
    
    return NextResponse.json({
      success: true,
      message: 'Migración completada exitosamente',
      total: productosNuevos.length,
      resumenCategorias: resumen
    })
    
  } catch (error) {
    console.error('Error en migración:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
