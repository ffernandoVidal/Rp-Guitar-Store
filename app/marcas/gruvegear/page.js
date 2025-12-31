'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../../components/Navigation'
import styles from '../../amplificadores/amplificadores.module.css'

export default function GruvgearPage() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    fetch('/data/amplificadores.json')
      .then(res => res.json())
      .then(data => {
        // Filtrar productos de marca Gruvgear y Ernie Ball
        const productosGruvgear = data.amplificadores.filter(
          item => item.marca === 'Gruvgear' || item.marca === 'Ernie Ball'
        )
        setProductos(productosGruvgear)
      })
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Gruvgear</h1>
          <p className={styles.subtitle}>Accesorios innovadores para músicos profesionales</p>
          
          <div className={styles.grid}>
            {productos.map(producto => (
              <Link href={`/marcas/gruvegear/${producto.slug}`} key={producto.id} className={styles.card}>
                <div className={styles.imageContainer}>
                  <Image
                    src={producto.imagenes[0]}
                    alt={producto.nombre}
                    width={300}
                    height={300}
                    className={styles.image}
                  />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.productName}>{producto.nombre}</h3>
                  <p className={styles.brand}>{producto.marca} {producto.modelo}</p>
                  <p className={styles.price}>Q {producto.precio.toLocaleString('es-GT')}</p>
                  {producto.stock && <span className={styles.stock}>En stock</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
