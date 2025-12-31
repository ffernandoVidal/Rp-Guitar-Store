import { verifyAdminCredentials, generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { codigo, password } = await request.json()
    
    // Verificar credenciales
    const isValid = verifyAdminCredentials(codigo, password)
    
    if (!isValid) {
      return Response.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
    
    // Generar token
    const token = generateToken(codigo)
    
    return Response.json({
      success: true,
      token,
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
