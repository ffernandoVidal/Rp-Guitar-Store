'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './productos.module.css'

export default function AdminProductos() {
  const router = useRouter()
  const [tab, setTab] = useState('nuevo') // 'nuevo', 'lista' o 'marcas'
  const [productos, setProductos] = useState([])
  const [marcas, setMarcas] = useState([]) // Array de objetos {id, nombre}
  const [categorias, setCategorias] = useState([]) // Categorías desde DB
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroMarca, setFiltroMarca] = useState('')
  const [mostrarNuevaMarca, setMostrarNuevaMarca] = useState(false)
  const [nuevaMarca, setNuevaMarca] = useState('')
  
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    categoria_id: 1, // Ahora usamos categoria_id
    stock: 0,
    precioVenta: 0,
    precioMayorista: 0,
    descripcion: '',
    descripcionDetallada: '',
    imagenes: []
  })

  useEffect(() => {
    verificarAuth()
    cargarMarcas()
    cargarCategorias()
  }, [])

  useEffect(() => {
    if (tab === 'lista') {
      cargarProductos()
    }
  }, [tab])

  const cargarMarcas = async () => {
    try {
      const response = await fetch('/api/productos/marcas')
      if (response.ok) {
        const data = await response.json()
        setMarcas(data) // Ahora data es un array de objetos {id, nombre}
      }
    } catch (error) {
      console.error('Error al cargar marcas:', error)
    }
  }

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/api/productos/categorias')
      if (response.ok) {
        const data = await response.json()
        setCategorias(data)
        // Establecer primera categoría como default
        if (data.length > 0 && !formData.categoria_id) {
          setFormData(prev => ({ ...prev, categoria_id: data[0].id }))
        }
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    }
  }

  const verificarAuth = async () => {
    const token = sessionStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        sessionStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminRole')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error al verificar:', error)
      router.push('/admin')
    }
  }

  const cargarProductos = async () => {
    const token = sessionStorage.getItem('adminToken')
    try {
      const response = await fetch('/api/productos?includePrivate=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminRole')
    router.push('/')
  }

  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = busqueda === '' || 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.marca && producto.marca.toLowerCase().includes(busqueda.toLowerCase()))
    
    const cumpleMarca = filtroMarca === '' || 
      (producto.marca && producto.marca === filtroMarca)
    
    return cumpleBusqueda && cumpleMarca
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Convertir categoria_id a número
    if (name === 'categoria_id') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    const token = sessionStorage.getItem('adminToken')
    
    // Obtener nombre de categoría para upload
    const categoriaObj = categorias.find(c => c.id === formData.categoria_id)
    const categoriaNombre = categoriaObj ? categoriaObj.nombre.toLowerCase() : 'productos'
    
    setLoading(true)
    const nuevasImagenes = []
    
    try {
      for (const file of files) {
        const formDataImg = new FormData()
        formDataImg.append('imagen', file)
        formDataImg.append('categoria', categoriaNombre)
        
        const response = await fetch('/api/productos/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataImg
        })
        
        if (response.ok) {
          const data = await response.json()
          nuevasImagenes.push(data.url)
        }
      }
      
      setFormData({
        ...formData,
        imagenes: [...formData.imagenes, ...nuevasImagenes]
      })
      
      mostrarMensaje('success', 'Imágenes subidas exitosamente')
    } catch (error) {
      console.error('Error al subir imágenes:', error)
      mostrarMensaje('error', 'Error al subir las imágenes')
    } finally {
      setLoading(false)
    }
  }

  const removeImagen = (index) => {
    const nuevasImagenes = formData.imagenes.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      imagenes: nuevasImagenes
    })
  }

  const guardarNuevaMarca = async () => {
    if (!nuevaMarca || nuevaMarca.trim() === '') {
      mostrarMensaje('error', 'Ingrese el nombre de la marca')
      return
    }

    const token = sessionStorage.getItem('adminToken')
    
    try {
      const response = await fetch('/api/productos/marcas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nuevaMarca.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        mostrarMensaje('success', `Marca "${nuevaMarca}" creada exitosamente`)
        await cargarMarcas() // Recargar lista de marcas
        setFormData({ ...formData, marca: nuevaMarca.trim() })
        setMostrarNuevaMarca(false)
        setNuevaMarca('')
      } else {
        mostrarMensaje('error', data.error || 'Error al crear la marca')
      }
    } catch (error) {
      console.error('Error:', error)
      mostrarMensaje('error', 'Error al crear la marca')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje({ tipo: '', texto: '' })
    
    const token = sessionStorage.getItem('adminToken')
    
    if (!token) {
      mostrarMensaje('error', 'Sesión expirada. Por favor inicia sesión nuevamente.')
      router.push('/admin')
      return
    }
    
    try {
      const url = '/api/productos'
      const method = editando ? 'PUT' : 'POST'
      
      // Preparar datos en formato compatible con MySQL
      const dataToSend = {
        ...formData,
        precioVenta: parseFloat(formData.precioVenta) || 0,
        precioMayorista: parseFloat(formData.precioMayorista) || 0,
        stock: parseInt(formData.stock) || 0
      }
      
      if (editando) {
        dataToSend.id = editando
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        mostrarMensaje('success', data.message || 'Producto guardado exitosamente en MySQL')
        resetForm()
        await cargarMarcas()
        if (tab === 'lista') {
          cargarProductos()
        }
      } else {
        mostrarMensaje('error', data.error || 'Error al guardar el producto')
      }
    } catch (error) {
      console.error('Error:', error)
      mostrarMensaje('error', 'Error de conexión con la base de datos')
    } finally {
      setLoading(false)
    }
  }

  const editarProducto = (producto) => {
    setFormData({
      nombre: producto.nombre,
      marca: producto.marca,
      modelo: producto.modelo || '',
      categoria_id: producto.categoria_id || 1,
      stock: producto.stock,
      precioVenta: producto.precioVenta,
      precioMayorista: producto.precioMayorista,
      descripcion: producto.descripcion || '',
      descripcionDetallada: producto.descripcionDetallada || '',
      imagenes: producto.imagenes || []
    })
    setEditando(producto.id)
    setTab('nuevo')
  }

  const eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    
    const token = sessionStorage.getItem('adminToken')
    
    try {
      const response = await fetch(`/api/productos?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        mostrarMensaje('success', 'Producto eliminado')
        cargarProductos()
      }
    } catch (error) {
      console.error('Error:', error)
      mostrarMensaje('error', 'Error al eliminar')
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      marca: '',
      modelo: '',
      categoria_id: categorias.length > 0 ? categorias[0].id : 1,
      stock: 0,
      precioVenta: 0,
      precioMayorista: 0,
      descripcion: '',
      descripcionDetallada: '',
      imagenes: []
    })
    setEditando(null)
  }

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000)
  }

  const getStockClass = (stock) => {
    if (stock === 0) return styles.stockLow
    if (stock < 5) return styles.stockMedium
    return styles.stockHigh
  }

  const getCategoriaNombre = (categoriaId) => {
    const categoria = categorias.find(cat => cat.id === categoriaId)
    return categoria ? categoria.nombre : 'Sin categoría'
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Panel de Administración</h1>
          <p>Gestión de Productos RP GUITAR</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${tab === 'nuevo' ? styles.tabActive : ''}`}
            onClick={() => setTab('nuevo')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {editando ? (
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              ) : (
                <><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>
              )}
            </svg>
            {editando ? 'Editar Producto' : 'Nuevo Producto'}
          </button>
          <button 
            className={`${styles.tab} ${tab === 'lista' ? styles.tabActive : ''}`}
            onClick={() => setTab('lista')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            Lista de Productos
          </button>
        </div>

        {mensaje.texto && (
          <div className={`${styles.alert} ${mensaje.tipo === 'error' ? styles.alertError : styles.alertSuccess}`}>
            {mensaje.texto}
          </div>
        )}

        {tab === 'nuevo' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {editando ? (
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                ) : (
                  <><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>
                )}
              </svg>
              {editando ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Información Básica */}
              <div className={styles.formGroup}>
                <label htmlFor="nombre">
                  Nombre del Producto <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="modelo">
                  Modelo
                </label>
                <input
                  type="text"
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Ej: CM15R, Les Paul Standard"
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="marca">
                  Marca <span className={styles.required}>*</span>
                </label>
                <select
                  id="marca"
                  name="marca"
                  value={mostrarNuevaMarca ? '__nueva__' : formData.marca}
                  onChange={(e) => {
                    if (e.target.value === '__nueva__') {
                      setMostrarNuevaMarca(true)
                      setNuevaMarca('')
                      setFormData({ ...formData, marca: '' })
                    } else {
                      setMostrarNuevaMarca(false)
                      handleChange(e)
                    }
                  }}
                  required={!mostrarNuevaMarca}
                  disabled={loading}
                >
                  <option value="">Seleccionar marca</option>
                  {marcas.map(marca => (
                    <option key={marca.id} value={marca.nombre}>{marca.nombre}</option>
                  ))}
                  <option value="__nueva__">➕ Agregar nueva marca...</option>
                </select>
                {mostrarNuevaMarca && (
                  <div className={styles.nuevaMarcaContainer}>
                    <input
                      type="text"
                      placeholder="Escriba el nombre de la nueva marca"
                      value={nuevaMarca}
                      onChange={(e) => setNuevaMarca(e.target.value)}
                      disabled={loading}
                      className={styles.nuevaMarcaInput}
                    />
                    <button
                      type="button"
                      onClick={guardarNuevaMarca}
                      className={styles.guardarMarcaButton}
                      disabled={loading}
                    >
                      ✓ Guardar Marca
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarNuevaMarca(false)
                        setNuevaMarca('')
                      }}
                      className={styles.cancelarButton}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                <small className={styles.helpText}>
                  Seleccione una marca existente o agregue una nueva. Las marcas se guardan en la base de datos.
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="categoria_id">
                  Categoría <span className={styles.required}>*</span>
                </label>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                <small className={styles.helpText}>
                  La categoría determina la ubicación del producto en el menú principal y la página donde se mostrará.
                </small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="stock">
                  Stock <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="precioVenta">
                  Precio de Venta <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  id="precioVenta"
                  name="precioVenta"
                  value={formData.precioVenta}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="precioMayorista">
                  Precio Mayorista (Solo Admin)
                </label>
                <input
                  type="number"
                  id="precioMayorista"
                  name="precioMayorista"
                  value={formData.precioMayorista}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              {/* Descripciones */}
              <div className={styles.formGroup}>
                <label htmlFor="descripcion">
                  Descripción Corta
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Descripción breve del producto que aparecerá en las tarjetas..."
                  disabled={loading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="descripcionDetallada">
                  Descripción Detallada
                </label>
                <textarea
                  id="descripcionDetallada"
                  name="descripcionDetallada"
                  value={formData.descripcionDetallada}
                  onChange={handleChange}
                  rows="10"
                  placeholder="Descripción completa del producto con todos los detalles técnicos y características..."
                  disabled={loading}
                />
              </div>

              {/* Subida de Imágenes */}
              <div className={styles.formGroupFull}>
                <label>Imágenes del Producto</label>
                <div 
                  className={styles.imageUpload}
                  onClick={() => document.getElementById('imageInput').click()}
                >
                  <p>📷 Click para subir imágenes</p>
                  <small>JPG, PNG, WEBP (Máx. 5MB cada una)</small>
                  <input
                    type="file"
                    id="imageInput"
                    className={styles.imageUploadInput}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    disabled={loading}
                  />
                </div>
                
                {formData.imagenes.length > 0 && (
                  <div className={styles.imagePreview}>
                    {formData.imagenes.map((img, index) => (
                      <div key={index} className={styles.imagePreviewItem}>
                        <img src={img} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className={styles.imagePreviewRemove}
                          onClick={() => removeImagen(index)}
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  {loading ? 'Guardando...' : editando ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
                
                {editando && (
                  <button 
                    type="button"
                    className={styles.cancelButton}
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {tab === 'lista' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Productos Registrados ({productos.length})
            </h2>
            
            {/* Filtros */}
            <div className={styles.filterContainer}>
              <div className={styles.searchBox}>
                <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por nombre o marca..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <div className={styles.filterBox}>
                <select
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">Todas las marcas</option>
                  {marcas.map(marca => (
                    <option key={marca.id} value={marca.nombre}>{marca.nombre}</option>
                  ))}
                </select>
              </div>
              
              {(busqueda || filtroMarca) && (
                <button
                  className={styles.clearFilters}
                  onClick={() => {
                    setBusqueda('')
                    setFiltroMarca('')
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Limpiar filtros
                </button>
              )}
            </div>
            
            {productos.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No hay productos registrados aún</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No se encontraron productos con los filtros aplicados</p>
              </div>
            ) : (
              <div className={styles.productList}>
                {productosFiltrados.map(producto => (
                  <div key={producto.id} className={styles.productItem}>
                    <img 
                      src={producto.imagenes?.[0] || '/img/no-image.png'} 
                      alt={producto.nombre}
                      className={styles.productImage}
                    />
                    
                    <div className={styles.productInfo}>
                      <h3>{producto.nombre}</h3>
                      <p><strong>Marca:</strong> {producto.marca}</p>
                      <p><strong>Categoría:</strong> {getCategoriaNombre(producto.categoria_id)}</p>
                      <p><strong>Precio Venta:</strong> Q {producto.precioVenta.toLocaleString('es-GT')}</p>
                      <p><strong>Precio Mayorista:</strong> Q {producto.precioMayorista.toLocaleString('es-GT')}</p>
                      <p className={`${styles.productStock} ${getStockClass(producto.stock)}`}>
                        <strong>Stock:</strong> {producto.stock} unidades
                      </p>
                    </div>
                    
                    <div className={styles.productActions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => editarProducto(producto)}
                        title="Editar producto"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => eliminarProducto(producto.id)}
                        title="Eliminar producto"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
