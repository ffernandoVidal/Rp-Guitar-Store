import Navigation from '../components/Navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from './marcas.module.css'

async function getMarcas() {
  return [
    {
      id: 1,
      name: 'Music Nomad',
      description: 'Productos de limpieza y mantenimiento para instrumentos',
      logo: '/img/marcas/music-nomad.jpg',
      slug: 'music-nomad'
    },
    {
      id: 2,
      name: 'Lollar Pickups',
      description: 'Pastillas artesanales de alta calidad',
      logo: '/img/marcas/lollar.jpg',
      slug: 'lollar-pickups'
    },
    {
      id: 3,
      name: 'Gruvegear',
      description: 'Estuches y accesorios innovadores',
      logo: '/img/marcas/gruvegear.jpg',
      slug: 'gruvegear'
    },
    {
      id: 4,
      name: 'Pig Hog',
      description: 'Cables y accesorios profesionales',
      logo: '/img/marcas/pig-hog.jpg',
      slug: 'pig-hog'
    },
    {
      id: 5,
      name: 'MGC',
      description: 'Pedales de efectos boutique',
      logo: '/img/marcas/mgc.jpg',
      slug: 'mgc'
    }
  ]
}

export const metadata = {
  title: 'Marcas - RP GUITAR',
  description: 'Marcas representadas: Music Nomad, Lollar Pickups, Gruvegear, Pig Hog, MGC',
}

export default async function MarcasPage() {
  const marcas = await getMarcas()

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className="container">
          <section className={styles.heroSection}>
            <h1 className={styles.pageTitle}>Nuestras Marcas</h1>
            <p className={styles.pageDescription}>
              Trabajamos con las mejores marcas del mercado musical
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.marcasGrid}>
              {marcas.map((marca) => (
                <Link 
                  key={marca.id} 
                  href={`/marcas/${marca.slug}`}
                  className={styles.marcaCard}
                >
                  <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                      <h3 className={styles.marcaName}>{marca.name}</h3>
                    </div>
                  </div>
                  <div className={styles.marcaInfo}>
                    <p className={styles.marcaDescription}>{marca.description}</p>
                    <span className={styles.viewLink}>Ver productos →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
