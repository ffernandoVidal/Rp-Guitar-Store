import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Credenciales del administrador
const ADMIN_CODE = '0002'
const ADMIN_PASSWORD = 'RP77'
const JWT_SECRET = 'rp-guitar-secret-key-2025-admin-panel'

// Hash de la contraseña (para comparación)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10)

// Verificar credenciales de administrador
export function verifyAdminCredentials(codigo, password) {
  if (codigo !== ADMIN_CODE) {
    return false
  }
  
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
}

// Generar token JWT
export function generateToken(codigo) {
  return jwt.sign(
    { 
      codigo,
      role: 'admin',
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
