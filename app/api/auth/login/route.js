// app/api/auth/login/route.js
// POST /api/auth/login - Autenticación de usuarios
import { login } from '@/lib/auth-complete'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, codigo } = body
    
    // Soportar tanto email como codigo para retrocompatibilidad
    const identifier = email || codigo
    
    // Validación básica
    if (!identifier || !password) {
      return Response.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Email/código y contraseña son requeridos'
        },
        { status: 400 }
      )
    }
    
    // Obtener información de la petición para auditoría
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Intentar login
    const result = await login(identifier, password, ip, userAgent, {
      timestamp: new Date().toISOString()
    })
    
    if (!result.success) {
      // Manejo de errores específicos
      if (result.error === 'ACCOUNT_LOCKED') {
        return Response.json(
          {
            error: 'ACCOUNT_LOCKED',
            message: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos',
            lockedUntil: result.lockedUntil
          },
          { status: 429 }
        )
      }

      if (result.error === 'TOO_MANY_ATTEMPTS') {
        return Response.json(
          {
            error: 'TOO_MANY_ATTEMPTS',
            message: 'Demasiados intentos fallidos. Intente más tarde.'
          },
          { status: 429 }
        )
      }
      
      if (result.error === 'USER_INACTIVE') {
        return Response.json(
          {
            error: 'UNAUTHORIZED',
            message: 'Credenciales inválidas'
          },
          { status: 401 }
        )
      }
      
      // Error genérico de autenticación (no revelar si usuario existe)
      return Response.json(
        {
          error: 'UNAUTHORIZED',
          message: 'Credenciales inválidas'
        },
        { status: 401 }
      )
    }
    
    // Login exitoso
    const res = NextResponse.json(
      {
        success: true,
        accessToken: result.accessToken,
        user: {
          userId: result.user.userId,
          email: result.user.email,
          fullName: result.user.fullName
        },
        expiresIn: 900 // 15 minutos en segundos
      },
      { status: 200 }
    )

    // Guardar refresh token en cookie HttpOnly (preferible a exponerlo en JS)
    res.cookies.set('rp_refresh', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return res
  } catch (error) {
    console.error('Error en login:', error)
    return Response.json(
      {
        error: 'SERVER_ERROR',
        message: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}

// GET /api/auth/login - No permitido
export async function GET() {
  return Response.json(
    {
      error: 'METHOD_NOT_ALLOWED',
      message: 'Use POST para iniciar sesión'
    },
    { status: 405 }
  )
}
