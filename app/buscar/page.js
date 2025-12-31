'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/Navigation'
import styles from '../amplificadores/amplificadores.module.css'

export default function BuscarPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function buscarProductos() {
      try {
        const response = await fetch(`/api/productos/buscar?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setProductos(data.productos || [])
      } catch (error) {
        console.error('Error al buscar:', error)
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      buscarProductos()
    } else {
      setProductos([])
      setLoading(false)
    }
  }, [query])

  // Determinar ruta según categoría
  const getRutaProducto = (producto) => {
    if (producto.categoria === 'amplificadores') return `/amplificadores/${producto.id}`
    if (producto.categoria === 'guitarras') return `/guitarras/${producto.id}`
    if (producto.categoria === 'accesorios') return `/accesorios/${producto.id}`
    return `/productos/${producto.id}`
  }

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {query ? `Resultados para: "${query}"` : 'Búsqueda'}
            </h1>
            {productos.length > 0 && (
              <p className={styles.subtitle}>
                Se encontraron {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
              </p>
            )}
          </div>

          {loading ? (
            <p className={styles.loading}>Buscando productos...</p>
          ) : productos.length > 0 ? (
            <div className={styles.grid}>
              {productos.map(producto => (
                <Link 
                  href={getRutaProducto(producto)} 
                  key={producto.id}
                  className={styles.card}
                >
                  <div className={styles.imageContainer}>
                    <Image
                      src={producto.imagen || producto.imagenes?.[0] || '/img/placeholder.svg'}
                      alt={producto.nombre}
                      width={300}
                      height={300}
                      className={styles.image}
                    />
                    {!producto.stock && (
                      <div className={styles.agotadoBadge}>Agotado</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.brand}>{producto.marca}</div>
                    <h3 className={styles.cardTitle}>{producto.nombre}</h3>
                    <p className={styles.modelo} style={{ textTransform: 'capitalize', fontSize: '12px', color: '#666' }}>
                      {producto.categoria}
                    </p>
                    <div className={styles.priceContainer}>
                      <span className={styles.price}>Q {producto.precio.toLocaleString('es-GT')}</span>
                      <span className={styles.priceSuffix}>.00</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <p style={{ fontSize: '18px' }}>
                {query 
                  ? 'No se encontraron productos que coincidan con tu búsqueda.' 
                  : 'Ingresa un término de búsqueda para encontrar productos.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
