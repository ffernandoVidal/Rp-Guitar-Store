import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return Response.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }
    
    return Response.json({
      valid: true,
      user: {
        codigo: decoded.codigo,
        role: decoded.role
      }
    })
    
  } catch (error) {
    console.error('Error al verificar token:', error)
    return Response.json(
      { error: 'Error al verificar autenticación' },
      { status: 500 }
    )
  }
}
