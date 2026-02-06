import getConnection from '@/lib/db-mysql'
import { requireAnyPermission, requirePermission } from '@/lib/rbac-complete'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function tableExists(connection, tableName) {
  const [rows] = await connection.query('SHOW TABLES LIKE ?', [tableName])
  return Array.isArray(rows) && rows.length > 0
}

function safeUsernameFromEmail(email, fallback) {
  const e = String(email || '').trim().toLowerCase()
  if (!e || !e.includes('@')) return fallback
  const prefix = e.split('@')[0]
  return prefix || fallback
}

async function ensureUniqueLegacyUsername(connection, usernameBase, userId) {
  let candidate = String(usernameBase || '').trim()
  if (!candidate) candidate = `user_${userId}`

  const [exists] = await connection.query('SELECT 1 FROM usuarios WHERE username = ? LIMIT 1', [candidate])
  if (!Array.isArray(exists) || exists.length === 0) return candidate

  // Evita colisiones sin bucles largos
  const withId = `${candidate}_${userId}`
  const [exists2] = await connection.query('SELECT 1 FROM usuarios WHERE username = ? LIMIT 1', [withId])
  if (!Array.isArray(exists2) || exists2.length === 0) return withId

  return `user_${userId}`
}

async function resolveLegacyRoleId(connection, roles) {
  const isAdmin = Array.isArray(roles) && roles.includes('admin')
  const target = isAdmin ? 'admin' : 'empleado'

  // Soporta roles(name) del schema nuevo y roles(nombre) legacy
  const [rows] = await connection.query(
    'SELECT role_id FROM roles WHERE name = ? OR nombre = ? LIMIT 1',
    [target, target]
  )
  if (Array.isArray(rows) && rows.length) return rows[0].role_id

  // Fallback seguro: primer rol disponible
  const [anyRole] = await connection.query('SELECT role_id FROM roles ORDER BY role_id ASC LIMIT 1')
  return Array.isArray(anyRole) && anyRole.length ? anyRole[0].role_id : null
}

