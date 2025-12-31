'use client'
import Navigation from '../../components/Navigation'
import styles from '../../amplificadores/amplificadores.module.css'

export default function MusicNomad() {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Music Nomad</h1>
            <p className={styles.subtitle}>Productos profesionales para el cuidado de instrumentos</p>
          </div>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <p style={{ fontSize: '18px' }}>Próximamente disponibles.</p>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>Contáctanos para más información sobre productos Music Nomad.</p>
          </div>
        </div>
      </main>
    </>
  )
}
