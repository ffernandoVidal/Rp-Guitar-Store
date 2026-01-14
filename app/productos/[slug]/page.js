import Navigation from '../../components/Navigation'
import Image from 'next/image'
import styles from './producto.module.css'
import { getProductoBySlug, getAllProductos } from '@/lib/db-productos-mysql'

// Función para obtener todos los slugs de productos (necesaria para SSG)
export async function generateStaticParams() {
  try {
    const productos = await getAllProductos()
    return productos.map(producto => ({
      slug: producto.slug
    }))
  } catch (error) {
    console.error('Error al generar static params:', error)
    return []
  }
}

// Función que obtiene los datos del producto en el servidor
async function getProducto(slug) {
  try {
    const producto = await getProductoBySlug(slug)
    
    if (!producto) {
      return null
    }
    
    // Mapear al formato esperado por el componente
    return {
      name: producto.nombre,
      brand: producto.marca || 'Sin marca',
      price: producto.precio || 0,
      description: producto.descripcionDetallada || producto.descripcion || 'Sin descripción',
      specs: producto.caracteristicas || [],
      images: producto.imagenes || [],
      category: producto.categoria || 'Productos',
      inStock: producto.stock > 0,
      stock: producto.stock,
      id: producto.id,
      slug: producto.slug
    }
  } catch (error) {
    console.error('Error al obtener producto:', error)
    return null
  }
}

export default async function ProductoPage({ params }) {
  const { slug } = await params
  const producto = await getProducto(slug)

  if (!producto) {
    return (
      <>
        <Navigation />
        <main className={styles.main}>
          <div className="container">
            <h1>Producto no encontrado</h1>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className="container">
          <div className={styles.productLayout}>
            {/* Galería de imágenes */}
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                <Image
                  src={producto.images[0] || '/img/placeholder.jpg'}
                  alt={producto.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              {producto.images.length > 1 && (
                <div className={styles.thumbnails}>
                  {producto.images.map((img, index) => (
                    <div key={index} className={styles.thumbnail}>
                      <Image
                        src={img}
                        alt={`${producto.name} - ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className={styles.infoSection}>
              <div className={styles.breadcrumb}>
                <a href="/">Inicio</a> / <a href={`/${producto.category.toLowerCase()}`}>{producto.category}</a> / {producto.name}
              </div>

              <h1 className={styles.productName}>{producto.name}</h1>
              <p className={styles.brand}>{producto.brand}</p>

              <div className={styles.priceSection}>
                <span className={styles.price}>Q{producto.price.toLocaleString('es-GT')}</span>
                {producto.inStock ? (
                  <span className={styles.inStock}>✓ Disponible</span>
                ) : (
                  <span className={styles.outStock}>Agotado</span>
                )}
              </div>

              <p className={styles.description}>{producto.description}</p>

              <div className={styles.specs}>
                <h3>Especificaciones</h3>
                <ul>
                  {producto.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.actions}>
                <button className={styles.addToCartBtn}>
                  Agregar al carrito
                </button>
                <button className={styles.whatsappBtn}>
                  Consultar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
