import fs from 'fs'
import path from 'path'

// Base de datos principal de productos (usar el archivo existente)
const PRODUCTOS_PATH = path.join(process.cwd(), 'data', 'amplificadores.json')
const IMAGENES_DIR = path.join(process.cwd(), 'public', 'img', 'productos')

// Estructura de categorías según el menú
export const CATEGORIAS = {
  guitarras: 'Guitarras',
  pedales: 'Pedales',
  amplificadores: 'Amplificadores',
  bajos: 'Bajos',
  accesorios: 'Accesorios'
}

// Marcas disponibles
export const MARCAS = [
  'PRS', 'Suhr', 'D\'Angelico', 'Danelectro', 'Fender', 'Gibson',
  'Ibanez', 'Jackson', 'ESP', 'Schecter', 'Gretsch', 'G&L',
  'Boss', 'MXR', 'Electro-Harmonix', 'TC Electronic', 'Walrus Audio',
  'Strymon', 'JHS', 'Wampler', 'EarthQuaker Devices',
  'Marshall', 'Vox', 'Orange', 'Mesa Boogie', 'Cort', 'Rivolta',
  'Blackstar', 'Laney', 'Roland', 'Yamaha', 'GruvGear',
  'Otra'
]

// Asegurar que los directorios existen
function ensureDirectories() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  if (!fs.existsSync(IMAGENES_DIR)) {
    fs.mkdirSync(IMAGENES_DIR, { recursive: true })
  }
}

// Inicializar base de datos de productos
function initProductosDB() {
  ensureDirectories()
  
  if (!fs.existsSync(PRODUCTOS_PATH)) {
    const initialData = {
      guitarras: [],
      pedales: [],
      amplificadores: [],
      bajos: [],
      accesorios: []
    }
    fs.writeFileSync(PRODUCTOS_PATH, JSON.stringify(initialData, null, 2))
  }
}

// Leer base de datos de productos
export function readProductosDB() {
  initProductosDB()
  const data = fs.readFileSync(PRODUCTOS_PATH, 'utf-8')
  return JSON.parse(data)
}

// Normalizar producto del formato existente al formato del panel
function normalizeProducto(producto) {
  // Convertir stock booleano a numérico
  let stockNumerico = 0
  if (producto.stock === true || producto.stock === 'true') {
    stockNumerico = 5
  } else if (typeof producto.stock === 'number') {
    stockNumerico = producto.stock
  } else if (producto.stock === false || producto.stock === 'false') {
    stockNumerico = 0
  }
  
  return {
    id: producto.slug || producto.id?.toString(),
    nombre: producto.nombre,
    marca: producto.marca || 'Sin marca',
    categoria: producto.categoria || 'amplificadores',
    stock: stockNumerico,
    precioVenta: producto.precio || 0,
    precioMayorista: producto.precioMayorista || (producto.precio ? Math.round(producto.precio * 0.8) : 0),
    descripcion: producto.descripcion || '',
    descripcionDetallada: producto.descripcionDetallada || producto.descripcion || '',
    especificaciones: producto.especificaciones || {
      tipo: producto.modelo || '',
      cuerpo: '',
      mastil: '',
      diapason: '',
      otros: producto.caracteristicas ? producto.caracteristicas.join(', ') : ''
    },
    imagenes: producto.imagenes || [],
    slug: producto.slug,
    fechaCreacion: producto.fechaCreacion || new Date().toISOString(),
    fechaModificacion: producto.fechaModificacion || new Date().toISOString()
  }
}

// Convertir de formato del panel a formato existente
function denormalizeProducto(producto) {
  const db = readProductosDB()
  
  // Obtener el ID máximo de TODAS las categorías para evitar duplicados
  let maxId = 0
  Object.keys(CATEGORIAS).forEach(categoria => {
    if (db[categoria] && Array.isArray(db[categoria])) {
      const categoryMaxId = db[categoria].reduce((max, p) => Math.max(max, p.id || 0), 0)
      maxId = Math.max(maxId, categoryMaxId)
    }
  })
  
  return {
    id: parseInt(producto.id?.replace(/\D/g, '')) || maxId + 1,
    nombre: producto.nombre,
    slug: producto.slug || producto.id,
    marca: producto.marca,
    modelo: producto.especificaciones?.tipo || '',
    precio: producto.precioVenta,
    precioMayorista: producto.precioMayorista,
    descripcion: producto.descripcion,
    descripcionDetallada: producto.descripcionDetallada,
    caracteristicas: producto.especificaciones?.otros ? producto.especificaciones.otros.split(', ').filter(c => c) : [],
    imagenes: producto.imagenes,
    stock: typeof producto.stock === 'number' ? producto.stock : (producto.stock ? 5 : 0),
    categoria: producto.categoria,
    especificaciones: producto.especificaciones,
    fechaCreacion: producto.fechaCreacion,
    fechaModificacion: producto.fechaModificacion
  }
}

