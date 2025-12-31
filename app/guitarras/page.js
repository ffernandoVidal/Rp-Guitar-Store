'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from '../amplificadores/amplificadores.module.css'

export default function Guitarras() {
  const [guitarras, setGuitarras] = useState([])
  const [guitarrasFiltradas, setGuitarrasFiltradas] = useState([])
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas')

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=guitarras', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const soloGuitarras = data.productos
          
          // Ordenar: eléctricas primero, luego electroacústicas y acústicas al final
          const ordenadas = soloGuitarras.sort((a, b) => {
            const tipoA = a.tipo || 'electrica'
            const tipoB = b.tipo || 'electrica'
            
            if (tipoA === 'electrica' && tipoB !== 'electrica') return -1
            if (tipoA !== 'electrica' && tipoB === 'electrica') return 1
            return 0
          })
          
          setGuitarras(ordenadas)
          setGuitarrasFiltradas(ordenadas)
        }
      })
      .catch(error => console.error('Error:', error))
  }, [])

  // Obtener marcas únicas
  const marcas = ['todas', ...new Set(guitarras.map(g => g.marca))]

  // Filtrar por marca
  const filtrarPorMarca = (marca) => {
    setMarcaSeleccionada(marca)
    if (marca === 'todas') {
      setGuitarrasFiltradas(guitarras)
    } else {
      const filtradas = guitarras.filter(g => g.marca === marca)
      setGuitarrasFiltradas(filtradas)
    }
  }

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Guitarras</h1>
            <p className={styles.subtitle}>
              Descubre nuestra selección completa de guitarras de las mejores marcas
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
            Mostrando {guitarrasFiltradas.length} {guitarrasFiltradas.length === 1 ? 'guitarra' : 'guitarras'}
            {marcaSeleccionada !== 'todas' && ` de ${marcaSeleccionada}`}
          </p>

          {guitarrasFiltradas.length === 0 ? (
            <p className={styles.loading}>Cargando guitarras...</p>
          ) : (
            <div className={styles.grid}>
              {guitarrasFiltradas.map(guitarra => (
                <ProductCard key={guitarra.id} product={guitarra} categoria="guitarras" />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
