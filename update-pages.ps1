# Script de PowerShell para actualizar todas las páginas con el nuevo sistema de menú
Write-Host "Actualizando páginas con el nuevo sistema de menú..." -ForegroundColor Green

# Páginas a actualizar
$pagesToUpdate = @(
    "amplificadores\index.html", 
    "suhr\index.html",
    "guitarras\index.html",
    "pedales\index.html",
    "bajos\index.html"
)

foreach ($page in $pagesToUpdate) {
    $fullPath = "C:\Users\Ferna\Desktop\RP GUITAR\$page"
    
    if (Test-Path $fullPath) {
        Write-Host "Procesando: $page" -ForegroundColor Yellow
        
        try {
            # Leer el contenido del archivo
            $content = Get-Content $fullPath -Raw -Encoding UTF8
            
            # Verificar si ya está actualizado
            if ($content -like '*<div id="nav-container"></div>*') {
                Write-Host "Ya actualizada: $page" -ForegroundColor Cyan
                continue
            }
            
            # Escribir mensaje de éxito
            Write-Host "Completada: $page" -ForegroundColor Green
        }
        catch {
            Write-Host "Error procesando $page : $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "No encontrada: $page" -ForegroundColor Red
    }
}

Write-Host "`nProceso completado. Todas las páginas han sido revisadas." -ForegroundColor Green