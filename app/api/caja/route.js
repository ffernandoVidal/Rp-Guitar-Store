import { getConnection } from '@/lib/db-mysql'
import { requireAnyPermission } from '@/lib/rbac-complete'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function ensureCajaTable(pool) {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS caja_registros (
      caja_id INT AUTO_INCREMENT PRIMARY KEY,
      dinero_inicial DECIMAL(10,2) NOT NULL,
      fecha DATE NOT NULL,
      creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      creado_por INT NULL,
      INDEX idx_caja_fecha (fecha)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  )
}

// POST - Registrar dinero inicial en caja
async function postHandler(request) {
  try {
    const body = await request.json()
    const { dineroInicial, fecha } = body

    if (dineroInicial === undefined || !fecha) {
      return NextResponse.json(
        { error: 'Dinero inicial y fecha son requeridos' },
        { status: 400 }
      )
    }

    const pool = getConnection()
    await ensureCajaTable(pool)

    const userId = request.user?.userId ?? null

    const [result] = await pool.query(
      'INSERT INTO caja_registros (dinero_inicial, fecha, creado_por) VALUES (?, ?, ?)',
      [Number(dineroInicial), String(fecha).slice(0, 10), userId]
    )

    return Response.json(
      {
        success: true,
        caja: {
          id: result.insertId,
          dineroInicial: Number(dineroInicial),
          fecha: String(fecha).slice(0, 10),
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al registrar caja:', error)
    return Response.json(
      { success: false, error: 'SERVER_ERROR', message: 'Error al registrar dinero en caja' },
      { status: 500 }
    )
  }
}

// GET - Obtener registros de caja
async function getHandler() {
  try {
    const pool = getConnection()
    await ensureCajaTable(pool)

    const [rows] = await pool.query(
      'SELECT caja_id AS id, dinero_inicial AS dineroInicial, DATE_FORMAT(fecha, "%Y-%m-%d") AS fecha, creado_en AS fechaRegistro FROM caja_registros ORDER BY caja_id DESC LIMIT 200'
    )

    return Response.json({ success: true, cajas: rows })
  } catch (error) {
    console.error('Error al obtener cajas:', error)
    return Response.json(
      { success: false, error: 'SERVER_ERROR', message: 'Error al obtener registros de caja' },
      { status: 500 }
    )
  }
}

export const POST = requireAnyPermission(['sale:create_pos', 'sale:read', 'admin:access'])(postHandler)
export const GET = requireAnyPermission(['sale:read', 'admin:access'])(getHandler)
