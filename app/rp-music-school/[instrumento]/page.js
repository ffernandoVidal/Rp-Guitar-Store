'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '../../components/Navigation'
import styles from './login.module.css'

export default function LoginInstrumentoPage({ params }) {
  const [carnet, setCarnet] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const instrumento = params.instrumento

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Si es admin (000), verificar contraseña
    if (carnet === '000') {
      if (password === 'RP2025@') {
        router.push(`/rp-music-school/admin`)
      } else {
        setError('Contraseña incorrecta para administrador.')
      }
    } 
    // Si es carnet de alumno (por ahora solo 001)
    else if (carnet === '001' || carnet.match(/^\d{3}-\d{2}$/)) {
      router.push(`/rp-music-school/${instrumento}/panel?carnet=${carnet}`)
    } 
    else {
      setError('Carnet no válido. Por favor, intenta de nuevo.')
    }
  }

  // Capitalizar primera letra del instrumento
  const instrumentoCapitalizado = instrumento.charAt(0).toUpperCase() + instrumento.slice(1)

  // Mostrar campo de contraseña si el carnet es 000
  const handleCarnetChange = (e) => {
    const value = e.target.value
    setCarnet(value)
    setShowPassword(value === '000')
    setError('')
  }

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loginCard}>
            <div className={styles.header}>
              <h1 className={styles.title}>Clases de {instrumentoCapitalizado}</h1>
              <p className={styles.subtitle}>Ingresa tu número de carnet para acceder</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="carnet" className={styles.label}>
                  Número de Carnet
                </label>
                <input
                  type="text"
                  id="carnet"
                  value={carnet}
                  onChange={handleCarnetChange}
                  placeholder="Ingresa tu carnet (ej: 001-01 o 000 para admin)"
                  className={styles.input}
                  required
                />
              </div>

              {showPassword && (
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Contraseña de Administrador
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="Ingresa la contraseña"
                    className={styles.input}
                    required
                  />
                </div>
              )}

              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              <button type="submit" className={styles.submitButton}>
                {showPassword ? 'Acceder como Administrador' : 'Acceder al Panel'}
              </button>
            </form>

            <div className={styles.info}>
              <p>¿No tienes un carnet? Contacta con la administración</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
