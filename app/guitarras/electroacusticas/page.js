'use client'
import Navigation from '../../components/Navigation'
import styles from '../../amplificadores/amplificadores.module.css'

export default function GuitarrasElectroacusticas() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Guitarras Electroacústicas</h1>
            <p className={styles.subtitle}>
              Próximamente nuestra selección de guitarras electroacústicas
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <p style={{ fontSize: '18px' }}>Estamos preparando esta sección para ti.</p>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>Contáctanos para más información sobre guitarras electroacústicas.</p>
          </div>
        </div>
      </main>
    </>
  )
}
