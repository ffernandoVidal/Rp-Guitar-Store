'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from './amplificadores.module.css'

export default function AmplificadoresPage() {
  const [amplificadores, setAmplificadores] = useState([])

  useEffect(() => {
    // Leer desde API para reflejar cambios del panel admin en tiempo real
    fetch('/api/productos/catalogo?categoria=amplificadores', {
      cache: 'no-store'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAmplificadores(data.productos)
        }
      })
      .catch(error => console.error('Error cargando amplificadores:', error))
  }, [])

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Amplificadores</h1>
          <p className={styles.subtitle}>Encuentra el amplificador perfecto para tu sonido</p>
          
          <div className={styles.grid}>
            {amplificadores.map(amp => (
              <ProductCard key={amp.id} product={amp} categoria="amplificadores" />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
