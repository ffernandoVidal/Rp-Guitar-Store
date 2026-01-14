'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from '../amplificadores/amplificadores.module.css'

export default function AccesoriosPage() {
  const [accesorios, setAccesorios] = useState([])
  const [accesoriosFiltrados, setAccesoriosFiltrados] = useState([])
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas')

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=accesorios', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAccesorios(data.productos)
          setAccesoriosFiltrados(data.productos)
        }
      })
      .catch(error => console.error('Error:', error))
  }, [])

  // Obtener marcas únicas
  const marcas = ['todas', ...new Set(accesorios.map(a => a.marca))]

  // Filtrar por marca
  const filtrarPorMarca = (marca) => {
    setMarcaSeleccionada(marca)
    if (marca === 'todas') {
      setAccesoriosFiltrados(accesorios)
    } else {
      const filtrados = accesorios.filter(a => a.marca === marca)
      setAccesoriosFiltrados(filtrados)
    }
  }

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Accesorios</h1>
            <p className={styles.subtitle}>Todo lo que necesitas para tu instrumento en un solo lugar</p>
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
            Mostrando {accesoriosFiltrados.length} {accesoriosFiltrados.length === 1 ? 'accesorio' : 'accesorios'}
            {marcaSeleccionada !== 'todas' && ` de ${marcaSeleccionada}`}
          </p>

          {accesoriosFiltrados.length === 0 ? (
            <p className={styles.loading}>Cargando accesorios...</p>
          ) : (
            <div className={styles.grid}>
              {accesoriosFiltrados.map(accesorio => (
                <ProductCard key={accesorio.id} product={accesorio} categoria="accesorios" />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

