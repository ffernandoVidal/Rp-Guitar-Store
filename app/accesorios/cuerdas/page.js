import Navigation from '../../components/Navigation'
import ProductCard from '../../components/ProductCard'
import styles from '../../amplificadores/amplificadores.module.css'
import { getProductosByCategoria } from '../../../lib/db-productos-mysql'

export const metadata = {
  title: 'Cuerdas - RP Guitar Store',
  description: 'Cuerdas de alta calidad para guitarra y bajo',
}

async function getData() {
  try {
    const productos = await getProductosByCategoria(8) // categoria_id = 8
    return productos
  } catch (error) {
    console.error('Error al cargar cuerdas:', error)
    return []
  }
}

export default async function Cuerdas() {
  const productos = await getData()

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Cuerdas</h1>
            <p className={styles.subtitle}>Cuerdas de alta calidad para guitarra y bajo</p>
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
