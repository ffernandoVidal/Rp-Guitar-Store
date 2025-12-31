'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from '../guitarras/guitarras.module.css'

export default function PedalesPage() {
  const [pedales, setPedales] = useState([])

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=pedales', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPedales(data.productos)
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
            <h1 className={styles.pageTitle}>Pedales de Efectos</h1>
            <p className={styles.pageDescription}>
              Explora nuestra colección de pedales de efectos de las marcas más reconocidas del mundo
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.productsGrid}>
              {pedales.map((pedal) => (
                <ProductCard key={pedal.id} product={pedal} categoria="pedales" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

