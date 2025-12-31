'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from '../amplificadores/amplificadores.module.css'

export default function AccesoriosPage() {
  const [accesorios, setAccesorios] = useState([])

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=accesorios', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAccesorios(data.productos)
        }
      })
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Accesorios</h1>
          <p className={styles.subtitle}>Todo lo que necesitas para tu instrumento en un solo lugar</p>
          
          <div className={styles.grid}>
            {accesorios.map(accesorio => (
              <ProductCard key={accesorio.id} product={accesorio} categoria="accesorios" />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <section className={styles.heroSection}>
            <h1 className={styles.pageTitle}>Accesorios</h1>
            <p className={styles.pageDescription}>
              Todo lo que necesitas para tu instrumento en un solo lugar
            </p>
          </section>

          {loading ? (
            <div className={styles.loading}>
              <p>Cargando accesorios...</p>
            </div>
          ) : (
            <section className={styles.section}>
              <div className={styles.productsGrid}>
                {accesorios.map((accesorio) => (
                  <Link 
                    key={accesorio.id}
                    href={`/accesorios/${accesorio.slug}`}
                    className={styles.card}
                  >
                    <div className={styles.imageWrapper}>
                      <Image
                        src={accesorio.imagenes[0]}
                        alt={accesorio.nombre}
                        width={400}
                        height={400}
                        className={styles.image}
                      />
                      {accesorio.stock && (
                        <span className={styles.stockBadge}>En Stock</span>
                      )}
                    </div>
                    <div className={styles.info}>
                      <span className={styles.brand}>{accesorio.marca}</span>
                      <h3 className={styles.name}>{accesorio.nombre}</h3>
                      {accesorio.modelo && (
                        <p className={styles.modelo}>Modelo: {accesorio.modelo}</p>
                      )}
                      <div className={styles.priceContainer}>
                        <span className={styles.price}>
                          Q {accesorio.precio.toLocaleString('es-GT')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}

