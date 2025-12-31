# -*- coding: utf-8 -*-
import json
import os

# Mapeo manual de productos a sus imágenes reales
mapeo_imagenes = {
    "Suhr Mateus Asato": ["Mateus Asato - Agotada.png"],
    "Suhr Classic T Aged": ["Classic T Aged -  Agotada.png"],
    "Suhr Classic S": ["Classic S -  Agotada.png"],
    "Suhr Pete Thorne": ["Suhr Pete Thorne.png"],
    
    "Rivolta Combinata XVII": ["Rivolta Combinata XVII.png"],
    "Rivolta Combinata VII": ["Rivolta Combinata VII.png", "Rivolta Combinata VII - Agotada.png"],
    
    "G&L S-500 Fullerton": ["S-500 Fullerton - Agotada.png"],
    "G&L Asat Classic Thinline": [
        "Asat Classic Thinline - Agotada.png",
        "Asat Classic Thinline - Agotada (2).png",
        "Asat Classic Thinline - Agotada (3).png"
    ],
    "G&L Asat Classic Fullerton": ["Asat Classic Fullerton, - Agotada.png"],
    "G&L ASAT Z-3": ["G&L ASAT Z-3.png"],
    "G&L Asat Classic": ["G&L Asat Classic.png", "Asat Classic.png", "G&L Asat classic (2).png"],
    "G&L Asat Bluesboy": ["Asat Bluesboy.png"],
    "G&L Asat Bluesboy Semi Hollow": ["G&L Asat Bluesboy Semi Hollow.png", "G&L Asat Bluesboy Semi Hollow (2).png"],
    "G&L Asat Zurda Classic Bluesboy Semi Hollow": ["G&L Asat Zurda Classic Bluesboy Semi Hollow.png"],
    "G&L Asat Special": ["G&L Asat Special.png"],
    "G&L Asat Classic Bluesboy": ["G&L Asat Classic Bluesboy.png"],
    "G&L Asat Legacy": ["G&L Asat Legacy  - Agotado.png"],
    "G&L Fallout": ["G&L Fallout - Agotada.png"],
    "G&L Asat Especial": ["G&L Asat Especial.png"],
    "G&L Asat Delux": ["G&L Asat Delux.png"],
    "G&L Asat Deluxe": ["G&L Asat Delux.png"],
    
    "D'Angelico SS": ["D´Angelico SS.png"],
    "D'Angelico DC": ["D´Angelico DC.png"],
    "D'Angelico GT": ["D´Angelico GT.png"],
    "D'Angelico Deluxe SS": ["D´Angelico Deluxe SS.png"],
}

# Imagen placeholder para productos sin foto
placeholder = "/img/placeholder-guitar.jpg"

# Leer JSON
with open('data/amplificadores.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Actualizar imágenes de guitarras
contador_actualizados = 0
contador_sin_imagen = 0

for producto in data['amplificadores']:
    if producto.get('categoria') == 'guitarras':
        nombre = producto['nombre']
        
        if nombre in mapeo_imagenes:
            imagenes_reales = [f"/img/guitarras/{img}" for img in mapeo_imagenes[nombre]]
            producto['imagenes'] = imagenes_reales
            contador_actualizados += 1
            print(f"✅ {nombre}: {len(imagenes_reales)} imagen(es)")
        else:
            producto['imagenes'] = [placeholder]
            contador_sin_imagen += 1
            print(f"⚠️ {nombre}: Sin imagen (usando placeholder)")

# Guardar
with open('data/amplificadores.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('public/data/amplificadores.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✅ JSON actualizado")
print(f"📸 Productos con imágenes: {contador_actualizados}")
print(f"⚠️ Productos sin imagen: {contador_sin_imagen}")
