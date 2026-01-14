'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from './amplificadores.module.css'

export default function AmplificadoresPage() {
  const [amplificadores, setAmplificadores] = useState([])
  const [amplificadoresFiltrados, setAmplificadoresFiltrados] = useState([])
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas')

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=amplificadores', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAmplificadores(data.productos)
          setAmplificadoresFiltrados(data.productos)
        }
      })
      .catch(error => console.error('Error cargando amplificadores:', error))
  }, [])

  // Obtener marcas únicas
  const marcas = ['todas', ...new Set(amplificadores.map(a => a.marca))]

  // Filtrar por marca
  const filtrarPorMarca = (marca) => {
    setMarcaSeleccionada(marca)
    if (marca === 'todas') {
      setAmplificadoresFiltrados(amplificadores)
    } else {
      const filtrados = amplificadores.filter(a => a.marca === marca)
      setAmplificadoresFiltrados(filtrados)
    }
  }

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Amplificadores</h1>
            <p className={styles.subtitle}>Encuentra el amplificador perfecto para tu sonido</p>
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
            Mostrando {amplificadoresFiltrados.length} {amplificadoresFiltrados.length === 1 ? 'amplificador' : 'amplificadores'}
            {marcaSeleccionada !== 'todas' && ` de ${marcaSeleccionada}`}
          </p>
          
          {amplificadoresFiltrados.length === 0 ? (
            <p className={styles.loading}>Cargando amplificadores...</p>
          ) : (
            <div className={styles.grid}>
              {amplificadoresFiltrados.map(amp => (
                <ProductCard key={amp.id} product={amp} categoria="amplificadores" />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
