const fs = require('fs')
const path = require('path')

// Leer archivo actual
const dataPath = path.join(__dirname, 'data', 'amplificadores.json')
const db = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

// TODAS LAS GUITARRAS del archivo Python
const guitarras = [
  // SUHR
  { nombre: "Suhr Mateus Asato", marca: "Suhr", precio: 35090, precioMayorista: 28072, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/Mateus Asato - Agotada.png"] },
  { nombre: "Suhr Classic T Aged", marca: "Suhr", precio: 31300, precioMayorista: 25040, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/Classic T Aged -  Agotada.png"] },
  { nombre: "Suhr Classic S", marca: "Suhr", precio: 29300, precioMayorista: 23440, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/Classic S -  Agotada.png"] },
  { nombre: "Suhr Pete Thorne", marca: "Suhr", precio: 35090, precioMayorista: 28072, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/Suhr Pete Thorne.png"] },
  
  // RIVOLTA
  { nombre: "Rivolta Combinata XVII", marca: "Rivolta", precio: 12080, precioMayorista: 9664, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/Rivolta Combinata XVII.png"] },
  { nombre: "Rivolta Combinata VII", marca: "Rivolta", precio: 11640, precioMayorista: 9312, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/Rivolta Combinata VII.png"] },
  
  // G&L FULLERTON SERIES
  { nombre: "G&L S-500 Fullerton", marca: "G&L", precio: 15800, precioMayorista: 12640, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/S-500 Fullerton - Agotada.png"] },
  { nombre: "G&L Asat Classic Thinline", marca: "G&L", precio: 14800, precioMayorista: 11840, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/Asat Classic Thinline - Agotada.png", "/img/guitarras/Asat Classic Thinline - Agotada (2).png", "/img/guitarras/Asat Classic Thinline - Agotada (3).png"] },
  { nombre: "G&L Asat Classic Fullerton", marca: "G&L", precio: 15400, precioMayorista: 12320, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/Asat Classic Fullerton, - Agotada.png"] },
  { nombre: "G&L ASAT Z-3", marca: "G&L", precio: 15800, precioMayorista: 12640, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/G&L ASAT Z-3.png"] },
  
  // G&L TRIBUTE SERIES
  { nombre: "G&L Asat Classic", marca: "G&L", precio: 4900, precioMayorista: 3920, stock: 5, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Classic.png", "/img/guitarras/Asat Classic.png"] },
  { nombre: "G&L Asat Bluesboy", marca: "G&L", precio: 4900, precioMayorista: 3920, stock: 3, categoria: "guitarras", imagenes: ["/img/guitarras/Asat Bluesboy.png"] },
  { nombre: "G&L Asat Bluesboy Semi Hollow", marca: "G&L", precio: 5200, precioMayorista: 4160, stock: 2, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Bluesboy Semi Hollow.png", "/img/guitarras/G&L Asat Bluesboy Semi Hollow (2).png"] },
  { nombre: "G&L Asat Zurda Classic Bluesboy Semi Hollow", marca: "G&L", precio: 5000, precioMayorista: 4000, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Zurda Classic Bluesboy Semi Hollow.png"], descripcion: "Guitarra zurda" },
  { nombre: "G&L Asat Special", marca: "G&L", precio: 5200, precioMayorista: 4160, stock: 3, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Special.png"] },
  { nombre: "G&L Asat Legacy", marca: "G&L", precio: 4990, precioMayorista: 3992, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Legacy  - Agotado.png"] },
  { nombre: "G&L Fallout", marca: "G&L", precio: 4700, precioMayorista: 3760, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Fallout - Agotada.png"] },
  { nombre: "G&L Asat Delux", marca: "G&L", precio: 5100, precioMayorista: 4080, stock: 2, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Delux.png"] },
  { nombre: "G&L Asat Especial", marca: "G&L", precio: 5200, precioMayorista: 4160, stock: 2, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Especial.png"] },
  { nombre: "G&L Asat Classic Bluesboy", marca: "G&L", precio: 4900, precioMayorista: 3920, stock: 2, categoria: "guitarras", imagenes: ["/img/guitarras/G&L Asat Classic Bluesboy.png"] },
  
  // D'ANGELICO
  { nombre: "D'Angelico SS", marca: "D'Angelico", precio: 7560, precioMayorista: 6048, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/D´Angelico SS.png"] },
  { nombre: "D'Angelico DC", marca: "D'Angelico", precio: 7470, precioMayorista: 5976, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/D´Angelico DC.png"] },
  { nombre: "D'Angelico GT", marca: "D'Angelico", precio: 10080, precioMayorista: 8064, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/D´Angelico GT.png"] },
  { nombre: "D'Angelico Deluxe SS", marca: "D'Angelico", precio: 18800, precioMayorista: 15040, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/D´Angelico Deluxe SS.png"] },
  
  // PRS
  { nombre: "PRS Silver Sky SE", marca: "PRS", precio: 8300, precioMayorista: 6640, stock: 2, categoria: "guitarras", imagenes: ["/img/guitarras/prs-silver-sky.jpg"] },
  { nombre: "PRS Silver Sky SE John Mayer", marca: "PRS", precio: 8300, precioMayorista: 6640, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/prs-silver-sky-jm.jpg"] },
  { nombre: "PRS SE Custom 24 Charcoal", marca: "PRS", precio: 8095, precioMayorista: 6476, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/prs-custom24.jpg"] },
  
  // DANELECTRO
  { nombre: "Danelectro 56", marca: "Danelectro", precio: 4660, precioMayorista: 3728, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/danelectro-56.jpg"] },
  { nombre: "Danelectro Blackout 59", marca: "Danelectro", precio: 4550, precioMayorista: 3640, stock: 2, categoria: "guitarras", imagenes: ["/img/guitarras/danelectro-blackout.jpg"] },
  { nombre: "Danelectro 59 MJ", marca: "Danelectro", precio: 4340, precioMayorista: 3472, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/danelectro-59mj.jpg"] },
  { nombre: "Danelectro 56 U2", marca: "Danelectro", precio: 4660, precioMayorista: 3728, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/danelectro-56u2.jpg"] },
  { nombre: "Danelectro 59 Divine", marca: "Danelectro", precio: 5600, precioMayorista: 4480, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/danelectro-divine.jpg"] },
  
  // CITIZEN
  { nombre: "Citizen C2", marca: "Citizen", precio: 11620, precioMayorista: 9296, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/citizen-c2.jpg"] },
  { nombre: "Citizen CT", marca: "Citizen", precio: 12090, precioMayorista: 9672, stock: 0, categoria: "guitarras", imagenes: ["/img/guitarras/citizen-ct.jpg"] },
  { nombre: "Citizen CS", marca: "Citizen", precio: 10940, precioMayorista: 8752, stock: 1, categoria: "guitarras", imagenes: ["/img/guitarras/citizen-cs.jpg"] },
  
  // EASTWOOD
  { nombre: "Eastwood Classic 6", marca: "Eastwood", precio: 5940, precioMayorista: 4752, stock: 2, categoria: "guitarras", imagenes: ["/img/guitarras/eastwood-classic6.jpg"] },
]

// TODOS LOS PRODUCTOS GRUVGEAR (10 productos basados en las 10 imágenes)
const accesorios = [
  { nombre: "Gruvgear FretWedge", marca: "Gruvgear", precio: 75, precioMayorista: 60, stock: 10, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear.jpeg"], descripcion: "Apagador de cuerdas profesional" },
  { nombre: "Gruvgear FretWraps", marca: "Gruvgear", precio: 85, precioMayorista: 68, stock: 15, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (2).jpeg"], descripcion: "Apagadores de cuerda ajustables" },
  { nombre: "Gruvgear Bento Half", marca: "Gruvgear", precio: 300, precioMayorista: 240, stock: 5, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (3).jpeg"], descripcion: "Organizador de cables compacto" },
  { nombre: "Gruvgear Bento Slim", marca: "Gruvgear", precio: 450, precioMayorista: 360, stock: 3, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (4).jpeg"], descripcion: "Organizador de cables profesional" },
  { nombre: "Gruvgear Gigblade", marca: "Gruvgear", precio: 1200, precioMayorista: 960, stock: 2, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (5).jpeg"], descripcion: "Estuche rígido para guitarra eléctrica" },
  { nombre: "Gruvgear Club Bag", marca: "Gruvgear", precio: 850, precioMayorista: 680, stock: 4, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (6).jpeg"], descripcion: "Funda acolchada premium para guitarra" },
  { nombre: "Gruvgear Stadium Bag", marca: "Gruvgear", precio: 950, precioMayorista: 760, stock: 3, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (7).jpeg"], descripcion: "Funda para guitarra con múltiples compartimentos" },
  { nombre: "Gruvgear DuoStrap", marca: "Gruvgear", precio: 120, precioMayorista: 96, stock: 8, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (8).jpeg"], descripcion: "Correa doble para guitarra y bajo" },
  { nombre: "Gruvgear SoloStrap", marca: "Gruvgear", precio: 95, precioMayorista: 76, stock: 10, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (9).jpeg"], descripcion: "Correa premium para guitarra" },
  { nombre: "Gruvgear FretWraps XL", marca: "Gruvgear", precio: 95, precioMayorista: 76, stock: 12, categoria: "accesorios", imagenes: ["/img/accesorios/Gruvgear (10).jpeg"], descripcion: "Apagadores extra grandes para bajos" },
]

// Función para generar slug
function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Función para crear producto con formato completo
function crearProducto(producto, index) {
  const slug = generarSlug(producto.nombre)
  return {
    id: 1000 + index,
    nombre: producto.nombre,
    slug: slug,
    marca: producto.marca,
    modelo: producto.nombre.split(' ').slice(1).join(' '),
    precio: producto.precio,
    precioMayorista: producto.precioMayorista,
    descripcion: producto.descripcion || `${producto.marca} ${producto.nombre}`,
    descripcionDetallada: producto.descripcionDetallada || producto.descripcion || `${producto.marca} ${producto.nombre}`,
    caracteristicas: producto.caracteristicas || [],
    imagenes: producto.imagenes,
    stock: producto.stock,
    categoria: producto.categoria,
    especificaciones: producto.especificaciones || {
      tipo: '',
      cuerpo: '',
      mastil: '',
      diapason: '',
      otros: ''
    },
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString()
  }
}

// Agregar guitarras
console.log('\n📝 Agregando guitarras...')
guitarras.forEach((guitarra, index) => {
  const producto = crearProducto(guitarra, index)
  db.guitarras.push(producto)
  console.log(`  ✅ ${guitarra.marca} - ${guitarra.nombre}`)
})

// Agregar accesorios Gruvgear
console.log('\n📝 Agregando accesorios Gruvgear...')
accesorios.forEach((accesorio, index) => {
  const producto = crearProducto(accesorio, 100 + index)
  db.accesorios.push(producto)
  console.log(`  ✅ ${accesorio.marca} - ${accesorio.nombre}`)
})

// Guardar base de datos
fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf-8')

console.log('\n✅ Migración completada!')
console.log(`\n📊 Resumen:`)
console.log(`   - Guitarras: ${db.guitarras.length}`)
console.log(`   - Pedales: ${db.pedales.length}`)
console.log(`   - Amplificadores: ${db.amplificadores.length}`)
console.log(`   - Bajos: ${db.bajos.length}`)
console.log(`   - Accesorios: ${db.accesorios.length}`)
console.log(`\n🎉 Total de productos: ${db.guitarras.length + db.pedales.length + db.amplificadores.length + db.bajos.length + db.accesorios.length}`)
