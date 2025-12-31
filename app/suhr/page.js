import Navigation from '../components/Navigation'
import ProductCard from '../components/ProductCard'
import styles from './suhr.module.css'

async function getSuhrProducts() {
  return {
    guitarras: [
      {
        id: 1,
        name: 'Suhr Classic T',
        brand: 'Suhr Guitars',
        description: 'Guitarra tipo Telecaster con hardware premium',
        slug: 'classic-t',
        image: '/img/IMG_5043.JPG',
        isNew: true
      },
      {
        id: 2,
        name: 'Suhr Modern',
        brand: 'Suhr Guitars',
        description: 'Guitarra con diseño moderno y pastillas Suhr',
        slug: 'modern',
        image: '/img/IMG_7092.JPG'
      },
      {
        id: 3,
        name: 'Suhr Custom',
        brand: 'Suhr Guitars',
        description: 'Guitarra personalizada de alta gama',
        slug: 'custom',
        image: '/img/2 (1).png'
      }
    ],
    pedales: [
      {
        id: 4,
        name: 'Suhr Pedal Setup',
        brand: 'Suhr Effects',
        description: 'Configuración completa de pedales Suhr',
        slug: 'pedal-setup',
        image: '/img/gruvgear.jpg'
      },
      {
        id: 5,
        name: 'Suhr Drive',
        brand: 'Suhr Effects',
        description: 'Pedal de overdrive premium',
        slug: 'drive',
        image: '/img/Lollar-Logo-small.jpg'
      }
    ]
  }
}

export const metadata = {
  title: 'Suhr - RP GUITAR',
  description: 'Guitarras y pedales Suhr - Instrumentos y efectos de la más alta calidad',
}

export default async function SuhrPage() {
  const products = await getSuhrProducts()

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className="container">
          <section className={styles.heroSection}>
            <h1 className={styles.pageTitle}>SUHR</h1>
            <p className={styles.pageDescription}>
              Guitarras y pedales de efectos de la más alta calidad artesanal
            </p>
            <div className={styles.brandInfo}>
              <p>
                Suhr es reconocida mundialmente por fabricar instrumentos y efectos de la más alta 
                calidad, utilizando materiales premium y técnicas artesanales que resultan en 
                productos excepcionales para músicos profesionales.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Guitarras Suhr</h2>
            <div className={styles.productsGrid}>
              {products.guitarras.map((producto) => (
                <ProductCard key={producto.id} product={producto} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pedales Suhr</h2>
            <div className={styles.productsGrid}>
              {products.pedales.map((producto) => (
                <ProductCard key={producto.id} product={producto} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