// Escribir base de datos de productos
export function writeProductosDB(data) {
  ensureDirectories()
  fs.writeFileSync(PRODUCTOS_PATH, JSON.stringify(data, null, 2))
}

// Obtener todos los productos de todas las categorías
export function getAllProductos() {
  const db = readProductosDB()
  const allProductos = []
  
  // Combinar todos los productos de todas las categorías
  Object.keys(CATEGORIAS).forEach(categoria => {
    const productos = db[categoria] || []
    allProductos.push(...productos.map(p => normalizeProducto(p)))
  })
  
  return allProductos
}

// Obtener producto por ID (busca en todas las categorías)
export function getProductoById(id) {
  const db = readProductosDB()
  
  for (const categoria of Object.keys(CATEGORIAS)) {
    const productos = db[categoria] || []
    const producto = productos.find(p => (p.slug === id || p.id?.toString() === id))
    if (producto) {
      return normalizeProducto(producto)
    }
  }
  
  return null
}

// Obtener productos por categoría
export function getProductosByCategoria(categoria) {
  const db = readProductosDB()
  const productos = db[categoria] || []
  return productos.map(p => normalizeProducto(p))
}

// Obtener productos por marca (busca en todas las categorías)
export function getProductosByMarca(marca) {
  const db = readProductosDB()
  const allProductos = []
  
  Object.keys(CATEGORIAS).forEach(categoria => {
    const productos = db[categoria] || []
    allProductos.push(...productos.filter(p => p.marca === marca))
  })
  
  return allProductos.map(p => normalizeProducto(p))
}

// Crear nuevo producto
export function createProducto(productoData) {
  const db = readProductosDB()
  
  // Determinar categoría principal (sin subcategorías)
  const categoriaBase = productoData.categoria.startsWith('accesorios-') || productoData.categoria.startsWith('marcas-')
    ? productoData.categoria.split('-')[0]
    : productoData.categoria
  
  // Inicializar categoría si no existe
  if (!db[categoriaBase]) {
    db[categoriaBase] = []
  }
  
  // Generar slug único
  const slug = productoData.nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  const productoConSlug = {
    ...productoData,
    slug,
    fechaCreacion: new Date().toISOString(),
    stock: parseInt(productoData.stock) || 0,
    precioVenta: parseFloat(productoData.precioVenta) || 0,
    precioMayorista: parseFloat(productoData.precioMayorista) || 0
  }
  
  // Convertir al formato existente
  const productoParaDB = denormalizeProducto(productoConSlug)
  
  // Guardar en la categoría correcta
  db[categoriaBase].push(productoParaDB)
  writeProductosDB(db)
  
  return normalizeProducto(productoParaDB)
}

