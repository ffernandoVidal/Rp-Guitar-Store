import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Middleware de autenticación
function requireAuth(handler) {
  return async (request) => {
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
    
    return handler(request, decoded)
  }
}

// POST - Subir imagen (requiere autenticación)
export const POST = requireAuth(async (request, user) => {
  try {
    const formData = await request.formData()
    const file = formData.get('imagen')
    const categoria = formData.get('categoria') || 'productos'
    
    if (!file) {
      return Response.json(
        { error: 'No se proporcionó ninguna imagen' },
        { status: 400 }
      )
    }
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return Response.json(
        { error: 'Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, WEBP, GIF)' },
        { status: 400 }
      )
    }
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return Response.json(
        { error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      )
    }
    
    // Generar nombre único para el archivo
    const extension = file.name.split('.').pop()
    const uniqueName = `${uuidv4()}.${extension}`
    
    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'img', categoria)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, uniqueName)
    
    await writeFile(filePath, buffer)
    
    // Retornar URL pública
    const publicUrl = `/img/${categoria}/${uniqueName}`
    
    return Response.json({
      success: true,
      url: publicUrl,
      nombre: uniqueName,
      message: 'Imagen subida exitosamente'
    })
    
  } catch (error) {
    console.error('Error al subir imagen:', error)
    return Response.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    )
  }
})
