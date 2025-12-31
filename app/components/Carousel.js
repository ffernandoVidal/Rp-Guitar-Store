'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './Carousel.module.css'

const carouselImages = [
  { src: '/img/IMG_5043.JPG', alt: 'RP Guitar Store 1' },
  { src: '/img/IMG_7092.JPG', alt: 'RP Guitar Store 2' },
  { src: '/img/WhatsApp Image 2023-07-07 at 10.08.18 (1).jpeg', alt: 'RP Guitar Store 3' },
  { src: '/img/WhatsApp Image 2023-07-07 at 10.08.18.jpeg', alt: 'RP Guitar Store 4' },
  { src: '/img/WhatsApp Image 2023-07-07 at 10.08.19.jpeg', alt: 'RP Guitar Store 5' },
  { src: '/img/WhatsApp Image 2023-07-07 at 10.08.20.jpeg', alt: 'RP Guitar Store 6' },
  { src: '/img/WhatsApp Image 2025-08-19 at 11.24.19 AM (1).jpeg', alt: 'RP Guitar Store 7' },
  { src: '/img/WhatsApp Image 2025-08-19 at 11.24.19 AM (2).jpeg', alt: 'RP Guitar Store 8' },
  { src: '/img/WhatsApp Image 2025-08-19 at 11.24.19 AM.jpeg', alt: 'RP Guitar Store 9' },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <div key={index} className={styles.carouselSlide}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: 'contain' }}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        <button 
          className={`${styles.carouselBtn} ${styles.prev}`} 
          onClick={goToPrevious}
          aria-label="Anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button 
          className={`${styles.carouselBtn} ${styles.next}`} 
          onClick={goToNext}
          aria-label="Siguiente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        <div className={styles.carouselDots}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
