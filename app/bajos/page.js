'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from '../guitarras/guitarras.module.css'

export default function BajosPage() {
  const [bajos, setBajos] = useState([])

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=bajos', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBajos(data.productos)
        }
      })
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className="container">
          <section className={styles.heroSection}>
            <h1 className={styles.pageTitle}>Bajos Eléctricos</h1>
            <p className={styles.pageDescription}>
              Descubre nuestra selección de bajos eléctricos profesionales
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.productsGrid}>
              {bajos.map((bajo) => (
                <ProductCard key={bajo.id} product={bajo} categoria="bajos" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
