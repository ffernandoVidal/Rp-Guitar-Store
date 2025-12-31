'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '../../../components/Navigation'
import Image from 'next/image'
import styles from './panel.module.css'

export default function PanelAlumnoPage({ params }) {
  const searchParams = useSearchParams()
  const carnet = searchParams.get('carnet') || '001'
  const instrumento = params.instrumento
  const instrumentoCapitalizado = instrumento.charAt(0).toUpperCase() + instrumento.slice(1)
  
  const [alumnoData, setAlumnoData] = useState(null)

  useEffect(() => {
    // Cargar datos del alumno desde la API
    const fetchAlumno = async () => {
      try {
        const res = await fetch(`/api/alumnos/${carnet}`)
        const data = await res.json()
        
        if (data.success) {
          setAlumnoData(data.alumno)
        } else {
          // Datos de ejemplo si no se encuentra el alumno
          setAlumnoData({
            nombre: 'Alumno de Ejemplo',
            carnet: carnet,
            foto: '/img/IMG_5043.JPG',
            estado: 'solvente',
            instrumento: instrumento,
            notas: {
              niveles: [85, 90, 78, 92, 88, 95, 82, 91],
              armonia: 87,
              instrumento: 93
            }
          })
        }
      } catch (error) {
        console.error('Error al cargar alumno:', error)
      }
    }
    
    fetchAlumno()
  }, [carnet, instrumento])

  if (!alumnoData) {
    return (
      <>
        <Navigation />
        <main className={styles.main}>
          <div className={styles.container}>
            <p>Cargando datos del alumno...</p>
          </div>
        </main>
      </>
    )
  }

  // Calcular promedio de niveles
  const niveles = Array.isArray(alumnoData.notas?.niveles) 
    ? alumnoData.notas.niveles 
    : Array(8).fill(0)
    
  const promedioNiveles = niveles.length > 0
    ? (niveles.reduce((acc, n) => acc + n, 0) / niveles.length).toFixed(1)
    : '0.0'

  // Encontrar el nivel actual del alumno (el último nivel con nota > 0)
  const nivelActual = niveles.findLastIndex(nota => nota > 0) + 1 || 1

  // Función para verificar si una nota es reposición
  const esReposicion = (nota) => nota < 60 && nota > 0

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Banner del curso */}
          <div className={styles.banner}>
            <Link href="/rp-music-school" className={styles.botonSalir}>
              ← Salir
            </Link>
            <h1 className={styles.bannerTitle}>Clases de {instrumentoCapitalizado}</h1>
            <p className={styles.bannerSubtitle}>Panel del Alumno</p>
          </div>

          {/* Panel del alumno */}
          <div className={styles.panel}>
            {/* Información del alumno */}
            <div className={styles.alumnoHeader}>
              <div className={styles.alumnoFoto}>
                <Image
                  src={alumnoData.foto || '/img/IMG_5043.JPG'}
                  alt={alumnoData.nombre}
                  width={150}
                  height={150}
                  className={styles.fotoImagen}
                />
              </div>
              <div className={styles.alumnoInfo}>
                <div className={styles.nombreConEstado}>
                  <h2 className={styles.alumnoNombre}>{alumnoData.nombre}</h2>
                  <span className={`${styles.estadoBadge} ${
                    alumnoData.estado === 'solvente' ? styles.estadoSolvente : styles.estadoInsolvente
                  }`}>
                    {alumnoData.estado === 'solvente' ? '✓ Solvente' : '⚠ Insolvente'}
                  </span>
                </div>
                <p className={styles.alumnoCarnet}>Carnet: {alumnoData.carnet}</p>
                <p className={styles.alumnoCurso}>Curso: {instrumentoCapitalizado}</p>
                <p className={styles.alumnoNivel}>Nivel Actual: {nivelActual}</p>
              </div>
            </div>

            {/* Barra de progreso principal con círculos */}
            <div className={styles.barraProgresoContainer}>
              <h3 className={styles.sectionTitle}>Progreso de Niveles</h3>
              <div className={styles.barraProgreso}>
                {niveles.map((nota, index) => (
                  <div key={index + 1} className={styles.nivelCirculoWrapper}>
                    <div 
                      className={`${styles.nivelCirculo} ${
                        nota >= 60 ? styles.circuloCompleto : 
                        nota > 0 && nota < 60 ? styles.circuloReposicion : 
                        styles.circuloPendiente
                      }`}
                    >
                      <span className={styles.numeroCirculo}>{index + 1}</span>
                    </div>
                    <div className={styles.labelCirculo}>Nivel {index + 1}</div>
                    {index < niveles.length - 1 && (
                      <div className={`${styles.lineaProgreso} ${
                        niveles[index + 1] >= 60 ? styles.lineaCompleta : styles.lineaPendiente
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de notas */}
            <div className={styles.notasSection}>
              <h3 className={styles.sectionTitle}>Calificaciones por Nivel</h3>
              
              {/* Notas de los 8 niveles */}
              <div className={styles.nivelesGrid}>
                {niveles.map((nota, index) => (
                  <div key={index + 1} className={styles.nivelCard}>
                    <div className={styles.nivelNumero}>Nivel {index + 1}</div>
                    <div className={`${styles.nivelNota} ${esReposicion(nota) ? styles.notaReposicion : ''}`}>
                      {nota > 0 ? nota : '-'}
                    </div>
                    {esReposicion(nota) && (
                      <div className={styles.reposicionLabel}>REPOSICIÓN</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Notas especiales */}
              <div className={styles.notasEspeciales}>
                <div className={styles.notaEspecialCard}>
                  <div className={styles.notaEspecialIcono}>🎼</div>
                  <div className={styles.notaEspecialInfo}>
                    <h4>Armonía</h4>
                    <div className={`${styles.notaEspecialValor} ${esReposicion(alumnoData.notas?.armonia) ? styles.notaReposicion : ''}`}>
                      {alumnoData.notas?.armonia > 0 ? alumnoData.notas?.armonia : '-'}
                    </div>
                    {esReposicion(alumnoData.notas?.armonia) && (
                      <div className={styles.reposicionLabel}>REPOSICIÓN</div>
                    )}
                  </div>
                </div>

                <div className={styles.notaEspecialCard}>
                  <div className={styles.notaEspecialIcono}>🎸</div>
                  <div className={styles.notaEspecialInfo}>
                    <h4>{instrumentoCapitalizado}</h4>
                    <div className={`${styles.notaEspecialValor} ${esReposicion(alumnoData.notas?.instrumento) ? styles.notaReposicion : ''}`}>
                      {alumnoData.notas?.instrumento > 0 ? alumnoData.notas?.instrumento : '-'}
                    </div>
                    {esReposicion(alumnoData.notas?.instrumento) && (
                      <div className={styles.reposicionLabel}>REPOSICIÓN</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Promedio general */}
              <div className={styles.promedioGeneral}>
                <h4>Promedio General de Niveles</h4>
                <div className={styles.promedioValor}>{promedioNiveles}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
