'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaLock, FaChartLine, FaBox, FaShoppingCart, 
  FaGraduationCap, FaChartBar, FaDatabase, FaCog,
  FaSignOutAlt, FaTags
} from 'react-icons/fa';
import styles from './admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true });

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    const role = sessionStorage.getItem('adminRole');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      loadStats();
      checkDatabaseStatus();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminRole', data.role);
        setIsAuthenticated(true);
        setUserRole(data.role);
        loadStats();
        checkDatabaseStatus();
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error de conexión. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRole');
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/');
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      const res = await fetch('/api/admin/db-status');
      const data = await res.json();
      setDbStatus({
        connected: data.connected,
        checking: false,
        message: data.message,
        info: data.info
      });
    } catch (error) {
      setDbStatus({
        connected: false,
        checking: false,
        message: 'Error al verificar conexión'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.loginIcon}>
            <FaLock size={48} />
          </div>
          <h1>Panel de Administración</h1>
          <p>RP Guitar Store - Sistema de Gestión</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Código (ej: 0002)"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className={styles.input}
              autoComplete="off"
              maxLength="4"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              autoComplete="off"
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#666', textAlign: 'left' }}>
            <p><strong>Credenciales de prueba:</strong></p>
            <p>Admin: 0002 / RP77</p>
            <p>Empleado: 0001 / RP2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Indicador de Estado de Base de Datos */}
      <div className={styles.dbStatusBar} style={{
        background: dbStatus.checking ? '#94a3b8' : (dbStatus.connected ? '#16a34a' : '#dc2626'),
        color: 'white',
        padding: '0.5rem 3rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span>
          {dbStatus.checking ? '⏳ Verificando conexión...' : 
           dbStatus.connected ? '✓ Base de datos conectada' : '✗ Base de datos desconectada'}
        </span>
        {dbStatus.connected && dbStatus.info && (
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
            {dbStatus.info.total_productos} productos | {dbStatus.info.total_ventas} ventas | {dbStatus.info.total_alumnos} alumnos
          </span>
        )}
      </div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>RP Guitar Store</h1>
          <p className={styles.subtitle}>
            Rol: <strong>{userRole === 'admin' ? 'Administrador' : 'Empleado'}</strong>
          </p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>

      {/* Dashboard Stats */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{backgroundColor: '#2563eb'}}>
              <FaBox size={24} color="white" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.totalProductos || 0}</h3>
              <p>Productos</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{backgroundColor: '#16a34a'}}>
              <FaShoppingCart size={24} color="white" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.totalVentas || 0}</h3>
              <p>Ventas</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{backgroundColor: '#dc2626'}}>
              <FaGraduationCap size={24} color="white" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.totalAlumnos || 0}</h3>
              <p>Alumnos</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconBox} style={{backgroundColor: '#9333ea'}}>
              <FaChartLine size={24} color="white" />
            </div>
            <div className={styles.statInfo}>
              <h3>{stats.visitantes || 0}</h3>
              <p>Visitantes (Mes)</p>
            </div>
          </div>
        </div>
      )}

      {/* Módulos de Administración */}
      <div className={styles.modulesGrid}>
        <div className={styles.moduleCard} onClick={() => router.push('/admin/productos')}>
          <div className={styles.moduleIconBox} style={{backgroundColor: '#2563eb'}}>
            <FaBox size={32} color="white" />
          </div>
          <h3>Productos</h3>
          <p>Gestionar inventario y catálogo</p>
        </div>

        <div className={styles.moduleCard} onClick={() => router.push('/admin-ventas')}>
          <div className={styles.moduleIconBox} style={{backgroundColor: '#16a34a'}}>
            <FaShoppingCart size={32} color="white" />
          </div>
          <h3>Ventas</h3>
          <p>Registrar y consultar ventas</p>
        </div>

        <div className={styles.moduleCard} onClick={() => router.push('/rp-music-school/admin')}>
          <div className={styles.moduleIconBox} style={{backgroundColor: '#dc2626'}}>
            <FaGraduationCap size={32} color="white" />
          </div>
          <h3>Alumnos</h3>
          <p>Gestionar estudiantes y pagos</p>
        </div>

        <div className={styles.moduleCard} onClick={() => router.push('/admin/analytics')}>
          <div className={styles.moduleIconBox} style={{backgroundColor: '#9333ea'}}>
            <FaChartBar size={32} color="white" />
          </div>
          <h3>Analytics</h3>
          <p>Estadísticas y reportes</p>
        </div>

        {userRole === 'admin' && (
          <>
            <div className={styles.moduleCard} onClick={() => router.push('/admin/marcas')}>
              <div className={styles.moduleIconBox} style={{backgroundColor: '#f59e0b'}}>
                <FaTags size={32} color="white" />
              </div>
              <h3>Marcas</h3>
              <p>Gestionar marcas de productos</p>
            </div>

            <div className={styles.moduleCard} onClick={() => router.push('/admin-db')}>
              <div className={styles.moduleIconBox} style={{backgroundColor: '#ea580c'}}>
                <FaDatabase size={32} color="white" />
              </div>
              <h3>Base de Datos</h3>
              <p>Diagnóstico MySQL</p>
            </div>

            <div className={styles.moduleCard} onClick={() => router.push('/admin/config')}>
              <div className={styles.moduleIconBox} style={{backgroundColor: '#64748b'}}>
                <FaCog size={32} color="white" />
              </div>
              <h3>Configuración</h3>
              <p>Ajustes del sistema</p>
            </div>
          </>
        )}
      </div>

      {/* Gráfica de Productos Más Vendidos */}
      {stats && stats.productosMasVendidos && (
        <div className={styles.chartSection}>
          <h2>Productos Más Vendidos</h2>
          <div className={styles.chart}>
            {stats.productosMasVendidos.map((producto, index) => (
              <div key={index} className={styles.chartBar}>
                <div className={styles.barLabel}>{producto.nombre}</div>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar}
                    style={{ width: `${(producto.cantidad / stats.productosMasVendidos[0].cantidad) * 100}%` }}
                  >
                    {producto.cantidad}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
