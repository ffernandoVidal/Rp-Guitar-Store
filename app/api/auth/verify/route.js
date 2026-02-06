import { verifyToken } from '@/lib/auth-secure'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { 
          valid: false,
          error: 'NO_AUTH',
          message: 'No autorizado' 
        },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return Response.json(
        { 
          valid: false,
          error: 'INVALID_TOKEN',
          message: 'Token inválido o expirado' 
        },
        { status: 401 }
      )
    }
    
    return Response.json({
      valid: true,
      user: {
        codigo: decoded.codigo,
        username: decoded.username,
        role: decoded.role,
        userId: decoded.userId
      }
    })
    
  } catch (error) {
    console.error('Error al verificar token:', error)
    return Response.json(
      { 
        valid: false,
        error: 'SERVER_ERROR',
        message: 'Error al verificar autenticación' 
      },
      { status: 500 }
    )
  }
}