async function resolveVentasUserId(connection, requestUser) {
  const authUserId = requestUser?.userId ?? null
  if (authUserId === null || authUserId === undefined) return { ok: false, error: 'UNAUTHORIZED', message: 'Usuario no autenticado' }

  // Si no existe esquema legacy, usar el id del auth.
  const hasUsuarios = await tableExists(connection, 'usuarios')
  if (!hasUsuarios) return { ok: true, userId: authUserId }

  // 1) Si existe por ID exacto, ya es compatible
  const [byId] = await connection.query('SELECT user_id FROM usuarios WHERE user_id = ? LIMIT 1', [authUserId])
  if (Array.isArray(byId) && byId.length) return { ok: true, userId: byId[0].user_id }

  // 2) Intentar mapear por email/username
  const email = requestUser?.email ? String(requestUser.email).trim().toLowerCase() : null
  if (email) {
    const [byEmail] = await connection.query('SELECT user_id FROM usuarios WHERE email = ? LIMIT 1', [email])
    if (Array.isArray(byEmail) && byEmail.length) return { ok: true, userId: byEmail[0].user_id }
  }

  // 3) Si existe tabla nueva `users`, sincronizar creando registro legacy
  const hasUsers = await tableExists(connection, 'users')
  if (!hasUsers) {
    return {
      ok: false,
      error: 'USER_MAPPING_FAILED',
      message: 'No se pudo mapear el usuario actual a la tabla legacy usuarios (falta tabla users).'
    }
  }

  const [usersRow] = await connection.query(
    'SELECT user_id, email, password_hash, status, full_name FROM users WHERE user_id = ? LIMIT 1',
    [authUserId]
  )
  if (!Array.isArray(usersRow) || usersRow.length === 0) {
    return {
      ok: false,
      error: 'USER_MAPPING_FAILED',
      message: 'No existe el usuario autenticado en la tabla users para sincronizar a usuarios.'
    }
  }

  const u = usersRow[0]
  const roleId = await resolveLegacyRoleId(connection, requestUser?.roles)
  if (!roleId) {
    return {
      ok: false,
      error: 'USER_MAPPING_FAILED',
      message: 'No se pudo resolver role_id para crear usuario legacy.'
    }
  }

  const legacyEmail = String(u.email || email || '').trim().toLowerCase() || null
  const usernameBase = safeUsernameFromEmail(legacyEmail, `user_${u.user_id}`)
  const username = await ensureUniqueLegacyUsername(connection, usernameBase, u.user_id)
  const activo = String(u.status || '').toLowerCase() === 'disabled' ? 0 : 1

  try {
    await connection.query(
      `INSERT INTO usuarios (user_id, role_id, username, email, pass_hash, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [u.user_id, roleId, username, legacyEmail, u.password_hash, activo]
    )
  } catch (err) {
    // Si hubo conflicto por email/username y ya existe, intentar devolver el existente.
    if (legacyEmail) {
      const [existing] = await connection.query('SELECT user_id FROM usuarios WHERE email = ? LIMIT 1', [legacyEmail])
      if (Array.isArray(existing) && existing.length) return { ok: true, userId: existing[0].user_id }
    }
    return {
      ok: false,
      error: 'USER_MAPPING_FAILED',
      message: 'No se pudo crear usuario legacy en usuarios para cumplir FK de ventas.'
    }
  }

  return { ok: true, userId: u.user_id }
}

async function ensureVentasTables(connection) {
  await connection.query(
    `CREATE TABLE IF NOT EXISTS ventas (
      venta_id INT AUTO_INCREMENT PRIMARY KEY,
      venta_codigo VARCHAR(32) NULL,
      fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      sale_type VARCHAR(16) NOT NULL DEFAULT 'POS',
      status VARCHAR(16) NOT NULL DEFAULT 'PAID',
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      discount DECIMAL(10,2) NOT NULL DEFAULT 0,
      tax DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      payment_method VARCHAR(24) NULL,
      payment_amount DECIMAL(10,2) NULL,
      employee_id INT NULL,
      customer_name VARCHAR(120) NULL,
      customer_email VARCHAR(120) NULL,
      customer_phone VARCHAR(40) NULL,
      notes TEXT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actualizado_en DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_ventas_fecha (fecha_venta),
      INDEX idx_ventas_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  )

  // Si la tabla ya existía, CREATE TABLE IF NOT EXISTS no agrega columnas.
  // Aseguramos columnas mínimas para evitar fallos de SELECT/INSERT.
  const [ventaCols] = await connection.query('SHOW COLUMNS FROM ventas')
  const ventaColSet = new Set((Array.isArray(ventaCols) ? ventaCols : []).map((c) => String(c.Field || '').toLowerCase()))

  const ensureVentaColumn = async (name, ddl) => {
    if (ventaColSet.has(String(name).toLowerCase())) return
    try {
      await connection.query(`ALTER TABLE ventas ADD COLUMN ${ddl}`)
      ventaColSet.add(String(name).toLowerCase())
    } catch {
      // Si no se puede alterar (permisos/engine), evitamos tumbar la API.
    }
  }

  await ensureVentaColumn('venta_codigo', 'venta_codigo VARCHAR(32) NULL')
  await ensureVentaColumn('fecha_venta', "fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP")
  await ensureVentaColumn('sale_type', "sale_type VARCHAR(16) NOT NULL DEFAULT 'POS'")
  await ensureVentaColumn('status', "status VARCHAR(16) NOT NULL DEFAULT 'PAID'")
  await ensureVentaColumn('subtotal', 'subtotal DECIMAL(10,2) NOT NULL DEFAULT 0')
  await ensureVentaColumn('discount', 'discount DECIMAL(10,2) NOT NULL DEFAULT 0')
  await ensureVentaColumn('tax', 'tax DECIMAL(10,2) NOT NULL DEFAULT 0')
  await ensureVentaColumn('total', 'total DECIMAL(10,2) NOT NULL DEFAULT 0')
  await ensureVentaColumn('payment_method', 'payment_method VARCHAR(24) NULL')
  await ensureVentaColumn('payment_amount', 'payment_amount DECIMAL(10,2) NULL')
  await ensureVentaColumn('employee_id', 'employee_id INT NULL')
  await ensureVentaColumn('customer_name', 'customer_name VARCHAR(120) NULL')
  await ensureVentaColumn('customer_email', 'customer_email VARCHAR(120) NULL')
  await ensureVentaColumn('customer_phone', 'customer_phone VARCHAR(40) NULL')
  await ensureVentaColumn('notes', 'notes TEXT NULL')
  await ensureVentaColumn('creado_en', "creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP")
  await ensureVentaColumn('actualizado_en', 'actualizado_en DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP')

  await connection.query(
    `CREATE TABLE IF NOT EXISTS detalle_venta (
      detalle_id INT AUTO_INCREMENT PRIMARY KEY,
      venta_id INT NOT NULL,
      producto_id INT NOT NULL,
      producto_nombre VARCHAR(255) NOT NULL,
      producto_sku VARCHAR(80) NULL,
      cantidad INT NOT NULL,
      precio_unitario DECIMAL(10,2) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_detalle_venta_venta (venta_id),
      INDEX idx_detalle_venta_producto (producto_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  )
}

function toInt(value) {
  const n = parseInt(String(value), 10)
  return Number.isFinite(n) ? n : null
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function clampInt(value, { min, max, fallback }) {
  const n = toInt(value)
  if (n === null) return fallback
  return Math.min(Math.max(n, min), max)
}

function mapPaymentMethodLegacy(value) {
  const v = String(value || '').toUpperCase()
  if (v === 'CARD') return { upper: 'TARJETA', lower: 'tarjeta' }
  if (v === 'TRANSFER') return { upper: 'TRANSFERENCIA', lower: 'transferencia' }
  if (v === 'MIXED') return { upper: 'MIXTO', lower: 'mixto' }
  if (v === 'OTHER') return { upper: 'EFECTIVO', lower: 'efectivo' }
  return { upper: 'EFECTIVO', lower: 'efectivo' }
}

function pickFirstEnumValue(mysqlType) {
  const t = String(mysqlType || '')
  const m = t.match(/^enum\((.*)\)$/i)
  if (!m) return null
  const raw = m[1]
  // Extrae el primer valor entre comillas simples
  const m2 = raw.match(/^\s*'((?:\\'|[^'])*)'/)
  if (!m2) return null
  return m2[1].replace(/\\'/g, "'")
}

async function findExistingTable(connection, candidates) {
  for (const name of candidates) {
    const [rows] = await connection.query('SHOW TABLES LIKE ?', [name])
    if (Array.isArray(rows) && rows.length) return name
  }
  return null
}

async function getVentas(request) {
  const pool = getConnection()
  const { searchParams } = new URL(request.url)

  const limit = clampInt(searchParams.get('limit'), { min: 1, max: 200, fallback: 50 })
  const status = (searchParams.get('status') || '').trim()
  const search = (searchParams.get('search') || '').trim()

  await ensureVentasTables(pool)

  const where = []
  const params = []

  if (status) {
    where.push('v.status = ?')
    params.push(status)
  }

  if (search) {
    where.push('(v.venta_codigo LIKE ? OR CAST(v.venta_id AS CHAR) LIKE ?)')
    const q = `%${search}%`
    params.push(q, q)
  }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await pool.query(
    `SELECT 
      v.venta_id,
      v.venta_codigo,
      v.sale_type,
      v.status,
      v.total,
      v.fecha_venta,
      v.creado_en
     FROM ventas v
     ${whereSQL}
     ORDER BY v.venta_id DESC
     LIMIT ?`,
    [...params, limit]
  )

  const sales = (Array.isArray(rows) ? rows : []).map((r) => ({
    sale_id: r.venta_id,
    sale_code: r.venta_codigo || `V-${String(r.venta_id).padStart(6, '0')}`,
    sale_type: r.sale_type || 'POS',
    status: r.status || 'PAID',
    total: Number(r.total || 0),
    created_at: r.fecha_venta || r.creado_en,
  }))

  // Adjuntar nombres de productos (para UI/admin), usando el snapshot guardado en detalle_venta.
  const saleIds = sales.map((s) => s.sale_id).filter((id) => Number.isFinite(id) && id > 0)
  if (saleIds.length) {
    const placeholders = saleIds.map(() => '?').join(',')
    const [items] = await pool.query(
      `SELECT venta_id, producto_nombre
       FROM detalle_venta
       WHERE venta_id IN (${placeholders})
       ORDER BY venta_id DESC, detalle_id ASC`,
      saleIds
    )

    const bySaleId = new Map()
    for (const it of (Array.isArray(items) ? items : [])) {
      const vid = Number(it.venta_id)
      if (!Number.isFinite(vid)) continue
      const name = String(it.producto_nombre || '').trim()
      if (!name) continue
      if (!bySaleId.has(vid)) bySaleId.set(vid, new Set())
      bySaleId.get(vid).add(name)
    }

    for (const s of sales) {
      const set = bySaleId.get(s.sale_id)
      s.products = set ? Array.from(set) : []
    }
  } else {
    for (const s of sales) s.products = []
  }

  return Response.json({ success: true, sales })
}

async function createVenta(request) {
  const connection = await getConnection().getConnection()

  try {
    const body = await request.json().catch(() => null)

    const saleType = String(body?.sale_type || 'POS').toUpperCase()
    const paymentMethod = body?.payment_method ? String(body.payment_method) : 'CASH'

    const saleItems = Array.isArray(body?.sale_items) ? body.sale_items : []
    if (!saleItems.length) {
      return Response.json({ success: false, error: 'EMPTY_ITEMS', message: 'La venta debe tener al menos un producto' }, { status: 400 })
    }

    await ensureVentasTables(connection)

    const authUserId = request.user?.userId ?? null
    const paymentMap = mapPaymentMethodLegacy(body?.payment_method)
    const now = new Date()

    const hasInventoryTable = await tableExists(connection, 'inventory')

    await connection.beginTransaction()

    try {
      // Validar y bloquear productos
      const normalizedItems = []

      for (const item of saleItems) {
        const productId = toInt(item?.product_id)
        const quantity = toInt(item?.quantity)
        const unitPriceInput = toNumber(item?.unit_price)

        if (!productId || !quantity || quantity <= 0) {
          await connection.rollback()
          return Response.json(
            { success: false, error: 'VALIDATION_ERROR', message: 'Items inválidos' },
            { status: 400 }
          )
        }

        const [rows] = await connection.query(
          `SELECT producto_id, nombre, modelo, precio_venta, stock, activo
           FROM productos
           WHERE producto_id = ? AND activo = 1
           FOR UPDATE`,
          [productId]
        )

        if (!rows.length) {
          await connection.rollback()
          return Response.json(
            { success: false, error: 'PRODUCT_NOT_FOUND', message: `Producto ${productId} no encontrado o inactivo` },
            { status: 404 }
          )
        }

        const p = rows[0]
        const currentStock = Number(p.stock || 0)
        if (currentStock < quantity) {
          await connection.rollback()
          return Response.json(
            {
              success: false,
              error: 'INSUFFICIENT_STOCK',
              message: `Stock insuficiente para ${p.nombre}. Disponible: ${currentStock}, solicitado: ${quantity}`,
              product: { product_id: productId, name: p.nombre, available_stock: currentStock, requested: quantity }
            },
            { status: 400 }
          )
        }

        const unitPrice = unitPriceInput !== null ? unitPriceInput : Number(p.precio_venta || 0)
        normalizedItems.push({
          product_id: productId,
          name: p.nombre,
          sku: p.modelo || null,
          stock_before: currentStock,
          quantity,
          unit_price: unitPrice,
          subtotal: quantity * unitPrice,
        })
      }

      let subtotal = 0
      for (const it of normalizedItems) subtotal += Number(it.subtotal || 0)

      const discount = toNumber(body?.discount) ?? 0
      const tax = toNumber(body?.tax) ?? 0
      const total = toNumber(body?.total) ?? (subtotal - discount + tax)

      const paymentAmount = toNumber(body?.payment_amount) ?? total

      // Compatibilidad con múltiples esquemas legacy de la tabla `ventas`.
      const [ventaColsRaw] = await connection.query('SHOW COLUMNS FROM ventas')
      const ventaCols = Array.isArray(ventaColsRaw) ? ventaColsRaw : []
      const metaByField = new Map(ventaCols.map((c) => [String(c.Field || ''), c]))
      const hasField = (name) => metaByField.has(name)

      // Si la tabla `ventas` requiere FK hacia `usuarios`, resolvemos/creamos el usuario legacy.
      let ventaUserId = authUserId
      if (hasField('user_id') || hasField('vendedor_id')) {
        const resolved = await resolveVentasUserId(connection, request.user)
        if (!resolved.ok) {
          await connection.rollback()
          return Response.json(
            {
              success: false,
              error: resolved.error,
              message: resolved.message,
            },
            { status: resolved.error === 'UNAUTHORIZED' ? 401 : 400 }
          )
        }
        ventaUserId = resolved.userId
      }

      const insert = { cols: [], values: [] }
      const add = (name, value) => {
        if (!hasField(name)) return
        insert.cols.push(name)
        insert.values.push(value)
      }

      // Campos del esquema actual (si existen)
      add('venta_codigo', null)
      add('fecha_venta', now)
      add('sale_type', saleType)
      add('status', saleType === 'POS' ? 'PAID' : 'PENDING')
      add('subtotal', subtotal)
      add('discount', discount)
      add('tax', tax)
      add('total', total)
      add('payment_method', paymentMethod)
      add('payment_amount', paymentAmount)
      add('employee_id', body?.employee_id ?? authUserId)
      add('customer_name', body?.customer_name ?? null)
      add('customer_email', body?.customer_email ?? null)
      add('customer_phone', body?.customer_phone ?? null)
      add('notes', body?.notes ?? null)
      add('creado_en', now)
      add('actualizado_en', now)

      // Esquemas legacy conocidos (DB/database-mysql.sql, DB/actualizacion-seguridad.sql, etc.)
      add('user_id', ventaUserId)
      add('vendedor_id', ventaUserId)
      add('tipo_pago', paymentMap.upper)
      add('tipo_entrega', body?.tipo_entrega ?? body?.tipoEntrega ?? 'DIRECTA')
      add('descuento', discount)
      add('observaciones', body?.notes ?? body?.observaciones ?? null)
      add('cliente', body?.customer_name ?? body?.cliente ?? 'Consumidor final')
      add('telefono', body?.customer_phone ?? body?.telefono ?? null)
      add('email', body?.customer_email ?? body?.email ?? null)
      add('metodo_pago', paymentMap.lower)
      add('estado', saleType === 'POS' ? 'COMPLETADA' : 'PENDIENTE')

      // Si el esquema tiene columnas NOT NULL sin default, intentamos llenarlas con valores seguros.
      // (Preferimos fallar con mensaje claro en vez de inventar datos peligrosos.)
      const filled = new Set(insert.cols)
      const missingRequired = []

      for (const c of ventaCols) {
        const field = String(c.Field || '')
        if (!field) continue
        if (filled.has(field)) continue
        const extra = String(c.Extra || '').toLowerCase()
        if (extra.includes('auto_increment')) continue
        const nullable = String(c.Null || '').toUpperCase() === 'YES'
        const hasDefault = c.Default !== null && c.Default !== undefined
        if (nullable || hasDefault) continue
        missingRequired.push({ field, type: c.Type })
      }

      if (missingRequired.length) {
        // Intento 1: rellenar enums con el primer valor, números con 0, fechas con now.
        for (const m of missingRequired) {
          const type = String(m.type || '').toLowerCase()
          let value = ''
          if (type.startsWith('enum(')) {
            value = pickFirstEnumValue(m.type) ?? ''
          } else if (type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double')) {
            value = 0
          } else if (type.includes('date') || type.includes('time')) {
            value = now
          }

          insert.cols.push(m.field)
          insert.values.push(value)
          filled.add(m.field)
        }
      }

      const colsSql = insert.cols.map((c) => `\`${c}\``).join(', ')
      const placeholders = insert.cols.map(() => '?').join(', ')

      let saleResult
      try {
        ;[saleResult] = await connection.query(
          `INSERT INTO ventas (${colsSql}) VALUES (${placeholders})`,
          insert.values
        )
      } catch (err) {
        // Mensaje más específico para depurar rápidamente
        console.error('Error insert ventas (legacy):', {
          code: err?.code,
          errno: err?.errno,
          sqlState: err?.sqlState,
          message: err?.message,
          sqlMessage: err?.sqlMessage
        })
        throw err
      }

      const saleId = saleResult.insertId
      const saleCode = `V-${String(saleId).padStart(6, '0')}`

      // Guardar código si existe la columna
      if (hasField('venta_codigo')) {
        await connection.query('UPDATE ventas SET venta_codigo = ? WHERE venta_id = ?', [saleCode, saleId])
      }

      // Insertar detalle en la tabla disponible
      const detailTable = await findExistingTable(connection, ['detalle_venta', 'detalle_ventas', 'venta_detalle'])
      if (!detailTable) {
        await connection.rollback()
        return Response.json(
          { success: false, error: 'DETAIL_TABLE_MISSING', message: 'No existe tabla de detalle de ventas (detalle_venta/detalle_ventas/venta_detalle)' },
          { status: 500 }
        )
      }

      const [detailColsRaw] = await connection.query(`SHOW COLUMNS FROM ${detailTable}`)
      const detailCols = Array.isArray(detailColsRaw) ? detailColsRaw : []
      const detailFields = new Set(detailCols.map((c) => String(c.Field || '')))

      for (const it of normalizedItems) {
        if (detailTable === 'detalle_venta') {
          await connection.query(
            `INSERT INTO detalle_venta (
              venta_id,
              producto_id,
              producto_nombre,
              producto_sku,
              cantidad,
              precio_unitario,
              subtotal
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [saleId, it.product_id, it.name, it.sku, it.quantity, it.unit_price, it.subtotal]
          )
        } else if (detailTable === 'detalle_ventas') {
          // Esquema más simple (sin snapshot nombre/sku)
          const cols = []
          const vals = []
          const push = (name, value) => {
            if (!detailFields.has(name)) return
            cols.push(name)
            vals.push(value)
          }
          push('venta_id', saleId)
          push('producto_id', it.product_id)
          push('cantidad', it.quantity)
          push('precio_unitario', it.unit_price)
          push('subtotal', it.subtotal)

          await connection.query(
            `INSERT INTO detalle_ventas (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
            vals
          )
        } else {
          // venta_detalle (usa total_linea)
          const cols = []
          const vals = []
          const push = (name, value) => {
            if (!detailFields.has(name)) return
            cols.push(name)
            vals.push(value)
          }
          push('venta_id', saleId)
          push('producto_id', it.product_id)
          push('cantidad', it.quantity)
          push('precio_unitario', it.unit_price)
          push('total_linea', it.subtotal)

          await connection.query(
            `INSERT INTO venta_detalle (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`,
            vals
          )
        }

        await connection.query(
          'UPDATE productos SET stock = GREATEST(0, stock - ?) WHERE producto_id = ?',
          [it.quantity, it.product_id]
        )

        // Si existe el esquema nuevo de inventario, también lo actualizamos (best-effort).
        // Esto permite que /inventory refleje ventas hechas desde POS legacy cuando IDs coinciden.
        if (hasInventoryTable) {
          try {
            await connection.query(
              'UPDATE inventory SET stock_current = GREATEST(0, stock_current - ?), last_movement_at = NOW() WHERE product_id = ?',
              [it.quantity, it.product_id]
            )
          } catch {
            // No tumbar la venta si inventory no está alineado.
          }
        }
      }

      // Alertas de stock bajo (<= 3) calculadas con el stock legacy.
      const lowStock = []
      for (const it of normalizedItems) {
        const remaining = Math.max(0, Number(it.stock_before || 0) - Number(it.quantity || 0))
        if (remaining <= 3) {
          lowStock.push({
            product_id: it.product_id,
            name: it.name,
            remaining_stock: remaining
          })
        }
      }

      await connection.commit()

      return Response.json(
        {
          success: true,
          message: 'Venta creada exitosamente',
          sale: {
            sale_id: saleId,
            sale_code: saleCode,
            sale_type: saleType,
            subtotal,
            discount,
            tax,
            total,
            status: saleType === 'POS' ? 'PAID' : 'PENDING',
            items: normalizedItems,
          },
          alerts: {
            lowStock
          }
        },
        { status: 201 }
      )
    } catch (e) {
      await connection.rollback()
      throw e
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ success: false, error: 'INVALID_JSON', message: 'JSON inválido' }, { status: 400 })
    }

    console.error('Error creando venta (legacy):', error)
    return Response.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Error al procesar la venta',
        details:
          process.env.NODE_ENV === 'development'
            ? {
                message: error?.message,
                code: error?.code,
                errno: error?.errno,
                sqlState: error?.sqlState,
                sqlMessage: error?.sqlMessage
              }
            : undefined,
      },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}

export const GET = requirePermission('sale:read')(getVentas)
export const POST = requireAnyPermission(['sale:create_pos', 'sale:create'])(createVenta)
