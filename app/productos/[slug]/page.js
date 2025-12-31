import Navigation from '../../components/Navigation'
import Image from 'next/image'
import styles from './producto.module.css'

// Función para obtener todos los slugs de productos (necesaria para SSG)
export async function generateStaticParams() {
  // Aquí podrías obtener todos los productos de una API
  return [
    { slug: 'suhr-classic-t' },
    { slug: 'gl-legacy' },
    { slug: 'rivolta-combinata' },
    { slug: 'cort-cm15r' },
  ]
}

// Función que obtiene los datos del producto en el servidor
async function getProducto(slug) {
  // Simulación de datos - en producción vendría de una API/DB
  const productos = {
    'suhr-classic-t': {
      name: 'Suhr Classic T',
      brand: 'Suhr Guitars',
      price: 35000,
      description: 'La Suhr Classic T es una guitarra tipo Telecaster fabricada con los más altos estándares de calidad. Cuenta con maderas premium seleccionadas, pastillas Suhr de alta fidelidad y hardware de primera calidad.',
      specs: [
        'Cuerpo: Aliso premium',
        'Mástil: Arce con perfil moderno',
        'Diapasón: Palisandro o Arce',
        'Pastillas: Suhr V60LP (puente) y V60 (mástil)',
        'Hardware: Puente Gotoh vintage',
        'Acabado: Nitrocelulosa'
      ],
      images: [
        '/img/IMG_5043.JPG',
        '/img/IMG_7092.JPG'
      ],
      category: 'Guitarras',
      inStock: true
    },
    'gl-legacy': {
      name: 'G&L Legacy',
      brand: 'G&L Guitars',
      price: 28000,
      description: 'La G&L Legacy es el diseño clásico de Leo Fender mejorado con tecnología moderna. Ofrece un sonido versátil y construcción sólida.',
      specs: [
        'Cuerpo: Aliso',
        'Mástil: Arce con perfil C',
        'Pastillas: G&L MFD',
        'Trémolo: G&L Dual-Fulcrum',
        'Hardware: Cromado'
      ],
      images: [
        '/img/IMG_7092.JPG',
        '/img/IMG_5043.JPG'
      ],
      category: 'Guitarras',
      inStock: true
    },
    'rivolta-combinata': {
      name: 'Rivolta Combinata',
      brand: 'Rivolta Guitars',
      price: 32000,
      description: 'Guitarra semi-hollow con diseño vintage italiano. Combina estética clásica con sonido moderno.',
      specs: [
        'Cuerpo: Semi-hollow',
        'Mástil: Arce',
        'Pastillas: Lollar P-90',
        'Hardware: Cromado vintage',
        'Acabado: Lacado tradicional'
      ],
      images: [
        '/img/2 (1).png',
        '/img/gruvgear.jpg'
      ],
      category: 'Guitarras',
      inStock: true
    },
    'cort-cm15r': {
      name: 'Cort CM15R',
      brand: 'Cort',
      price: 1500,
      description: 'Amplificador combo de 15W ideal para práctica. Incluye reverb digital y entrada para audífonos.',
      specs: [
        'Potencia: 15W',
        'Parlante: 8 pulgadas',
        'Canales: 2 (Clean & Drive)',
        'Efectos: Reverb digital',
        'Controles: Gain, Volume, Treble, Bass, Reverb'
      ],
      images: [
        '/img/cort-cm-series-cm15r-amplifier-hero.jpg'
      ],
      category: 'Amplificadores',
      inStock: true
    }
  }

  return productos[slug] || null
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
                  src={producto.images[0]}
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
