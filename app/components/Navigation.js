'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './Navigation.module.css'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../(modules)/auth/useAuth'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [catalogCategories, setCatalogCategories] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(false)
  const userMenuRef = useRef(null)
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }
  
  const closeAllMenus = () => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
    setUserMenuOpen(false)
  }

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadCatalog() {
      setCatalogLoading(true)
      try {
        const res = await fetch('/api/catalog/categories', { cache: 'no-store' })
        const data = await res.json().catch(() => null)
        if (!cancelled) {
          setCatalogCategories(Array.isArray(data?.categories) ? data.categories : [])
        }
      } catch (e) {
        console.warn('No se pudieron cargar categorías del catálogo:', e)
        if (!cancelled) setCatalogCategories([])
      } finally {
        if (!cancelled) setCatalogLoading(false)
      }
    }

    loadCatalog()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
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

        {/* Logo / Marca */}
        <div className={styles.navBrand}>
          <Link href="/" onClick={closeAllMenus} className={styles.brandLink}>
            <Image 
              src="/img/LOGO RP.jpg" 
              alt="RP Guitar" 
              width={80}
              height={80}
              className={styles.logoImg}
              priority
            />
          </Link>
        </div>

        {/* Menú Principal (centrado) */}
        <ul className={`${styles.navMenu} ${mobileMenuOpen ? styles.active : ''}`}>
          <li className={`${styles.navItem} ${styles.hasDropdown}`}>
            <button 
              onClick={() => toggleDropdown('catalogo')}
              className={styles.navLink}
            >
              CATÁLOGO
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            <ul className={`${styles.dropdownMenu} ${openDropdown === 'catalogo' ? styles.dropdownOpen : ''}`}>
              <li>
                <Link href="/productos" className={styles.dropdownLink} onClick={closeAllMenus}>
                  Ver todo
                </Link>
              </li>

              {catalogLoading ? (
                <li>
                  <span className={styles.dropdownLink} style={{ opacity: 0.7, cursor: 'default' }}>
                    Cargando...
                  </span>
                </li>
              ) : catalogCategories.length ? (
                catalogCategories.flatMap((cat) => {
                  const items = [
                    <li key={`cat-${cat.id}`}>
                      <Link
                        href={`/catalogo/${cat.id}`}
                        className={styles.dropdownLink}
                        onClick={closeAllMenus}
                      >
                        {cat.name}
                      </Link>
                    </li>,
                  ]

                  if (Array.isArray(cat.children) && cat.children.length) {
                    for (const child of cat.children) {
                      items.push(
                        <li key={`child-${child.id}`}>
                          <Link
                            href={`/catalogo/${child.id}`}
                            className={`${styles.dropdownLink} ${styles.dropdownLinkChild}`}
                            onClick={closeAllMenus}
                          >
                            {child.name}
                          </Link>
                        </li>
                      )
                    }
                  }

                  return items
                })
              ) : (
                <li>
                  <span className={styles.dropdownLink} style={{ opacity: 0.7, cursor: 'default' }}>
                    Sin categorías
                  </span>
                </li>
              )}
            </ul>
          </li>

          <li className={styles.navItem}>
            <Link href="/guitarras" className={styles.navLink} onClick={closeAllMenus}>
              GUITARRAS
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/pedales" className={styles.navLink} onClick={closeAllMenus}>
              PEDALES
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/amplificadores" className={styles.navLink} onClick={closeAllMenus}>
              AMPLIFICADORES
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/bajos" className={styles.navLink} onClick={closeAllMenus}>
              BAJOS
            </Link>
          </li>

          <li className={`${styles.navItem} ${styles.hasDropdown}`}>
            <button 
              onClick={() => toggleDropdown('accesorios')}
              className={styles.navLink}
            >
              ACCESORIOS
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
            <Link href="/rp-music-school" className={styles.navLink} onClick={closeAllMenus}>
              RP MUSIC SCHOOL
            </Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          <div className={styles.userMenu} ref={userMenuRef}>
            <button
              className={styles.userButton}
              onClick={() => {
                setOpenDropdown(null)
                setUserMenuOpen(!userMenuOpen)
              }}
              aria-label={isAuthenticated ? 'Cuenta (sesión iniciada)' : 'Cuenta (sin sesión)'}
              aria-expanded={userMenuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span
                className={`${styles.userStatusDot} ${isAuthenticated ? styles.userStatusOn : styles.userStatusOff}`}
                aria-hidden="true"
              />
            </button>

            <div className={`${styles.userDropdown} ${userMenuOpen ? styles.userDropdownOpen : ''}`} role="menu">
              {isAuthenticated ? (
                <>
                  <button
                    className={styles.userDropdownItem}
                    onClick={() => {
                      setUserMenuOpen(false)
                      router.push('/dashboard')
                    }}
                    role="menuitem"
                  >
                    {user?.email ? user.email : 'Dashboard'}
                  </button>
                  <button
                    className={styles.userDropdownItem}
                    onClick={async () => {
                      setUserMenuOpen(false)
                      await handleLogout()
                    }}
                    role="menuitem"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={styles.userDropdownItem}
                  onClick={() => {
                    setUserMenuOpen(false)
                    closeAllMenus()
                  }}
                  role="menuitem"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>

          <div className={styles.searchContainer}>
            <button 
              className={styles.searchButton}
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Buscar productos"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
