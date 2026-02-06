 'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './admin.module.css'
import { useAuth } from '../(modules)/auth/useAuth'

export default function AdminPage() {
  const { apiFetch, hasPermission } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiFetch('/api/admin/stats')
        const data = await res.json().catch(() => null)
        if (mounted && data?.success) setStats(data.stats)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [apiFetch])

  return (
    <main className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Panel Admin</h1>
        <p className={styles.adminSubtitle}>Acceso controlado por roles y permisos (RBAC)</p>
      </header>

      <section className={styles.modulesGrid}>
        {hasPermission('product:read') ? (
          <Link href="/admin/products" className={styles.moduleCard}>
            <h3>Productos</h3>
            <p>CRUD y gestión de catálogo</p>
          </Link>
        ) : null}

        {hasPermission('product:read') ? (
          <Link href="/admin/categories" className={styles.moduleCard}>
            <h3>Categorías</h3>
            <p>Organización del catálogo</p>
          </Link>
        ) : null}

        {hasPermission('product:read') ? (
          <Link href="/admin/brands" className={styles.moduleCard}>
            <h3>Marcas</h3>
            <p>Catálogo de marcas</p>
          </Link>
        ) : null}

        {hasPermission('sale:read') ? (
          <Link href="/pos/sales" className={styles.moduleCard}>
            <h3>Ventas</h3>
            <p>Listado y control de ventas (POS/online)</p>
          </Link>
        ) : null}

        {hasPermission('inventory:read') ? (
          <Link href="/inventory" className={styles.moduleCard}>
            <h3>Inventario</h3>
            <p>Consulta y movimientos transaccionales</p>
          </Link>
        ) : null}

        {hasPermission('audit:read') ? (
          <Link href="/reports" className={styles.moduleCard}>
            <h3>Reportes</h3>
            <p>Auditoría y reportes</p>
          </Link>
        ) : null}
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ color: '#fff', marginBottom: 8 }}>Estado</h2>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,.75)' }}>Cargando estadísticas...</div>
        ) : stats ? (
          <div style={{ color: 'rgba(255,255,255,.85)' }}>
            Productos: {stats.totalProductos ?? '-'} · Ventas (mes): {stats.totalVentas ?? '-'} · Alumnos: {stats.totalAlumnos ?? '-'}
          </div>
        ) : (
          <div style={{ color: 'rgba(255,255,255,.75)' }}>Sin datos (o tabla legacy no disponible).</div>
        )}
      </section>
    </main>
  )
}

