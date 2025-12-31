'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './Navigation.module.css'
import { useState } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const router = useRouter()

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }
  
  const closeAllMenus = () => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Código especial para panel de ventas
      if (searchQuery.trim() === '0001') {
        const dineroInicial = prompt('Ingrese el dinero inicial en caja (Q):')
        
        if (dineroInicial !== null && dineroInicial.trim() !== '') {
          const monto = parseFloat(dineroInicial)
          
          if (!isNaN(monto) && monto >= 0) {
            // Registrar apertura de caja
            fetch('/api/caja', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                dineroInicial: monto,
                fecha: new Date().toISOString().split('T')[0]
              })
            }).then(() => {
              router.push('/admin-ventas')
            }).catch(err => {
              console.error('Error al registrar caja:', err)
              router.push('/admin-ventas')
            })
          } else {
            alert('Ingrese un monto válido')
            return
          }
        } else {
          return // Canceló
        }
        
        setSearchQuery('')
        setShowSearch(false)
        return
      }

      // Código especial para panel de administración de productos
      if (searchQuery.trim() === '0002') {
        const password = prompt('Ingrese la contraseña de administrador:')
        
        if (password === 'RP77') {
          // Hacer login automático con código y contraseña
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              codigo: '0002',
              password: 'RP77'
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.token) {
              localStorage.setItem('adminToken', data.token)
              router.push('/admin/productos')
            }
          })
          .catch(err => {
            console.error('Error al iniciar sesión:', err)
            router.push('/admin/productos')
          })
          
          setSearchQuery('')
          setShowSearch(false)
        } else if (password !== null) {
          alert('Contraseña incorrecta')
        }
        return
      }

      // Código especial para panel de administración de alumnos
      if (searchQuery.trim() === '000') {
        const password = prompt('Ingrese la contraseña de administrador:')
        
        if (password === 'RP2025@') {
          router.push('/rp-music-school/admin')
          setSearchQuery('')
          setShowSearch(false)
        } else if (password !== null) {
          alert('Contraseña incorrecta')
        }
        return
      }
      
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <button 
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={styles.navLogo}>
          <Link href="/">
            <Image 
              src="/img/2 (1).png" 
              alt="RP Guitar" 
              width={150}
              height={60}
              className={styles.logoImg}
              priority
            />
          </Link>
        </div>

        <ul className={`${styles.navMenu} ${mobileMenuOpen ? styles.active : ''}`}>
          <li className={`${styles.navItem} ${styles.hasDropdown}`}>
            <button 
              onClick={() => toggleDropdown('accesorios')}
              className={styles.navLink}
            >
              Accesorios
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            <ul className={`${styles.dropdownMenu} ${openDropdown === 'accesorios' ? styles.dropdownOpen : ''}`}>
              <li><Link href="/accesorios/capos" className={styles.dropdownLink} onClick={closeAllMenus}>Capos</Link></li>
              <li><Link href="/accesorios/straps" className={styles.dropdownLink} onClick={closeAllMenus}>Straps</Link></li>
              <li><Link href="/accesorios/cuerdas" className={styles.dropdownLink} onClick={closeAllMenus}>Cuerdas</Link></li>
              <li><Link href="/accesorios/vega-trem" className={styles.dropdownLink} onClick={closeAllMenus}>Vega Trem</Link></li>
              <li><Link href="/accesorios/pedestales" className={styles.dropdownLink} onClick={closeAllMenus}>Pedestales</Link></li>
              <li><Link href="/accesorios/fuentes-poder" className={styles.dropdownLink} onClick={closeAllMenus}>Fuentes de poder</Link></li>
            </ul>
          </li>
          
          <li className={`${styles.navItem} ${styles.hasDropdown}`}>
            <button 
              onClick={() => toggleDropdown('marcas')}
              className={styles.navLink}
            >
              MARCAS
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            <ul className={`${styles.dropdownMenu} ${openDropdown === 'marcas' ? styles.dropdownOpen : ''}`}>
              <li><Link href="/marcas/music-nomad" className={styles.dropdownLink} onClick={closeAllMenus}>Music Nomad</Link></li>
              <li><Link href="/marcas/lollar-pickups" className={styles.dropdownLink} onClick={closeAllMenus}>Lollar Pickups</Link></li>
              <li><Link href="/marcas/gruvegear" className={styles.dropdownLink} onClick={closeAllMenus}>Gruvegear</Link></li>
              <li><Link href="/marcas/pig-hog" className={styles.dropdownLink} onClick={closeAllMenus}>Pig Hog</Link></li>
              <li><Link href="/marcas/mgc" className={styles.dropdownLink} onClick={closeAllMenus}>MGC</Link></li>
            </ul>
          </li>

          <li className={styles.navItem}>
            <Link href="/amplificadores" className={styles.navLink} onClick={closeAllMenus}>
              Amplificadores
            </Link>
          </li>
          
          <li className={styles.navItem}>
            <Link href="/suhr" className={styles.navLink} onClick={closeAllMenus}>
              Suhr
            </Link>
          </li>
          
          <li className={styles.navItem}>
            <Link href="/guitarras" className={styles.navLink} onClick={closeAllMenus}>
              Guitarras
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link href="/bajos" className={styles.navLink} onClick={closeAllMenus}>
              Bajos
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link href="/pedales" className={styles.navLink} onClick={closeAllMenus}>
              Pedales
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link href="/rp-music-school" className={styles.navLink} onClick={closeAllMenus}>
              RP MUSIC SCHOOL
            </Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          <div className={styles.searchContainer}>
            <button 
              className={styles.searchButton}
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Buscar productos"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            {showSearch && (
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className={styles.searchInput}
                  autoFocus
                />
              </form>
            )}
          </div>
          
          <div className={styles.cartIcon}>
            <button aria-label="Carrito de compras">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
