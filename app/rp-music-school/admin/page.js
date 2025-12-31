'use client'
import { useState, useEffect } from 'react'
import Navigation from '../../components/Navigation'
import styles from './admin.module.css'

export default function AdminPage() {
  const [alumnos, setAlumnos] = useState([])
  const [formData, setFormData] = useState({
    nombre: '',
    instrumento: 'guitarra',
    diaClases: 'martes',
    horarioClases: '',
    mensualidad: '',
    telefono: '',
    estado: 'solvente'
  })
  const [notasForm, setNotasForm] = useState({
    carnet: '',
    nivel: '1',
    notaInstrumento: '',
    notaArmonia: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [showNotasForm, setShowNotasForm] = useState(false)

  // Cargar alumnos desde la API
  useEffect(() => {
    fetchAlumnos()
  }, [])

  const fetchAlumnos = async () => {
    try {
      const res = await fetch('/api/alumnos')
      const data = await res.json()
      if (data.success) {
        setAlumnos(data.alumnos)
      }
    } catch (error) {
      console.error('Error al cargar alumnos:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert(`Alumno agregado exitosamente. Carnet asignado: ${data.alumno.carnet}`)
        setFormData({
          nombre: '',
          instrumento: 'guitarra',
          diaClases: 'martes',
          horarioClases: '',
          mensualidad: '',
          telefono: '',
          estado: 'solvente'
        })
        setShowForm(false)
        fetchAlumnos()
      } else {
        alert('Error al agregar alumno: ' + data.error)
      }
    } catch (error) {
      alert('Error al agregar alumno')
      console.error(error)
    }
  }

  const handleNotasSubmit = async (e) => {
    e.preventDefault()
    
    // Verificar si el alumno está suspendido
    const alumno = alumnos.find(a => a.carnet === notasForm.carnet)
    if (alumno?.suspendido) {
      alert('No se pueden registrar calificaciones para alumnos suspendidos. Por favor, activa al alumno primero.')
      return
    }
    
    try {
      const res = await fetch(`/api/alumnos/${notasForm.carnet}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nivel: notasForm.nivel,
          notaInstrumento: notasForm.notaInstrumento,
          notaArmonia: notasForm.notaArmonia
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert('Calificaciones actualizadas exitosamente')
        setNotasForm({
          carnet: '',
          nivel: '1',
          notaInstrumento: '',
          notaArmonia: ''
        })
        setShowNotasForm(false)
        fetchAlumnos()
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error al actualizar calificaciones')
      console.error(error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const registrarPago = async (carnet) => {
    // Verificar si el alumno está suspendido
    const alumno = alumnos.find(a => a.carnet === carnet)
    if (alumno?.suspendido) {
      alert('No se pueden registrar pagos para alumnos suspendidos. Por favor, activa al alumno primero.')
      return
    }
    
    // Obtener mes y año actual
    const hoy = new Date()
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const mesActual = meses[hoy.getMonth()]
    const añoActual = hoy.getFullYear()
    
    const mes = prompt(`Ingrese el mes del pago (por defecto: ${mesActual}):`, mesActual)
    if (!mes) return
    
    const año = prompt(`Ingrese el año del pago (por defecto: ${añoActual}):`, añoActual)
    if (!año) return
    
    const metodoPago = prompt('Método de pago (efectivo/tarjeta):', 'efectivo')
    if (!metodoPago) return
    
    if (metodoPago.toLowerCase() !== 'efectivo' && metodoPago.toLowerCase() !== 'tarjeta') {
      alert('Método de pago debe ser "efectivo" o "tarjeta"')
      return
    }
    
    try {
      const res = await fetch(`/api/alumnos/${carnet}/pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, año, metodoPago: metodoPago.toLowerCase() })
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert(`Pago registrado exitosamente para ${mes} ${año} - ${metodoPago}`)
        fetchAlumnos()
      } else {
        alert('Error al registrar pago: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      alert('Error al registrar pago')
      console.error(error)
    }
  }

  const suspenderAlumno = async (carnet) => {
    const alumno = alumnos.find(a => a.carnet === carnet)
    const accion = alumno?.suspendido ? 'activar' : 'suspender'
    const mensaje = alumno?.suspendido 
      ? '¿Estás seguro de activar este alumno?'
      : '¿Estás seguro de suspender este alumno? No podrás registrar pagos ni calificaciones hasta que lo actives nuevamente.'
    
    if (confirm(mensaje)) {
      try {
        const res = await fetch(`/api/alumnos/${carnet}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ suspendido: !alumno?.suspendido })
        })
        
        const data = await res.json()
        
        if (data.success) {
          alert(`Alumno ${accion === 'activar' ? 'activado' : 'suspendido'} exitosamente`)
          fetchAlumnos()
        } else {
          alert('Error al ' + accion + ' alumno')
        }
      } catch (error) {
        alert('Error al ' + accion + ' alumno')
        console.error(error)
      }
    }
  }

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>RP Music School</p>
          </div>

          <div className={styles.actions}>
            <button 
              onClick={() => {
                setShowForm(!showForm)
                setShowNotasForm(false)
              }}
              className={styles.addButton}
            >
              {showForm ? 'Cancelar' : '+ Agregar Alumno'}
            </button>
            <button 
              onClick={() => {
                setShowNotasForm(!showNotasForm)
                setShowForm(false)
              }}
              className={styles.notasButton}
            >
              {showNotasForm ? 'Cancelar' : '📝 Registrar Calificaciones'}
            </button>
          </div>

          {showForm && (
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Nuevo Alumno</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre Completo</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Instrumento</label>
                    <select
                      name="instrumento"
                      value={formData.instrumento}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    >
                      <option value="guitarra">Guitarra (001-XX)</option>
                      <option value="batería">Batería (002-XX)</option>
                      <option value="bajo">Bajo (003-XX)</option>
                      <option value="piano">Piano (004-XX)</option>
                      <option value="saxofón">Saxofón (005-XX)</option>
                      <option value="violín">Violín (006-XX)</option>
                      <option value="canto">Canto (007-XX)</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Día de Clases</label>
                    <select
                      name="diaClases"
                      value={formData.diaClases}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    >
                      <option value="martes">Martes</option>
                      <option value="jueves">Jueves</option>
                      <option value="sábado">Sábado</option>
                      <option value="martes y jueves">Martes y Jueves</option>
                      <option value="martes y sábado">Martes y Sábado</option>
                      <option value="jueves y sábado">Jueves y Sábado</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Horario</label>
                    <input
                      type="text"
                      name="horarioClases"
                      value={formData.horarioClases}
                      onChange={handleChange}
                      placeholder="Ej: 3:00 PM - 4:00 PM"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Mensualidad (Q)</label>
                    <input
                      type="number"
                      name="mensualidad"
                      value={formData.mensualidad}
                      onChange={handleChange}
                      placeholder="Ej: 300"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ej: 5555-5555"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Estado Inicial</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    >
                      <option value="solvente">Solvente</option>
                      <option value="insolvente">Insolvente</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Registrar Alumno
                </button>
              </form>
            </div>
          )}

          {showNotasForm && (
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Registrar Calificaciones</h2>
              <form onSubmit={handleNotasSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Carnet del Alumno</label>
                    <select
                      name="carnet"
                      value={notasForm.carnet}
                      onChange={(e) => setNotasForm({...notasForm, carnet: e.target.value})}
                      className={styles.input}
                      required
                    >
                      <option value="">Seleccionar alumno</option>
                      {alumnos.map(alumno => (
                        <option key={alumno.carnet} value={alumno.carnet}>
                          {alumno.carnet} - {alumno.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nivel</label>
                    <select
                      name="nivel"
                      value={notasForm.nivel}
                      onChange={(e) => setNotasForm({...notasForm, nivel: e.target.value})}
                      className={styles.input}
                      required
                    >
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={n}>Nivel {n}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nota de Instrumento (0-100)</label>
                    <input
                      type="number"
                      name="notaInstrumento"
                      value={notasForm.notaInstrumento}
                      onChange={(e) => setNotasForm({...notasForm, notaInstrumento: e.target.value})}
                      min="0"
                      max="100"
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nota de Armonía (0-100)</label>
                    <input
                      type="number"
                      name="notaArmonia"
                      value={notasForm.notaArmonia}
                      onChange={(e) => setNotasForm({...notasForm, notaArmonia: e.target.value})}
                      min="0"
                      max="100"
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Registrar Calificaciones
                </button>
              </form>
            </div>
          )}

          {/* Lista de alumnos */}
          <div className={styles.alumnosList}>
            <h2 className={styles.sectionTitle}>Alumnos Registrados ({alumnos.length})</h2>
            
            {alumnos.length === 0 ? (
              <p className={styles.emptyMessage}>No hay alumnos registrados</p>
            ) : (
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div>Carnet</div>
                  <div>Nombre</div>
                  <div>Instrumento</div>
                  <div>Horario</div>
                  <div>Mensualidad</div>
                  <div>Estado</div>
                  <div>Pagos</div>
                  <div>Acciones</div>
                </div>
                {alumnos.map((alumno) => (
                  <div key={alumno.carnet} className={styles.tableRow}>
                    <div className={styles.carnet}>{alumno.carnet || '-'}</div>
                    <div>{alumno.nombre || '-'}</div>
                    <div>{alumno.instrumento || '-'}</div>
                    <div className={styles.horario}>
                      <div>{alumno.diaClases || '-'}</div>
                      <div className={styles.horarioHora}>{alumno.horarioClases || '-'}</div>
                    </div>
                    <div>{alumno.mensualidad ? `Q${Number(alumno.mensualidad).toLocaleString('es-GT')}` : 'Q0'}</div>
                    <div>
                      <span className={`${styles.badge} ${
                        alumno.estado === 'solvente' ? styles.badgeSolvente : styles.badgeInsolvente
                      }`}>
                        {alumno.estado || 'insolvente'}
                      </span>
                      {alumno.suspendido && (
                        <span className={styles.badgeSuspendido}>SUSPENDIDO</span>
                      )}
                    </div>
                    <div className={styles.pagosCell}>
                      {alumno.pagos && alumno.pagos.length > 0 ? (
                        <div className={styles.pagosList}>
                          {alumno.pagos.slice(-3).reverse().map((pago, idx) => (
                            <div key={idx} className={styles.pagoItem}>
                              <span className={styles.pagoMes}>{pago.mes || '-'} {pago.año || ''}</span>
                              <span className={styles.pagoMetodo}>
                                {pago.metodoPago || '-'}
                              </span>
                              <span className={styles.pagoFecha}>
                                {pago.fechaPago ? new Date(pago.fechaPago).toLocaleDateString('es-GT') : '-'}
                              </span>
                            </div>
                          ))}
                          {alumno.pagos.length > 3 && (
                            <div className={styles.pagoMas}>+{alumno.pagos.length - 3} más</div>
                          )}
                        </div>
                      ) : (
                        <span className={styles.noPagos}>Sin pagos</span>
                      )}
                    </div>
                    <div className={styles.actionsCell}>
                      <button 
                        onClick={() => registrarPago(alumno.carnet)}
                        className={styles.btnPagar}
                        disabled={alumno.suspendido}
                      >
                        Registrar Pago
                      </button>
                      <button 
                        onClick={() => suspenderAlumno(alumno.carnet)}
                        className={alumno.suspendido ? styles.btnActivar : styles.btnSuspender}
                      >
                        {alumno.suspendido ? 'Activar' : 'Suspender'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
