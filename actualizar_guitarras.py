# -*- coding: utf-8 -*-
import json
import re

# Leer JSON actual
with open('data/amplificadores.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Obtener solo amplificadores y accesorios (mantenemos estos)
productos_mantener = [p for p in data['amplificadores'] if p.get('categoria') in ['amplificadores', 'accesorios']]

# Nueva lista de guitarras en el orden exacto proporcionado
nuevas_guitarras = [
    # SUHR
    {"id": 1000, "nombre": "Suhr Mateus Asato", "marca": "Suhr", "modelo": "Mateus Asato", "precio": 35090, "stock": False},
    {"id": 1001, "nombre": "Suhr Classic T Aged", "marca": "Suhr", "modelo": "Classic T Aged", "precio": 31300, "stock": False},
    {"id": 1002, "nombre": "Suhr Classic S", "marca": "Suhr", "modelo": "Classic S", "precio": 29300, "stock": False},
    {"id": 1003, "nombre": "Suhr Pete Thorne", "marca": "Suhr", "modelo": "Pete Thorne", "precio": 35090, "stock": True},
    
    # RIVOLTA
    {"id": 1004, "nombre": "Rivolta Combinata XVII", "marca": "Rivolta", "modelo": "Combinata XVII", "precio": 12080, "stock": True},
    {"id": 1005, "nombre": "Rivolta Combinata VII", "marca": "Rivolta", "modelo": "Combinata VII", "precio": 11640, "stock": True},
    {"id": 1006, "nombre": "Rivolta Combinata XVII", "marca": "Rivolta", "modelo": "Combinata XVII", "precio": 12080, "stock": False},
    
    # G&L - Fullerton Series
    {"id": 1007, "nombre": "G&L S-500 Fullerton", "marca": "G&L", "modelo": "S-500 Fullerton", "precio": 15800, "stock": False},
    {"id": 1008, "nombre": "G&L Asat Classic Thinline", "marca": "G&L", "modelo": "Asat Classic Thinline", "precio": 14800, "stock": False},
    {"id": 1009, "nombre": "G&L Asat Classic Thinline", "marca": "G&L", "modelo": "Asat Classic Thinline", "precio": 14800, "stock": False},
    {"id": 1010, "nombre": "G&L Asat Classic Thinline", "marca": "G&L", "modelo": "Asat Classic Thinline", "precio": 14800, "stock": False},
    {"id": 1011, "nombre": "G&L Asat Classic Fullerton", "marca": "G&L", "modelo": "Asat Classic Fullerton", "precio": 15400, "stock": False},
    {"id": 1012, "nombre": "G&L ASAT Z-3", "marca": "G&L", "modelo": "ASAT Z-3", "precio": 15800, "stock": True},
    
    # G&L - Tribute Series
    {"id": 1013, "nombre": "G&L Asat Classic", "marca": "G&L", "modelo": "Asat Classic", "precio": 4900, "stock": True},
    {"id": 1014, "nombre": "G&L Asat Bluesboy", "marca": "G&L", "modelo": "Asat Bluesboy", "precio": 4900, "stock": True},
    {"id": 1015, "nombre": "G&L Asat Bluesboy Semi Hollow", "marca": "G&L", "modelo": "Asat Bluesboy Semi Hollow", "precio": 5200, "stock": True},
    {"id": 1016, "nombre": "G&L Asat Bluesboy Semi Hollow", "marca": "G&L", "modelo": "Asat Bluesboy Semi Hollow", "precio": 5200, "stock": True},
    {"id": 1017, "nombre": "G&L Asat Classic", "marca": "G&L", "modelo": "Asat Classic", "precio": 4990, "stock": True},
    {"id": 1018, "nombre": "G&L Asat Zurda Classic Bluesboy Semi Hollow", "marca": "G&L", "modelo": "Asat Zurda Classic Bluesboy Semi Hollow", "precio": 5000, "stock": True},
    {"id": 1019, "nombre": "G&L Asat Special", "marca": "G&L", "modelo": "Asat Special", "precio": 5200, "stock": True},
    {"id": 1020, "nombre": "G&L Asat Classic Bluesboy", "marca": "G&L", "modelo": "Asat Classic Bluesboy", "precio": 4900, "stock": True},
    {"id": 1021, "nombre": "G&L Asat Legacy", "marca": "G&L", "modelo": "Asat Legacy", "precio": 4990, "stock": True},
    {"id": 1022, "nombre": "G&L Fallout", "marca": "G&L", "modelo": "Fallout", "precio": 4700, "stock": True},
    {"id": 1023, "nombre": "G&L Asat Classic", "marca": "G&L", "modelo": "Asat Classic", "precio": 4980, "stock": True},
    {"id": 1024, "nombre": "G&L Asat Especial", "marca": "G&L", "modelo": "Asat Especial", "precio": 5200, "stock": True},
    {"id": 1025, "nombre": "G&L Asat Delux", "marca": "G&L", "modelo": "Asat Delux", "precio": 5100, "stock": True},
    {"id": 1026, "nombre": "G&L Asat Special", "marca": "G&L", "modelo": "Asat Special", "precio": 5000, "stock": True},
    {"id": 1027, "nombre": "G&L S-500", "marca": "G&L", "modelo": "S-500", "precio": 5400, "stock": True},
    {"id": 1028, "nombre": "G&L Comanche", "marca": "G&L", "modelo": "Comanche", "precio": 5700, "stock": True},
    {"id": 1029, "nombre": "G&L S-500 Tribute", "marca": "G&L", "modelo": "S-500 Tribute", "precio": 5400, "stock": True},
    {"id": 1030, "nombre": "G&L Doheny Sunburst", "marca": "G&L", "modelo": "Doheny Sunburst", "precio": 5400, "stock": True},
    {"id": 1031, "nombre": "G&L Legacy HSS", "marca": "G&L", "modelo": "Legacy HSS", "precio": 5400, "stock": True},
    {"id": 1032, "nombre": "G&L Asat Deluxe", "marca": "G&L", "modelo": "Asat Deluxe", "precio": 5100, "stock": True},
    
    # D'ANGELICO
    {"id": 1033, "nombre": "D'Angelico SS", "marca": "D'Angelico", "modelo": "SS", "precio": 7560, "stock": True},
    {"id": 1034, "nombre": "D'Angelico DC", "marca": "D'Angelico", "modelo": "DC", "precio": 7470, "stock": False},
    {"id": 1035, "nombre": "D'Angelico GT", "marca": "D'Angelico", "modelo": "GT", "precio": 10080, "stock": True},
    {"id": 1036, "nombre": "D'Angelico Deluxe SS", "marca": "D'Angelico", "modelo": "Deluxe SS", "precio": 18800, "stock": False},
    
    # PRS
    {"id": 1037, "nombre": "PRS Silver Sky SE", "marca": "PRS", "modelo": "Silver Sky SE", "precio": 8300, "stock": True},
    {"id": 1038, "nombre": "PRS Silver Sky SE John Mayer", "marca": "PRS", "modelo": "Silver Sky SE John Mayer", "precio": 8300, "stock": True},
    {"id": 1039, "nombre": "PRS Silver Sky SE", "marca": "PRS", "modelo": "Silver Sky SE", "precio": 8300, "stock": True},
    {"id": 1040, "nombre": "PRS SE Custom 24 Charcoal", "marca": "PRS", "modelo": "SE Custom 24 Charcoal", "precio": 8095, "stock": True},
    
    # DANELECTRO
    {"id": 1041, "nombre": "Danelectro 56", "marca": "Danelectro", "modelo": "56", "precio": 4660, "stock": True},
    {"id": 1042, "nombre": "Danelectro Blackout 59", "marca": "Danelectro", "modelo": "Blackout 59", "precio": 4550, "stock": True},
    {"id": 1043, "nombre": "Danelectro Blackout 59", "marca": "Danelectro", "modelo": "Blackout 59", "precio": 4550, "stock": True},
    {"id": 1044, "nombre": "Danelectro 59 MJ", "marca": "Danelectro", "modelo": "59 MJ", "precio": 4340, "stock": True},
    {"id": 1045, "nombre": "Danelectro 56 U2", "marca": "Danelectro", "modelo": "56 U2", "precio": 4660, "stock": False},
    {"id": 1046, "nombre": "Danelectro 59 Divine", "marca": "Danelectro", "modelo": "59 Divine", "precio": 5600, "stock": True},
    
    # CITIZEN
    {"id": 1047, "nombre": "Citizen C2", "marca": "Citizen", "modelo": "C2", "precio": 11620, "stock": False},
    {"id": 1048, "nombre": "Citizen CT", "marca": "Citizen", "modelo": "CT", "precio": 12090, "stock": False},
    {"id": 1049, "nombre": "Citizen CS", "marca": "Citizen", "modelo": "CS", "precio": 10940, "stock": True},
    
    # EASTWOOD
    {"id": 1050, "nombre": "Eastwood Classic 6", "marca": "Eastwood", "modelo": "Classic 6", "precio": 5940, "stock": True},
    {"id": 1051, "nombre": "Eastwood Classic 6", "marca": "Eastwood", "modelo": "Classic 6", "precio": 5940, "stock": False},
    {"id": 1052, "nombre": "Eastwood Classic 6", "marca": "Eastwood", "modelo": "Classic 6", "precio": 5940, "stock": True},
]

# Agregar campos completos a cada guitarra
for i, guitarra in enumerate(nuevas_guitarras):
    slug = guitarra['nombre'].lower().replace(' ', '-').replace("'", '')
    guitarra.update({
        "slug": slug,
        "descripcion": f"Guitarra eléctrica {guitarra['marca']} {guitarra['modelo']}. Excelente calidad y sonido profesional.",
        "caracteristicas": [
            f"Marca: {guitarra['marca']}",
            f"Modelo: {guitarra['modelo']}",
            "Guitarra eléctrica profesional",
            "Construcción de alta calidad",
            "Hardware premium"
        ],
        "imagenes": [
            f"/img/guitarras/{slug}.jpg",
            f"/img/guitarras/{slug}-2.jpg"
        ],
        "categoria": "guitarras"
    })

# Combinar: amplificadores + accesorios + nuevas guitarras
data['amplificadores'] = productos_mantener + nuevas_guitarras

# Guardar en data/
with open('data/amplificadores.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Copiar a public/data/
with open('public/data/amplificadores.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ JSON actualizado correctamente")
print(f"📦 Total productos: {len(data['amplificadores'])}")
print(f"🎸 Guitarras: {len(nuevas_guitarras)}")
print(f"🔊 Amplificadores: {len([p for p in productos_mantener if p['categoria'] == 'amplificadores'])}")
print(f"🎵 Accesorios: {len([p for p in productos_mantener if p['categoria'] == 'accesorios'])}")
