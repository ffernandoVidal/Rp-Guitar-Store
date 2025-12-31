import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { restarStock, getProductoById } from '@/lib/db-productos'

const VENTAS_PATH = path.join(process.cwd(), 'data', 'ventas.json')

function ensureVentasFile() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  if (!fs.existsSync(VENTAS_PATH)) {
    fs.writeFileSync(VENTAS_PATH, JSON.stringify({ ventas: [], nextId: 1 }))
  }
}

function readVentas() {
  ensureVentasFile()
  const data = fs.readFileSync(VENTAS_PATH, 'utf-8')
  return JSON.parse(data)
}

function writeVentas(data) {
  ensureVentasFile()
  fs.writeFileSync(VENTAS_PATH, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = readVentas()
    return NextResponse.json({ success: true, ventas: data.ventas })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const venta = await request.json()
    const data = readVentas()
    
    // Validar y descontar stock de cada producto en la venta
    const productosVenta = venta.productos || []
    const productosActualizados = []
    
    try {
      for (const item of productosVenta) {
        const producto = getProductoById(item.id)
        
        if (!producto) {
          return NextResponse.json({ 
            success: false, 
            error: `Producto ${item.nombre} no encontrado en el inventario` 
          }, { status: 400 })
        }
        
        // Verificar stock suficiente
        if (producto.stock < (item.cantidad || 1)) {
          return NextResponse.json({ 
            success: false, 
            error: `Stock insuficiente para ${item.nombre}. Stock disponible: ${producto.stock}` 
          }, { status: 400 })
        }
        
        // Restar del inventario
        const productoActualizado = restarStock(item.id, item.cantidad || 1)
        productosActualizados.push({
          id: productoActualizado.id,
          nombre: productoActualizado.nombre,
          stockAnterior: producto.stock,
          stockNuevo: productoActualizado.stock,
          cantidadVendida: item.cantidad || 1
        })
      }
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }
    
    const nuevaVenta = {
      ...venta,
      id: data.nextId,
      fechaRegistro: new Date().toISOString(),
      productosActualizados // Guardar información del cambio de stock
    }
    
    data.ventas.push(nuevaVenta)
    data.nextId += 1
    
    writeVentas(data)
    
    return NextResponse.json({ 
      success: true, 
      venta: nuevaVenta,
      inventarioActualizado: productosActualizados
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
