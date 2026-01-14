import Navigation from '../../components/Navigation'
import ProductCard from '../../components/ProductCard'
import styles from '../../amplificadores/amplificadores.module.css'
import { getProductosByCategoria } from '../../../lib/db-productos-mysql'

export const metadata = {
  title: 'Pedestales - RP Guitar Store',
  description: 'Pedestales y soportes para instrumentos',
}

async function getData() {
  try {
    const productos = await getProductosByCategoria(10) // categoria_id = 10
    return productos
  } catch (error) {
    console.error('Error al cargar pedestales:', error)
    return []
  }
}

export default async function Pedestales() {
  const productos = await getData()

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Pedestales</h1>
            <p className={styles.subtitle}>Pedestales y soportes para instrumentos</p>
          </div>
          
          {productos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <p style={{ fontSize: '18px' }}>Próximamente disponibles.</p>
              <p style={{ fontSize: '16px', marginTop: '10px' }}>Contáctanos para más información.</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