/* LEGACY (deshabilitado): UI antigua con sessionStorage.
  Se mantiene temporalmente en el repo solo como referencia.

       {userRole === 'admin' && (
            <>
              <button 
                className={`${styles.navButton} ${activeModule === 'marcas' ? styles.navButtonActive : ''}`}
                onClick={() => setActiveModule('marcas')}
              >
                <FaTags size={18} />
                <span>MARCAS</span>
              </button>

              <button 
                className={`${styles.navButton} ${activeModule === 'db' ? styles.navButtonActive : ''}`}
                onClick={() => setActiveModule('db')}
              >
                <FaDatabase size={18} />
                <span>BASE DE DATOS</span>
              </button>

              <button 
                className={`${styles.navButton} ${activeModule === 'config' ? styles.navButtonActive : ''}`}
                onClick={() => setActiveModule('config')}
              >
                <FaCog size={18} />
                <span>CONFIGURACIÓN</span>
              </button>
            </>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área de Contenido Derecha * /}
      <main className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <div>
            <h1>
              {activeModule === 'dashboard' && 'Administración'}
              {activeModule === 'productos' && 'Gestión de Productos'}
              {activeModule === 'ventas' && 'Gestión de Ventas'}
              {activeModule === 'alumnos' && 'Gestión de Alumnos'}
              {activeModule === 'analytics' && 'Analytics y Reportes'}
              {activeModule === 'marcas' && 'Gestión de Marcas'}
              {activeModule === 'db' && 'Base de Datos'}
              {activeModule === 'config' && 'Configuración del Sistema'}
            </h1>
            <p className={styles.headerSubtitle}>
              {activeModule === 'dashboard' && 'Gestión del sistema RP Guitar Store'}
              {activeModule === 'productos' && 'Administra tu inventario y catálogo de productos'}
              {activeModule === 'ventas' && 'Registra y consulta todas las ventas realizadas'}
              {activeModule === 'alumnos' && 'Gestiona estudiantes de RP Music School'}
              {activeModule === 'analytics' && 'Estadísticas y análisis de rendimiento'}
              {activeModule === 'marcas' && 'Administra las marcas de productos'}
              {activeModule === 'db' && 'Diagnóstico y gestión de MySQL'}
              {activeModule === 'config' && 'Configuración general del sistema'}
            </p>
          </div>
          {dbStatus.connected && dbStatus.info && (
            <div className={styles.dbInfo}>
              <span className={styles.dbIndicator}></span>
              <span>{dbStatus.info.total_productos} productos · {dbStatus.info.total_ventas} ventas · {dbStatus.info.total_alumnos} alumnos</span>
            </div>
          )}
        </div>

        {/* Contenido según módulo activo * /}
        {activeModule === 'dashboard' && (
          <>
            {/* Estadísticas * /}
            {stats && (
              <div className={styles.statsContainer}>
                <div className={styles.statBox}>
                  <div className={styles.statIcon} style={{background: '#000'}}>
                    <FaBox size={24} color="white" />
                  </div>
                  <div className={styles.statData}>
                    <h3>{stats.totalProductos || 0}</h3>
                    <p>Productos en inventario</p>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon} style={{background: '#000'}}>
                    <FaShoppingCart size={24} color="white" />
                  </div>
                  <div className={styles.statData}>
                    <h3>{stats.totalVentas || 0}</h3>
                    <p>Ventas registradas</p>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon} style={{background: '#000'}}>
                    <FaGraduationCap size={24} color="white" />
                  </div>
                  <div className={styles.statData}>
                    <h3>{stats.totalAlumnos || 0}</h3>
                    <p>Alumnos activos</p>
                  </div>
                </div>

                <div className={styles.statBox}>
                  <div className={styles.statIcon} style={{background: '#000'}}>
                    <FaChartLine size={24} color="white" />
                  </div>
                  <div className={styles.statData}>
                    <h3>{stats.visitantes || 0}</h3>
                    <p>Visitantes este mes</p>
                  </div>
                </div>
              </div>
            )}

            {/* Gráfica de productos más vendidos * /}
            {stats && stats.productosMasVendidos && stats.productosMasVendidos.length > 0 && (
              <div className={styles.chartSection}>
                <h2>Productos Más Vendidos</h2>
                <div className={styles.chartBars}>
                  {stats.productosMasVendidos.map((producto, index) => (
                    <div key={index} className={styles.chartItem}>
                      <span className={styles.chartLabel}>{producto.nombre}</span>
                      <div className={styles.chartBarContainer}>
                        <div 
                          className={styles.chartBarFill}
                          style={{ 
                            width: `${(producto.cantidad / stats.productosMasVendidos[0].cantidad) * 100}%` 
                          }}
                        >
                          <span className={styles.chartValue}>{producto.cantidad}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Módulo de Productos * /}
        {activeModule === 'productos' && (
          <div className={styles.modulePanel}>
            <ProductosModule />
          </div>
        )}

        {/* Módulo de Ventas * /}
        {activeModule === 'ventas' && (
          <div className={styles.modulePanel}>
            <VentasModule />
          </div>
        )}

        {/* Módulo de Alumnos * /}
        {activeModule === 'alumnos' && (
          <div className={styles.modulePanel}>
            <div className={styles.panelActions}>
              <button 
                className={styles.primaryButton}
                onClick={() => router.push('/rp-music-school/admin')}
              >
                <FaGraduationCap size={16} />
                Ir al Panel de RP Music School
              </button>
            </div>
            <div className={styles.panelInfo}>
              <p>Gestión completa de alumnos de la academia:</p>
              <ul>
                <li>Registrar nuevos alumnos</li>
                <li>Gestionar clases y horarios</li>
                <li>Control de pagos mensuales</li>
                <li>Asistencia y seguimiento</li>
                <li>Reportes de progreso</li>
              </ul>
            </div>
          </div>
        )}

        {/* Módulo de Analytics * /}
        {activeModule === 'analytics' && (
          <div className={styles.modulePanel}>
            <div className={styles.panelActions}>
              <button 
                className={styles.primaryButton}
                onClick={() => router.push('/admin/analytics')}
              >
                <FaChartBar size={16} />
                Ver Analytics Completos
              </button>
            </div>
            <div className={styles.panelInfo}>
              <p>Análisis y reportes del sistema:</p>
              <ul>
                <li>Reportes de ventas por período</li>
                <li>Productos más vendidos</li>
                <li>Análisis de inventario</li>
                <li>Métricas de rendimiento</li>
                <li>Exportación de datos</li>
              </ul>
            </div>
          </div>
        )}

        {/* Módulo de Marcas * /}
        {activeModule === 'marcas' && userRole === 'admin' && (
          <div className={styles.modulePanel}>
            <div className={styles.panelActions}>
              <button 
                className={styles.primaryButton}
                onClick={() => router.push('/admin/marcas')}
              >
                <FaTags size={16} />
                Gestionar Marcas y Categorías
              </button>
            </div>
            <div className={styles.panelInfo}>
              <p>Administración de marcas:</p>
              <ul>
                <li>Crear nuevas marcas</li>
                <li>Editar información de marcas</li>
                <li>Gestionar categorías</li>
                <li>Asignar productos a marcas</li>
                <li>Configurar subcategorías</li>
              </ul>
            </div>
          </div>
        )}

        {/* Módulo de Base de Datos * /}
        {activeModule === 'db' && userRole === 'admin' && (
          <div className={styles.modulePanel}>
            {!dbAuthenticated ? (
              <div className={styles.authPrompt}>
                <h3>Acceso a Base de Datos</h3>
                <p>Se requiere autenticación adicional para acceder al panel de diagnóstico MySQL</p>
                <button 
                  className={styles.primaryButton}
                  onClick={handleDbAuth}
                >
                  <FaDatabase size={16} />
                  Autenticar Acceso
                </button>
              </div>
            ) : (
              <>
                <div className={styles.dbPanel}>
                  <h3>Estado de Conexión MySQL</h3>
                  {connectionStatus && (
                    <div className={connectionStatus.success ? styles.statusSuccess : styles.statusError}>
                      {connectionStatus.success ? '✓ Conectado' : '✗ Error de conexión'}
                      <p>{connectionStatus.message}</p>
                    </div>
                  )}

                  {databaseInfo && databaseInfo.success && (
                    <div className={styles.dbInfo}>
                      <h4>Información de la Base de Datos</h4>
                      {databaseInfo.stats && (
                        <div className={styles.dbStats}>
                          <div className={styles.dbStat}>
                            <span className={styles.dbStatLabel}>Total Productos:</span>
                            <span className={styles.dbStatValue}>{databaseInfo.stats.total_productos || 0}</span>
                          </div>
                          <div className={styles.dbStat}>
                            <span className={styles.dbStatLabel}>Total Ventas:</span>
                            <span className={styles.dbStatValue}>{databaseInfo.stats.total_ventas || 0}</span>
                          </div>
                          <div className={styles.dbStat}>
                            <span className={styles.dbStatLabel}>Total Alumnos:</span>
                            <span className={styles.dbStatValue}>{databaseInfo.stats.total_alumnos || 0}</span>
                          </div>
                        </div>
                      )}

                      {databaseInfo.tables && databaseInfo.tables.length > 0 && (
                        <div className={styles.tablesInfo}>
                          <h4>Tablas de la Base de Datos</h4>
                          <ul>
                            {databaseInfo.tables.map((table, i) => (
                              <li key={i}>
                                <strong>{table.Tables_in_rp_guitar}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={styles.panelActions}>
                    <button 
                      className={styles.primaryButton}
                      onClick={checkDbConnection}
                      disabled={loading}
                    >
                      {loading ? 'Verificando...' : 'Refrescar Estado'}
                    </button>
                    <button 
                      className={styles.secondaryButton}
                      onClick={() => setDbAuthenticated(false)}
                    >
                      Cerrar Acceso DB
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Módulo de Configuración * /}
        {activeModule === 'config' && userRole === 'admin' && (
          <div className={styles.modulePanel}>
            <div className={styles.panelActions}>
              <button 
                className={styles.primaryButton}
                onClick={() => router.push('/admin/config')}
              >
                <FaCog size={16} />
                Ir a Configuración
              </button>
            </div>
            <div className={styles.panelInfo}>
              <p>Configuración del sistema:</p>
              <ul>
                <li>Ajustes generales</li>
                <li>Gestión de usuarios</li>
                <li>Permisos y roles</li>
                <li>Configuración de email</li>
                <li>Parámetros del sistema</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

*/