// Actualizar producto
export function updateProducto(id, updateData) {
  const db = readProductosDB()
  let productoActual = null
  let categoriaActual = null
  let index = -1
  
  // Buscar el producto en todas las categorías
  for (const categoria of Object.keys(CATEGORIAS)) {
    if (!db[categoria]) continue
    index = db[categoria].findIndex(p => (p.slug === id || p.id?.toString() === id))
    if (index !== -1) {
      productoActual = db[categoria][index]
      categoriaActual = categoria
      break
    }
  }
  
  if (!productoActual) {
    return null
  }
  
  // Actualizar con nuevos datos
  const productoActualizado = {
    ...productoActual,
    nombre: updateData.nombre || productoActual.nombre,
    marca: updateData.marca || productoActual.marca,
    modelo: updateData.especificaciones?.tipo || productoActual.modelo,
    precio: updateData.precioVenta !== undefined ? updateData.precioVenta : productoActual.precio,
    precioMayorista: updateData.precioMayorista !== undefined ? updateData.precioMayorista : productoActual.precioMayorista,
    descripcion: updateData.descripcion !== undefined ? updateData.descripcion : productoActual.descripcion,
    descripcionDetallada: updateData.descripcionDetallada !== undefined ? updateData.descripcionDetallada : productoActual.descripcionDetallada,
    caracteristicas: updateData.especificaciones?.otros ? updateData.especificaciones.otros.split(', ').filter(c => c) : productoActual.caracteristicas,
    imagenes: updateData.imagenes || productoActual.imagenes,
    stock: updateData.stock !== undefined ? updateData.stock : productoActual.stock,
    categoria: updateData.categoria || productoActual.categoria,
    especificaciones: updateData.especificaciones || productoActual.especificaciones,
    fechaModificacion: new Date().toISOString()
  }
  
  // Si cambió la categoría, mover el producto
  const nuevaCategoriaBase = (updateData.categoria || productoActual.categoria).startsWith('accesorios-') || (updateData.categoria || productoActual.categoria).startsWith('marcas-')
    ? (updateData.categoria || productoActual.categoria).split('-')[0]
    : (updateData.categoria || productoActual.categoria)
  
  if (nuevaCategoriaBase !== categoriaActual) {
    // Eliminar de categoría actual
    db[categoriaActual].splice(index, 1)
    // Agregar a nueva categoría
    if (!db[nuevaCategoriaBase]) {
      db[nuevaCategoriaBase] = []
    }
    db[nuevaCategoriaBase].push(productoActualizado)
  } else {
    // Actualizar en la misma categoría
    db[categoriaActual][index] = productoActualizado
  }
  
  writeProductosDB(db)
  
  return normalizeProducto(productoActualizado)
}

// Actualizar stock (suma)
export function updateStock(id, cantidad) {
  const db = readProductosDB()
  
  // Buscar en todas las categorías
  for (const categoria of Object.keys(CATEGORIAS)) {
    if (!db[categoria]) continue
    const index = db[categoria].findIndex(p => (p.slug === id || p.id?.toString() === id))
    
    if (index !== -1) {
      const stockActual = typeof db[categoria][index].stock === 'number' 
        ? db[categoria][index].stock 
        : (db[categoria][index].stock ? 5 : 0)
      
      db[categoria][index].stock = stockActual + parseInt(cantidad)
      db[categoria][index].fechaModificacion = new Date().toISOString()
      
      writeProductosDB(db)
      return normalizeProducto(db[categoria][index])
    }
  }
  
  return null
}

// Restar stock (para ventas)
export function restarStock(id, cantidad) {
  const db = readProductosDB()
  
  // Buscar en todas las categorías
  for (const categoria of Object.keys(CATEGORIAS)) {
    if (!db[categoria]) continue
    const index = db[categoria].findIndex(p => (p.slug === id || p.id?.toString() === id))
    
    if (index !== -1) {
      const stockActual = typeof db[categoria][index].stock === 'number' 
        ? db[categoria][index].stock 
        : (db[categoria][index].stock ? 5 : 0)
      
      const nuevoStock = stockActual - parseInt(cantidad)
      
      if (nuevoStock < 0) {
        throw new Error('Stock insuficiente')
      }
      
      db[categoria][index].stock = nuevoStock
      db[categoria][index].fechaModificacion = new Date().toISOString()
      
      writeProductosDB(db)
      return normalizeProducto(db[categoria][index])
    }
  }
  
  return null
}

// Eliminar producto
export function deleteProducto(id) {
  const db = readProductosDB()
  
  // Buscar en todas las categorías
  for (const categoria of Object.keys(CATEGORIAS)) {
    if (!db[categoria]) continue
    const index = db[categoria].findIndex(p => (p.slug === id || p.id?.toString() === id))
    
    if (index !== -1) {
      db[categoria].splice(index, 1)
      writeProductosDB(db)
      return true
    }
  }
  
  return false
}

// Buscar productos en todas las categorías
export function searchProductos(query) {
  const db = readProductosDB()
  const searchLower = query.toLowerCase()
  const allProductos = []
  
  Object.keys(CATEGORIAS).forEach(categoria => {
    const productos = db[categoria] || []
    const filtrados = productos.filter(p => 
      p.nombre.toLowerCase().includes(searchLower) ||
      p.marca.toLowerCase().includes(searchLower) ||
      p.descripcion?.toLowerCase().includes(searchLower)
    )
    allProductos.push(...filtrados)
  })
  
  return allProductos.map(p => normalizeProducto(p))
}
