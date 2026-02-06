import Link from 'next/link'
import Image from 'next/image'
import styles from './ProductCard.module.css'

/**
 * Componente ProductCard - Tarjeta de producto universal
 * 
 * @param {Object} product - Objeto del producto con los siguientes campos:
 * @param {string} product.id - ID único del producto
 * @param {string} product.nombre - Nombre completo del producto (ej: "Cort CM15R Dark Blue")
 * @param {string} product.slug - Slug para la URL
 * @param {string} product.marca - Marca del producto (ej: "Cort")
 * @param {string} product.modelo - Modelo del producto (ej: "CM15R")
 * @param {number} product.precio - Precio en quetzales
 * @param {string[]} product.imagenes - Array de URLs de imágenes
 * @param {boolean} product.stock - Disponibilidad en stock
 * @param {string} product.categoria - Categoría (amplificadores, guitarras, accesorios, etc)
 */
export default function ProductCard({ product, producto, categoria, showWholesale = false }) {
  const item = product || producto || null

  if (!item) {
    return null
  }

  // Determinar la categoría de la ruta
  const rutaCategoria = categoria || item.categoria || 'productos'

  const nombre = item.nombre || item.name || 'Producto'
  const marca = item.marca || item.brand_name || item.brand || ''
  const modelo = item.modelo || item.sku || ''
  const precio =
    item.precio !== undefined
      ? item.precio
      : item.precioVenta !== undefined
        ? item.precioVenta
        : item.price !== undefined
          ? item.price
          : 0

  const precioMayorista =
    item.precioMayorista !== undefined
      ? item.precioMayorista
      : item.cost !== undefined
        ? item.cost
        : null

  const stockNum = Number(item.stock ?? 0)
  const enStock = Number.isFinite(stockNum) ? stockNum > 0 : !!item.stock

  const rawImagen = item.imagenes?.[0] || item.imagen || item.image || item.images?.[0] || ''

  const imagen = (() => {
    const v = String(rawImagen || '').trim()
    if (!v) return '/img/placeholder.svg'
    if (v.includes('placeholder.jpg')) return '/img/placeholder.svg'
    // Normalizar rutas mal formadas
    if (v.startsWith('/public/')) return v.replace('/public/', '/')
    if (v.startsWith('public/')) return `/${v.replace(/^public\//, '')}`
    if (v.startsWith('http://') || v.startsWith('https://')) return v
    if (v.startsWith('/')) return v
    return `/${v}`
  })()

  const slug = item.slug || (item.id ? String(item.id) : '')
  const href = slug ? `/${rutaCategoria}/${slug}` : `/${rutaCategoria}`
  
  return (
    <Link href={href} className={`${styles.card}${!enStock ? ` ${styles.cardDisabled}` : ''}`}>
      <div className={styles.imageContainer}>
        <Image
          src={imagen}
          alt={nombre}
          width={300}
          height={300}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.productName}>{nombre}</h3>
        <p className={styles.brand}>{[marca, modelo].filter(Boolean).join(' ')}</p>
        <p className={styles.price}>
          Q {Number(precio || 0).toLocaleString('es-GT')}
        </p>

        {showWholesale && precioMayorista !== null && precioMayorista !== undefined && precioMayorista !== '' ? (
          <p className={styles.brand}>
            Mayorista: Q {Number(precioMayorista || 0).toLocaleString('es-GT')}
          </p>
        ) : null}

        {enStock ? (
          <span className={styles.stock}>En stock ({stockNum})</span>
        ) : (
          <span className={styles.stockOut}>Agotado</span>
        )}
      </div>
    </Link>
  )
}
