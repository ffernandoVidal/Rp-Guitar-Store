'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from '../amplificadores/amplificadores.module.css'

export default function PedalesPage() {
  const [pedales, setPedales] = useState([])
  const [pedalesFiltrados, setPedalesFiltrados] = useState([])
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas')

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=pedales', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPedales(data.productos)
          setPedalesFiltrados(data.productos)
        }
      })
      .catch(error => console.error('Error:', error))
  }, [])

  // Obtener marcas únicas
  const marcas = ['todas', ...new Set(pedales.map(p => p.marca))]

  // Filtrar por marca
  const filtrarPorMarca = (marca) => {
    setMarcaSeleccionada(marca)
    if (marca === 'todas') {
      setPedalesFiltrados(pedales)
    } else {
      const filtrados = pedales.filter(p => p.marca === marca)
      setPedalesFiltrados(filtrados)
    }
  }

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Pedales de Efectos</h1>
            <p className={styles.subtitle}>
              Explora nuestra colección de pedales de efectos de las marcas más reconocidas del mundo
            </p>
          </div>

          {/* Filtro por marca */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap', 
            marginBottom: '30px',
            justifyContent: 'center'
          }}>
            {marcas.map(marca => (
              <button
                key={marca}
                onClick={() => filtrarPorMarca(marca)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: marcaSeleccionada === marca ? '#000' : '#fff',
                  color: marcaSeleccionada === marca ? '#fff' : '#000',
                  border: '2px solid #000',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (marcaSeleccionada !== marca) {
                    e.target.style.backgroundColor = '#f0f0f0'
                  }
                }}
                onMouseLeave={(e) => {
                  if (marcaSeleccionada !== marca) {
                    e.target.style.backgroundColor = '#fff'
                  }
                }}
              >
                {marca === 'todas' ? 'Todas las Marcas' : marca}
              </button>
            ))}
          </div>

          {/* Contador de resultados */}
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
            Mostrando {pedalesFiltrados.length} {pedalesFiltrados.length === 1 ? 'pedal' : 'pedales'}
            {marcaSeleccionada !== 'todas' && ` de ${marcaSeleccionada}`}
          </p>

          {pedalesFiltrados.length === 0 ? (
            <p className={styles.loading}>Cargando pedales...</p>
          ) : (
            <div className={styles.grid}>
              {pedalesFiltrados.map(pedal => (
                <ProductCard key={pedal.id} product={pedal} categoria="pedales" />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

