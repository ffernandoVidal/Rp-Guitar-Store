'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from './school.module.css'

// Datos de los cursos
const cursos = [
  {
    id: 1,
    instrumento: 'Guitarra',
    icono: '🎸',
    descripcionCurso: 'Aprende guitarra eléctrica y acústica desde cero o perfecciona tu técnica',
    maestro: {
      nombre: 'Profesor de Guitarra',
      foto: '/img/IMG_5043.JPG',
      descripcion: 'Guitarrista profesional con más de 15 años de experiencia en la enseñanza. Especializado en rock, blues y técnicas modernas.'
    }
  },
  {
    id: 2,
    instrumento: 'Batería',
    icono: '🥁',
    descripcionCurso: 'Domina el ritmo y aprende técnicas de batería desde nivel básico hasta avanzado',
    maestro: {
      nombre: 'Profesor de Batería',
      foto: '/img/IMG_7092.JPG',
      descripcion: 'Baterista profesional con experiencia en múltiples géneros musicales. Especializado en técnica y coordinación rítmica.'
    }
  },
  {
    id: 3,
    instrumento: 'Bajo',
    icono: '🎸',
    descripcionCurso: 'Domina el bajo eléctrico con nuestros profesores especializados',
    maestro: {
      nombre: 'Profesor de Bajo',
      foto: '/img/IMG_5043.JPG',
      descripcion: 'Bajista profesional con experiencia en estudios de grabación y presentaciones en vivo. Especializado en groove y técnica.'
    }
  },
  {
    id: 4,
    instrumento: 'Saxofón',
    icono: '🎷',
    descripcionCurso: 'Aprende saxofón con técnicas profesionales de respiración y embocadura',
    maestro: {
      nombre: 'Profesor de Saxofón',
      foto: '/img/IMG_7092.JPG',
      descripcion: 'Saxofonista con formación clásica y jazz. Especializado en técnica de viento y expresión musical.'
    }
  },
  {
    id: 5,
    instrumento: 'Violín',
    icono: '🎻',
    descripcionCurso: 'Clases de violín desde nivel principiante hasta avanzado con metodología moderna',
    maestro: {
      nombre: 'Profesor de Violín',
      foto: '/img/IMG_5043.JPG',
      descripcion: 'Violinista con formación clásica y experiencia en orquestas. Especializado en técnica de arco y lectura musical.'
    }
  },
  {
    id: 6,
    instrumento: 'Piano',
    icono: '🎹',
    descripcionCurso: 'Aprende piano con técnica clásica y moderna, teoría musical y composición',
    maestro: {
      nombre: 'Profesor de Piano',
      foto: '/img/IMG_7092.JPG',
      descripcion: 'Pianista profesional con experiencia en música clásica y contemporánea. Especializado en técnica y armonía.'
    }
  },
  {
    id: 7,
    instrumento: 'Canto',
    icono: '🎤',
    descripcionCurso: 'Técnica vocal, respiración y expresión para todos los géneros musicales',
    maestro: {
      nombre: 'Profesor de Canto',
      foto: '/img/IMG_5043.JPG',
      descripcion: 'Cantante profesional con experiencia en diversos géneros. Especializado en técnica vocal, respiración diafragmática y performance.'
    }
  }
]

// Imágenes de alumnos para el carrusel
const imagenesAlumnos = [
  '/img/IMG_5043.JPG',
  '/img/IMG_7092.JPG',
  '/img/IMG_5043.JPG',
  '/img/IMG_7092.JPG',
  '/img/IMG_5043.JPG'
]

export default function RPMusicSchoolPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imagenesAlumnos.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        <div className="container">
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <h1 className={styles.pageTitle}>RP MUSIC SCHOOL</h1>
            <p className={styles.pageDescription}>
              Academia de música con los mejores profesores
            </p>
          </section>

          {/* Carrusel de imágenes de alumnos */}
          <section className={styles.carouselSection}>
            <h2 className={styles.sectionTitle}>Nuestros Alumnos</h2>
            <div className={styles.carouselContainer}>
              <div 
                className={styles.carouselTrack}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {imagenesAlumnos.map((imagen, index) => (
                  <div key={index} className={styles.carouselSlide}>
                    <Image
                      src={imagen}
                      alt={`Alumno ${index + 1}`}
                      width={1200}
                      height={600}
                      className={styles.carouselImage}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.carouselDots}>
                {imagenesAlumnos.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${currentSlide === index ? styles.dotActive : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Sección de cursos */}
          <section className={styles.cursosSection}>
            <h2 className={styles.sectionTitle}>Nuestros Cursos</h2>
            
            <div className={styles.cursosGrid}>
              {cursos.map((curso) => (
                <Link 
                  key={curso.id} 
                  href={`/rp-music-school/${curso.instrumento.toLowerCase()}`}
                  className={styles.cursoCardLink}
                >
                  <div className={styles.cursoCard}>
                    {/* Información del maestro */}
                    <div className={styles.maestroInfo}>
                      <div className={styles.maestroFoto}>
                        <Image
                          src={curso.maestro.foto}
                          alt={curso.maestro.nombre}
                          width={80}
                          height={80}
                          className={styles.maestroImage}
                        />
                      </div>
                      <div className={styles.maestroTexto}>
                        <h3 className={styles.maestroNombre}>{curso.maestro.nombre}</h3>
                        <p className={styles.maestroDescripcion}>{curso.maestro.descripcion}</p>
                      </div>
                    </div>

                    {/* Tarjeta del curso */}
                    <div className={styles.cursoInfo}>
                      <div className={styles.cursoIcono}>{curso.icono}</div>
                      <h3 className={styles.cursoTitulo}>Clases de {curso.instrumento}</h3>
                      <p className={styles.cursoDescripcion}>{curso.descripcionCurso}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Sección de contacto */}
          <section className={styles.contactSection}>
            <h2 className={styles.sectionTitle}>¿Interesado en clases?</h2>
            <p className={styles.contactText}>
              Contáctanos para más información sobre horarios, precios y disponibilidad
            </p>
            <a href="https://wa.me/502" className={styles.contactButton}>
              Contactar por WhatsApp
            </a>
          </section>
        </div>
      </main>
    </>
  )
}
