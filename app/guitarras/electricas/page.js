'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import styles from '../../amplificadores/amplificadores.module.css'

export default function GuitarrasElectricas() {
  const [guitarras, setGuitarras] = useState([])

  useEffect(() => {
    fetch('/data/amplificadores.json')
      .then(res => res.json())
      .then(data => {
        const guitarrasData = data.amplificadores.filter(item => item.categoria === 'guitarras')
        setGuitarras(guitarrasData)
      })
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Guitarras Eléctricas</h1>
            <p className={styles.subtitle}>
              Descubre nuestra selección de guitarras eléctricas premium de las mejores marcas: D'Angelico, G&L, Rivolta y Suhr
            </p>
          </div>

          {guitarras.length === 0 ? (
            <p className={styles.loading}>Cargando guitarras...</p>
          ) : (
            <div className={styles.grid}>
              {guitarras.map(guitarra => (
                <Link 
                  href={`/guitarras/${guitarra.slug}`} 
                  key={guitarra.id}
                  className={styles.card}
                >
                  <div className={styles.imageContainer}>
                    <Image
                      src={guitarra.imagenes[0]}
                      alt={guitarra.nombre}
                      width={300}
                      height={300}
                      className={styles.image}
                    />
                    {!guitarra.stock && (
                      <div className={styles.agotadoBadge}>Agotada</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.brand}>{guitarra.marca}</div>
                    <h3 className={styles.cardTitle}>{guitarra.nombre}</h3>
                    <p className={styles.modelo}>{guitarra.modelo}</p>
                    <div className={styles.priceContainer}>
                      <span className={styles.price}>Q {guitarra.precio.toLocaleString('es-GT')}</span>
                      <span className={styles.priceSuffix}>.00</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
