import Navigation from './components/Navigation'
import Carousel from './components/Carousel'
import ProductCard from './components/ProductCard'
import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'
import { getAllProductos } from '@/lib/db-productos-mysql'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'RP GUITAR - Tu tienda de guitarras en Guatemala',
  description: 'Guitarras, amplificadores, pedales y accesorios de las mejores marcas'
}

export default async function Home() {
  let productos = []
  try {
    productos = await getAllProductos()
  } catch (e) {
    console.error('[home] No se pudo cargar catálogo:', e)
    productos = []
  }

  const categoryConfig = [
    { id: 1, slug: 'guitarras', title: 'Guitarras' },
    { id: 2, slug: 'pedales', title: 'Pedales' },
    { id: 3, slug: 'amplificadores', title: 'Amplificadores' },
    { id: 4, slug: 'bajos', title: 'Bajos' },
    { id: 5, slug: 'accesorios', title: 'Accesorios' }
  ]

  const productosPorCategoria = categoryConfig
    .map((cat) => {
      const items = productos
        .filter((p) => Number(p.categoria_id) === cat.id)
        .slice(0, 6)

      return { ...cat, items }
    })
    .filter((cat) => cat.items.length > 0)

  return (
    <>
      <Navigation />
      
      {/* Hero Section con texto */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>RP Guitar Store</h1>
          <p className={styles.heroSubtitle}>Guitarras Eléctricas, Acústicas, Bajos, Pedales, Amplificadores Boutique en Guatemala </p>
          <p className={styles.heroTagline}>El Hogar del Tono </p>
        </div>
      </section>

      {/* Carrusel de imágenes */}
      <Carousel />

      <main className={styles.main}>
        {/* Sección: Lo que nos impulsa */}
        <section className={styles.contentSection}>
          <div className={styles.gridContainer}>
            <div className={styles.textBox}>
              <h2>LO QUE NOS IMPULSA</h2>
              <p>
                RP Guitar es una tienda enfocada en ofrecer productos de la mejor calidad para guitarristas. 
                Nos esforzamos por ofrecer productos progresivos e innovadores en la industria, cada uno precisamente de en Guatemala.
              </p>
              <Link href="/marcas" className={styles.ctaButton}>
                VER MARCAS
              </Link>
            </div>
            <div className={styles.imageBox}>
              <Image 
                src="/img/guitarras/G&L Asat Classic.png" 
                alt="Guitarra destacada"
                width={600}
                height={600}
                className={styles.contentImage}
              />
            </div>
          </div>
        </section>

        {/* Sección: Has encontrado lo mejor */}
        <section className={styles.contentSection}>
          <div className={styles.gridContainer}>
            <div className={styles.imageBox}>
              <Image 
                src="/img/guitarras/Suhr Pete Thorne.png" 
                alt="Guitarra premium"
                width={600}
                height={600}
                className={styles.contentImage}
              />
            </div>
            <div className={styles.textBox}>
              <h2>HAS ENCONTRADO LO MEJOR</h2>
              <p>
                Con más de 25 años de experiencia en la industria construyendo y reparando guitarras, fundador y luthier profesional, 
                brinda un conocimiento y habilidad que vienen con cada producto que ofrecemos. Constantemente trabajamos para ofrecer 
                la mejor experiencia de usuario posible, ya sea que estés buscando en tu garaje o frente a una multitud.
              </p>
              <Link href="/guitarras" className={styles.ctaButton}>
                VER GUITARRAS
              </Link>
            </div>
          </div>
        </section>

        {/* Sección: Producto destacado */}
        <section className={styles.contentSection}>
          <div className={styles.gridContainer}>
            <div className={styles.textBox}>
              <h2>PRODUCTO DESTACADO</h2>
              <p>
                Descubre nuestra selección exclusiva de guitarras eléctricas, pedales de efectos boutique, amplificadores de alta gama 
                y accesorios premium. Cada producto ha sido cuidadosamente seleccionado para ofrecer la mejor calidad y rendimiento a 
                nuestros clientes. Equipamiento profesional para músicos exigentes.
              </p>
              <Link href="/productos" className={styles.ctaButton}>
                VER PRODUCTOS
              </Link>
            </div>
            <div className={styles.imageBox}>
              <Image 
                src="/img/guitarras/Suhr Pete Thorne.png" 
                alt="Producto destacado"
                width={600}
                height={600}
                className={styles.contentImage}
              />
            </div>
          </div>
        </section>

        {/* Sección: Catálogo por categoría (refleja altas del panel admin) */}
        {productosPorCategoria.length > 0 ? (
          <section className={styles.catalogSection}>
            <div className={styles.catalogContainer}>
              <div className={styles.catalogHeader}>
                <h2 className={styles.catalogTitle}>NUEVOS PRODUCTOS</h2>
                <p className={styles.catalogSubtitle}>Últimos productos agregados, organizados por categoría</p>
              </div>

              {productosPorCategoria.map((cat) => (
                <div key={cat.slug} className={styles.categoryBlock}>
                  <div className={styles.categoryHeader}>
                    <h3 className={styles.categoryTitle}>{cat.title}</h3>
                    <Link className={styles.categoryLink} href={`/${cat.slug}`}>
                      Ver todos
                    </Link>
                  </div>

                  <div className={styles.catalogGrid}>
                    {cat.items.map((p) => (
                      <ProductCard key={p.id} product={p} categoria={cat.slug} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <Link href="/contacto">CONTÁCTANOS</Link>
            <span className={styles.separator}>•</span>
            <Link href="/legal">LEGAL</Link>
          </div>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="#1d1d1f"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#1d1d1f" strokeWidth="2"/>
              </svg>
            </a>
          </div>
          <p className={styles.copyright}>© Copyright RP Guitar Store 2026    |FVR|     All Rights Reserved</p>
        </div>
      </footer>
    </>
  )
}
