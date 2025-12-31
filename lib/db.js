import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'alumnos.json')

// Asegurar que el directorio data existe
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Leer base de datos
export function readDB() {
  ensureDataDir()
  
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ alumnos: [], nextId: 1 }))
  }
  
  const data = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

// Escribir base de datos
export function writeDB(data) {
  ensureDataDir()
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// Obtener todos los alumnos
export function getAlumnos() {
  const db = readDB()
  return db.alumnos || []
}

// Obtener alumno por carnet
export function getAlumnoByCarnet(carnet) {
  const db = readDB()
  return db.alumnos.find(a => a.carnet === carnet)
}

// Generar carnet basado en instrumento
export function generarCarnet(instrumento) {
  const CODIGOS = {
    'guitarra': '001',
    'batería': '002',
    'bajo': '003',
    'piano': '004',
    'saxofón': '005',
    'violín': '006',
    'canto': '007'
  }
  
  const db = readDB()
  const codigo = CODIGOS[instrumento.toLowerCase()] || '001'
  const alumnosInstrumento = db.alumnos.filter(
    a => a.instrumento.toLowerCase() === instrumento.toLowerCase()
  )
  const numeroAlumno = (alumnosInstrumento.length + 1).toString().padStart(2, '0')
  
  return `${codigo}-${numeroAlumno}`
}

// Agregar alumno
export function addAlumno(alumnoData) {
  const db = readDB()
  
  const carnet = generarCarnet(alumnoData.instrumento)
  
  const nuevoAlumno = {
    ...alumnoData,
    carnet,
    id: db.nextId,
    fechaRegistro: new Date().toISOString(),
    ultimoPago: alumnoData.estado === 'solvente' ? new Date().toISOString() : null,
    notas: {
      niveles: Array(8).fill(0),
      armonia: 0,
      instrumento: 0
    }
  }
  
  db.alumnos.push(nuevoAlumno)
  db.nextId++
  
  writeDB(db)
  return nuevoAlumno
}

// Actualizar alumno
export function updateAlumno(carnet, updates) {
  const db = readDB()
  const index = db.alumnos.findIndex(a => a.carnet === carnet)
  
  if (index === -1) return null
  
  db.alumnos[index] = {
    ...db.alumnos[index],
    ...updates
  }
  
  writeDB(db)
  return db.alumnos[index]
}

// Registrar pago
export function registrarPago(carnet, mes, año, metodoPago) {
  const db = readDB()
  const alumno = db.alumnos.find(a => a.carnet === carnet)
  
  if (!alumno) return null
  
  // Inicializar array de pagos si no existe
  if (!alumno.pagos) {
    alumno.pagos = []
  }
  
  // Verificar si ya existe un pago para este mes y año
  const pagoExistente = alumno.pagos.find(p => p.mes === mes && p.año === año)
  
  if (pagoExistente) {
    throw new Error(`Ya existe un pago registrado para ${mes} ${año}`)
  }
  
  // Agregar nuevo pago
  alumno.pagos.push({
    carnet,
    mes,
    año,
    metodoPago,
    fechaPago: new Date().toISOString(),
    monto: alumno.mensualidad
  })
  
  // Actualizar estado y último pago
  alumno.ultimoPago = new Date().toISOString()
  alumno.estado = 'solvente'
  
  writeDB(db)
  return alumno
}

// Actualizar notas
export function actualizarNotas(carnet, nivel, notaInstrumento, notaArmonia) {
  const db = readDB()
  const alumno = db.alumnos.find(a => a.carnet === carnet)
  
  if (!alumno) return null
  
  // Actualizar nota del nivel específico
  if (nivel >= 1 && nivel <= 8) {
    alumno.notas.niveles[nivel - 1] = notaInstrumento
  }
  
  // Actualizar nota general de instrumento
  alumno.notas.instrumento = notaInstrumento
  
  // Actualizar nota general de armonía
  alumno.notas.armonia = notaArmonia
  
  writeDB(db)
  return alumno
}

// Eliminar alumno
export function deleteAlumno(carnet) {
  const db = readDB()
  db.alumnos = db.alumnos.filter(a => a.carnet !== carnet)
  writeDB(db)
  return true
}

// Verificar solvencia (ejecutar diariamente)
export function verificarSolvencias() {
  const db = readDB()
  const hoy = new Date()
  const dia = hoy.getDate()
  
  db.alumnos = db.alumnos.map(alumno => {
    if (!alumno.ultimoPago) {
      return { ...alumno, estado: 'insolvente' }
    }
    
    const ultimoPago = new Date(alumno.ultimoPago)
    const mesActual = hoy.getMonth()
    const mesPago = ultimoPago.getMonth()
    const añoActual = hoy.getFullYear()
    const añoPago = ultimoPago.getFullYear()
    
    // Si pasó el día 10 y no hay pago este mes, marcar como insolvente
    if (dia > 10) {
      if (añoActual > añoPago || (añoActual === añoPago && mesActual > mesPago)) {
        return { ...alumno, estado: 'insolvente' }
      }
    }
    
    return alumno
  })
  
  writeDB(db)
  return db.alumnos
}
