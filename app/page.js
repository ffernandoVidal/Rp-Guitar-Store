import Navigation from './components/Navigation'
import Carousel from './components/Carousel'
import Link from 'next/link'
import styles from './page.module.css'

// Esta función se ejecuta en el servidor (SSR)
async function getFeaturedProducts() {
  // Aquí puedes agregar lógica para obtener productos desde una API o base de datos
  return [
    {
      id: 1,
      title: 'Guitarras Eléctricas',
      description: 'Descubre nuestra colección de guitarras eléctricas de alta calidad',
      link: '/guitarras',
      icon: '🎸'
    },
    {
      id: 2,
      title: 'Amplificadores',
      description: 'Potencia tu sonido con nuestros amplificadores profesionales',
      link: '/amplificadores',
      icon: '🔊'
    },
    {
      id: 3,
      title: 'Pedales de Efectos',
      description: 'Explora los mejores pedales de marcas reconocidas',
      link: '/pedales',
      icon: '⚡'
    },
    {
      id: 4,
      title: 'Bajos',
      description: 'Bajos eléctricos de las mejores marcas',
      link: '/bajos',
      icon: '🎵'
    },
    {
      id: 5,
      title: 'Accesorios',
      description: 'Todo lo que necesitas para tu instrumento',
      link: '/accesorios',
      icon: '🎯'
    },
    {
      id: 6,
      title: 'Suhr',
      description: 'Guitarras y pedales Suhr de alta gama',
      link: '/suhr',
      icon: '⭐'
    }
  ]
}

// Componente de página con Server Side Rendering
export default async function Home() {
  // Los datos se obtienen en el servidor
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <Navigation />
      <Carousel />
      
      <main className={styles.main}>
        <section className={styles.featuredSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Nuestros Productos</h2>
            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <Link key={product.id} href={product.link} className={styles.productCard}>
                  <div className={styles.productIcon}>{product.icon}</div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <span className={styles.productLink}>
                    Ver más →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Bienvenido a RP GUITAR</h2>
            <p className={styles.infoText}>
              Tu tienda de confianza en Guatemala para guitarras eléctricas, acústicas, 
              bajos, pedales de efectos, amplificadores y accesorios musicales de las mejores marcas.
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; 2025 RP GUITAR. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  )
}
