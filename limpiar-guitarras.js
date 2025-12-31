const fs = require('fs')
const path = require('path')

// Leer archivo actual
const dataPath = path.join(__dirname, 'data', 'amplificadores.json')
const db = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

console.log('📊 Estado actual:')
console.log(`   - Guitarras: ${db.guitarras.length}`)
console.log(`   - Amplificadores: ${db.amplificadores.length}`)
console.log(`   - Accesorios: ${db.accesorios.length}`)

// Limpiar solo guitarras y accesorios (mantener amplificadores)
db.guitarras = []
db.accesorios = []
db.pedales = []
db.bajos = []

console.log('\n🧹 Limpiando guitarras y accesorios...')

// Guardar
fs.writeFileSync(dataPath, JSON.stringify(db, null, 2))

console.log('✅ Base de datos limpiada!')
console.log('\n📊 Estado después de limpieza:')
console.log(`   - Guitarras: ${db.guitarras.length}`)
console.log(`   - Amplificadores: ${db.amplificadores.length}`)
console.log(`   - Accesorios: ${db.accesorios.length}`)
