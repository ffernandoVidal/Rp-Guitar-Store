import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getConnection } from './db-mysql'

// Credenciales del administrador (fallback)
const ADMIN_CODE = '0002'
const ADMIN_PASSWORD = 'RP77'
const JWT_SECRET = 'rp-guitar-secret-key-2025-admin-panel'

// Hash de la contraseña (para comparación)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10)

// Verificar credenciales desde MySQL
export async function verifyUserCredentials(codigo, password) {
  try {
    const connection = getConnection()
    
    // Buscar usuario por username o código formateado
    const [users] = await connection.query(`
      SELECT 
        u.user_id,
        u.username,
        u.pass_hash,
        u.activo,
        r.nombre as role
      FROM usuarios u
      JOIN roles r ON u.role_id = r.role_id
      WHERE (u.username = ? OR LPAD(u.user_id, 4, '0') = ?) AND u.activo = 1
    `, [codigo, codigo])
    
    if (users.length === 0) {
      // Fallback: verificar admin hardcoded
      if (codigo === ADMIN_CODE && password === ADMIN_PASSWORD) {
        return { 
          codigo: ADMIN_CODE, 
          role: 'admin',
          userId: 0 
        }
      }
      return null
    }
    
    const user = users[0]
    
    // Verificar password
    // Nota: En producción, pass_hash debe ser bcrypt hash
    // Por ahora aceptamos password directo para testing
    const isValid = user.pass_hash === password || 
                    bcrypt.compareSync(password, user.pass_hash)
    
    if (!isValid) {
      return null
    }
    
    return {
      codigo: String(user.user_id).padStart(4, '0'),
      username: user.username,
      role: user.role,
      userId: user.user_id
    }
    
  } catch (error) {
    console.error('Error verificando credenciales:', error)
    
    // Fallback: verificar admin hardcoded
    if (codigo === ADMIN_CODE && password === ADMIN_PASSWORD) {
      return { 
        codigo: ADMIN_CODE, 
        role: 'admin',
        userId: 0 
      }
    }
    
    return null
  }
}

// Verificar credenciales de administrador (mantener para compatibilidad)
export function verifyAdminCredentials(codigo, password) {
  if (codigo !== ADMIN_CODE) {
    return false
  }
  
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
}

// Generar token JWT
export function generateToken(codigo, role = 'admin', userId = null) {
  return jwt.sign(
    { 
      codigo,
      role,
      userId,
      timestamp: Date.now()
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  )
}

// Verificar token JWT
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Middleware para verificar autenticación
export function requireAuth(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado' })
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }
    
    req.user = decoded
    return handler(req, res)
  }
}
