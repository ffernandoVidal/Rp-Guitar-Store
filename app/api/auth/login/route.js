import { verifyUserCredentials, verifyAdminCredentials, generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { codigo, password } = await request.json()
    
    // Verificar credenciales desde MySQL primero
    const user = await verifyUserCredentials(codigo, password)
    
    if (!user) {
      // Fallback: verificar admin hardcoded
      const isValidAdmin = verifyAdminCredentials(codigo, password)
      
      if (!isValidAdmin) {
        return Response.json(
          { error: 'Credenciales inválidas' },
          { status: 401 }
        )
      }
      
      // Admin hardcoded
      const token = generateToken(codigo, 'admin', 0)
      
      return Response.json({
        success: true,
        token,
        role: 'admin',
        message: 'Inicio de sesión exitoso'
      })
    }
    
    // Usuario de MySQL
    const token = generateToken(user.codigo, user.role, user.userId)
    
    return Response.json({
      success: true,
      token,
      role: user.role,
      username: user.username,
      message: 'Inicio de sesión exitoso'
    })
    
  } catch (error) {
    console.error('Error en login:', error)
    return Response.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}
