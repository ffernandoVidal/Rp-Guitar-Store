'use client'
import Navigation from '../../components/Navigation'
import styles from '../../amplificadores/amplificadores.module.css'

export default function VegaTrem() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Vega Trem</h1>
            <p className={styles.subtitle}>Sistemas de trémolo Vega Trem</p>
          </div>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <p style={{ fontSize: '18px' }}>Próximamente disponibles.</p>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>Contáctanos para más información.</p>
          </div>
        </div>
      </main>
    </>
  )
}
