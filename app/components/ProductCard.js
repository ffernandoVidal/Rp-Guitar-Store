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
export default function ProductCard({ product, categoria }) {
  // Determinar la categoría de la ruta
  const rutaCategoria = categoria || product.categoria || 'productos'
  
  return (
    <Link href={`/${rutaCategoria}/${product.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={product.imagenes?.[0] || '/img/placeholder.jpg'}
          alt={product.nombre}
          width={300}
          height={300}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.productName}>{product.nombre || 'Producto'}</h3>
        <p className={styles.brand}>{product.marca} {product.modelo}</p>
        <p className={styles.price}>
          Q {product.precio ? product.precio.toLocaleString('es-GT') : '0'}
        </p>
        {product.stock && <span className={styles.stock}>En stock</span>}
      </div>
    </Link>
  )
}
