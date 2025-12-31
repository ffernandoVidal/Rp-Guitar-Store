'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navigation from '../../../components/Navigation'
import styles from '../../../amplificadores/[slug]/detalle.module.css'

export default function DetalleGruvgear() {
  const params = useParams()
  const [producto, setProducto] = useState(null)
  const [imagenActual, setImagenActual] = useState(0)

  useEffect(() => {
    fetch('/data/amplificadores.json')
      .then(res => res.json())
      .then(data => {
        const prod = data.amplificadores.find(a => a.slug === params.slug)
        setProducto(prod)
      })
      .catch(error => console.error('Error:', error))
  }, [params.slug])

  if (!producto) {
    return (
      <>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.container}>
            <p className={styles.loading}>Cargando...</p>
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
          <div className={styles.grid}>
            {/* Galería de imágenes */}
            <div className={styles.gallerySection}>
              <div className={styles.mainImage}>
                <Image
                  src={producto.imagenes[imagenActual]}
                  alt={producto.nombre}
                  width={600}
                  height={600}
                  className={styles.image}
                />
              </div>
              <div className={styles.thumbnails}>
                {producto.imagenes.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenActual(index)}
                    className={`${styles.thumbnail} ${imagenActual === index ? styles.active : ''}`}
                  >
                    <Image
                      src={img}
                      alt={`${producto.nombre} - vista ${index + 1}`}
                      width={100}
                      height={100}
                      className={styles.thumbnailImage}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Información del producto */}
            <div className={styles.infoSection}>
              <div className={styles.brand}>{producto.marca}</div>
              <h1 className={styles.title}>{producto.nombre}</h1>
              <p className={styles.modelo}>Modelo: {producto.modelo}</p>
              
              {producto.stock && (
                <div className={styles.stock}>
                  <span className={styles.stockBadge}>✓ En stock</span>
                  <span className={styles.stockText}>Disponible para entrega inmediata</span>
                </div>
              )}

              <div className={styles.priceSection}>
                <span className={styles.price}>Q {producto.precio.toLocaleString('es-GT')}</span>
                <span className={styles.priceSuffix}>.00</span>
              </div>

              <div className={styles.description}>
                <h2 className={styles.sectionTitle}>Descripción</h2>
                <p>{producto.descripcion}</p>
              </div>

              {producto.caracteristicas && producto.caracteristicas.length > 0 && (
                <div className={styles.caracteristicas}>
                  <h2 className={styles.sectionTitle}>Características</h2>
                  <ul className={styles.caracteristicasList}>
                    {producto.caracteristicas.map((car, index) => (
                      <li key={index}>{car}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.actions}>
                <button className={styles.btnWhatsapp}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </button>
                <button className={styles.btnCall}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Llamar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
