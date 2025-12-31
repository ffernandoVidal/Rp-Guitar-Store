'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import styles from './admin-ventas.module.css'

export default function AdminVentasPage() {
  const [ventas, setVentas] = useState([])
  const [horaActual, setHoraActual] = useState('')
  const [fechaActual, setFechaActual] = useState('')
  const [formData, setFormData] = useState({
    producto: '',
    precio: '',
    metodoPago: 'efectivo',
    tipoEntrega: 'compra',
    fecha: new Date().toISOString().split('T')[0]
  })
  const [showForm, setShowForm] = useState(false)
  const [productos, setProductos] = useState([])

  useEffect(() => {
    cargarVentas()
    cargarProductos()
    
    // Actualizar reloj cada segundo
    const intervalo = setInterval(() => {
      const ahora = new Date()
      setHoraActual(ahora.toLocaleTimeString('es-GT'))
      setFechaActual(ahora.toLocaleDateString('es-GT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
    }, 1000)
    
    return () => clearInterval(intervalo)
  }, [])

  const cargarProductos = async () => {
    try {
      const response = await fetch('/api/productos')
      const data = await response.json()
      setProductos(data.productos || [])
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const cargarVentas = async () => {
    try {
      const response = await fetch('/api/ventas')
      const data = await response.json()
      setVentas(data.ventas || [])
    } catch (error) {
      console.error('Error al cargar ventas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Venta registrada exitosamente')
        setFormData({
          producto: '',
          precio: '',
          metodoPago: 'efectivo',
          tipoEntrega: 'compra',
          fecha: new Date().toISOString().split('T')[0]
        })
        setShowForm(false)
        cargarVentas()
      }
    } catch (error) {
      alert('Error al registrar venta')
      console.error(error)
    }
  }

  const eliminarVenta = async (id) => {
    if (!confirm('¿Eliminar esta venta?')) return

    try {
      const response = await fetch(`/api/ventas/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Venta eliminada')
        cargarVentas()
      }
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const calcularTotalDia = (fecha) => {
    return ventas
      .filter(v => v.fecha === fecha)
      .reduce((sum, v) => sum + parseFloat(v.precio || 0), 0)
  }

  // Filtrar ventas del día actual
  const hoy = new Date().toISOString().split('T')[0]
  const ventasHoy = ventas.filter(v => v.fecha === hoy)
  
  const totalGeneral = ventasHoy.reduce((sum, v) => sum + parseFloat(v.precio || 0), 0)
  const totalEfectivo = ventasHoy.filter(v => v.metodoPago === 'efectivo').reduce((sum, v) => sum + parseFloat(v.precio || 0), 0)
  const totalTarjeta = ventasHoy.filter(v => v.metodoPago === 'tarjeta').reduce((sum, v) => sum + parseFloat(v.precio || 0), 0)

  const cierreDeCaja = async () => {
    if (!confirm('¿Desea realizar el cierre de caja y generar el reporte en PDF?')) return
    
    const nombreReporte = prompt('Ingrese su nombre para el reporte de cierre:')
    if (!nombreReporte || nombreReporte.trim() === '') {
      alert('Debe ingresar un nombre para continuar')
      return
    }
    
    try {
      const response = await fetch('/api/ventas/cierre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: hoy,
          ventas: ventasHoy,
          totales: {
            general: totalGeneral,
            efectivo: totalEfectivo,
            tarjeta: totalTarjeta
          },
          nombreReporte: nombreReporte.trim()
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Importar jsPDF dinámicamente
        const { default: jsPDF } = await import('jspdf')
        const autoTable = (await import('jspdf-autotable')).default
        
        const doc = new jsPDF()
        const { fecha, ventas, totales, nombreReporte } = result.data
        const totalGeneral = totales.general
        const totalEfectivo = totales.efectivo
        const totalTarjeta = totales.tarjeta
        
        // Encabezado
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('RP GUITAR', 105, 20, { align: 'center' })
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text('Reporte de Cierre de Caja Diario', 105, 28, { align: 'center' })
        
        // Línea separadora
        doc.setLineWidth(0.5)
        doc.line(20, 32, 190, 32)
        
        // Información del documento
        doc.setFontSize(10)
        doc.text(`Fecha: ${new Date(fecha).toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 40)
        doc.text(`Elaborado por: ${nombreReporte}`, 20, 46)
        doc.text(`Hora: ${new Date().toLocaleTimeString('es-GT')}`, 20, 52)
        
        // Resumen ejecutivo
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('I. RESUMEN EJECUTIVO', 20, 62)
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        // Cajas de resumen
        const boxY = 68
        
        // Total del Día
        doc.setFont('helvetica', 'bold')
        doc.text('TOTAL DEL DÍA', 45, boxY + 8, { align: 'center' })
        doc.setFontSize(14)
        doc.text(`Q ${Number(totalGeneral).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, 45, boxY + 16, { align: 'center' })
        
        // Efectivo
        doc.setFontSize(10)
        doc.text('EFECTIVO', 105, boxY + 8, { align: 'center' })
        doc.setFontSize(14)
        doc.text(`Q ${Number(totalEfectivo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, 105, boxY + 16, { align: 'center' })
        
        // Tarjeta
        doc.setFontSize(10)
        doc.text('TARJETA', 165, boxY + 8, { align: 'center' })
        doc.setFontSize(14)
        doc.text(`Q ${Number(totalTarjeta).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, 165, boxY + 16, { align: 'center' })
        
        // Detalle de transacciones
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('II. DETALLE DE TRANSACCIONES', 20, 100)
        
        const tableData = ventas.map((venta, index) => [
          (index + 1).toString().padStart(3, '0'),
          venta.fecha ? new Date(venta.fecha).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }) : '-',
          venta.producto || 'Sin descripción',
          `Q ${Number(venta.precio || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`,
          (venta.metodoPago || 'efectivo').toUpperCase(),
          venta.tipoEntrega === 'compra' ? 'COMPRA' : 'RECOGIDA'
        ])
        
        autoTable(doc, {
          startY: 105,
          head: [['No.', 'Hora', 'Producto', 'Monto', 'Pago', 'Entrega']],
          body: tableData,
          theme: 'grid',
          headStyles: { 
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9
          },
          styles: { 
            fontSize: 9,
            cellPadding: 3
          },
          columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 25 },
            2: { cellWidth: 70 },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 25, halign: 'center' },
            5: { cellWidth: 25, halign: 'center' }
          }
        })
        
        // Totales finales
        const finalY = doc.lastAutoTable.finalY + 10
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Subtotal Efectivo:`, 130, finalY)
        doc.text(`Q ${Number(totalEfectivo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, 190, finalY, { align: 'right' })
        
        doc.text(`Subtotal Tarjeta:`, 130, finalY + 6)
        doc.text(`Q ${Number(totalTarjeta).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, 190, finalY + 6, { align: 'right' })
        
        doc.text(`Total Transacciones:`, 130, finalY + 12)
        doc.text(`${ventas.length}`, 190, finalY + 12, { align: 'right' })
        
        // Total general con fondo negro
        doc.setFillColor(0, 0, 0)
        doc.rect(130, finalY + 16, 60, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.text(`TOTAL GENERAL:`, 135, finalY + 21)
        doc.text(`Q ${Number(totalGeneral).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, 185, finalY + 21, { align: 'right' })
        
        // Pie de página
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('REPORTE AUTOMÁTICO - SISTEMA DE VENTAS RP GUITAR', 105, 280, { align: 'center' })
        doc.text(`Generado: ${new Date().toLocaleString('es-GT')}`, 105, 285, { align: 'center' })
        
        // Descargar PDF
        doc.save(`cierre-${hoy}-${new Date().getTime()}.pdf`)
        
        alert('Reporte PDF descargado correctamente')
        window.location.reload()
      } else {
        alert('Error al generar el reporte: ' + (result.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el reporte: ' + error.message)
    }
  }

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Panel de Ventas</h1>
              <div className={styles.reloj}>
                <div className={styles.fecha}>{fechaActual}</div>
                <div className={styles.hora}>{horaActual}</div>
              </div>
            </div>
            <div className={styles.headerButtons}>
              <button 
                className={styles.btnCierre}
                onClick={cierreDeCaja}
              >
                Cierre de Caja
              </button>
              <button 
                className={styles.btnNuevo}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancelar' : '+ Nueva Venta'}
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className={styles.resumen}>
            <div className={styles.card}>
              <h3>Total del Día</h3>
              <p className={styles.monto}>Q{Number(totalGeneral).toLocaleString('es-GT')}</p>
            </div>
            <div className={styles.card}>
              <h3>Efectivo</h3>
              <p className={styles.monto}>Q{Number(totalEfectivo).toLocaleString('es-GT')}</p>
            </div>
            <div className={styles.card}>
              <h3>Tarjeta</h3>
              <p className={styles.monto}>Q{Number(totalTarjeta).toLocaleString('es-GT')}</p>
            </div>
            <div className={styles.card}>
              <h3>Ventas de Hoy</h3>
              <p className={styles.monto}>{ventasHoy.length}</p>
            </div>
          </div>

          {/* Formulario */}
          {showForm && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2>Registrar Nueva Venta</h2>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Producto</label>
                  <select
                    value={formData.producto}
                    onChange={(e) => {
                      const selected = productos.find(p => p.nombre === e.target.value)
                      setFormData({
                        ...formData,
                        producto: e.target.value,
                        precio: selected?.precio || ''
                      })
                    }}
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.nombre}>
                        {p.nombre} - {p.marca}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Precio (Q)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({...formData, precio: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Método de Pago</label>
                  <select
                    value={formData.metodoPago}
                    onChange={(e) => setFormData({...formData, metodoPago: e.target.value})}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Tipo de Entrega</label>
                  <select
                    value={formData.tipoEntrega}
                    onChange={(e) => setFormData({...formData, tipoEntrega: e.target.value})}
                  >
                    <option value="compra">Compra directa</option>
                    <option value="recogida">Recogieron en tienda</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.btnSubmit}>
                Registrar Venta
              </button>
            </form>
          )}

          {/* Tabla de ventas */}
          <div className={styles.tableContainer}>
            <h2>Ventas de Hoy ({hoy})</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{width: '120px', minWidth: '120px'}}>Fecha</th>
                  <th style={{width: '250px', minWidth: '250px'}}>Producto</th>
                  <th style={{width: '120px', minWidth: '120px'}}>Precio</th>
                  <th style={{width: '120px', minWidth: '120px'}}>Pago</th>
                  <th style={{width: '120px', minWidth: '120px'}}>Entrega</th>
                  <th style={{width: '120px', minWidth: '120px'}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasHoy.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center'}}>
                      No hay ventas registradas hoy
                    </td>
                  </tr>
                ) : (
                  ventasHoy.map(venta => (
                    <tr key={venta.id}>
                      <td style={{width: '120px', minWidth: '120px'}}>
                        {venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-'}
                      </td>
                      <td style={{width: '250px', minWidth: '250px'}}>
                        {venta.producto || '-'}
                      </td>
                      <td style={{width: '120px', minWidth: '120px'}}>
                        {venta.precio ? `Q${Number(venta.precio).toLocaleString('es-GT')}` : 'Q0.00'}
                      </td>
                      <td style={{width: '120px', minWidth: '120px'}}>
                        <span className={`${styles.badge} ${styles[venta.metodoPago || 'efectivo']}`}>
                          {venta.metodoPago || 'efectivo'}
                        </span>
                      </td>
                      <td style={{width: '120px', minWidth: '120px'}}>
                        <span className={styles.badge}>
                          {venta.tipoEntrega === 'compra' ? 'Compra' : venta.tipoEntrega === 'recogida' ? 'Recogida' : '-'}
                        </span>
                      </td>
                      <td style={{width: '120px', minWidth: '120px'}}>
                        <button 
                          className={styles.btnDelete}
                          onClick={() => eliminarVenta(venta.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
