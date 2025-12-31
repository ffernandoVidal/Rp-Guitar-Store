const fs = require('fs')
const path = require('path')

// Leer el archivo en public/data
const dataPath = path.join(__dirname, 'public', 'data', 'amplificadores.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

// Crear estructura organizada por categorías
const productosOrganizados = {
  guitarras: [],
  pedales: [],
  amplificadores: [],
  bajos: [],
  accesorios: []
}

// Organizar productos por categoría
const todosLosProductos = data.amplificadores || []

todosLosProductos.forEach(producto => {
  const categoria = producto.categoria || 'amplificadores'
  
  // Determinar categoría base (sin subcategorías)
  const categoriaBase = categoria.startsWith('accesorios-') || categoria.startsWith('marcas-')
    ? categoria.split('-')[0]
    : categoria
  
  // Inicializar categoría si no existe
  if (!productosOrganizados[categoriaBase]) {
    productosOrganizados[categoriaBase] = []
  }
  
  productosOrganizados[categoriaBase].push(producto)
})

// Guardar archivo reorganizado
fs.writeFileSync(dataPath, JSON.stringify(productosOrganizados, null, 2), 'utf-8')

console.log('✅ Productos reorganizados por categoría:')
console.log(`   - Guitarras: ${productosOrganizados.guitarras.length}`)
console.log(`   - Pedales: ${productosOrganizados.pedales.length}`)
console.log(`   - Amplificadores: ${productosOrganizados.amplificadores.length}`)
console.log(`   - Bajos: ${productosOrganizados.bajos.length}`)
console.log(`   - Accesorios: ${productosOrganizados.accesorios.length}`)
