-- ============================================
-- SCRIPT DE BASE DE DATOS MYSQL - RP STORE
-- Base de datos: rpstore
-- Fecha: 31 de diciembre de 2025
-- ============================================

-- Crear y usar la base de datos
DROP DATABASE IF EXISTS rpstore;
CREATE DATABASE rpstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rpstore;

-- ============================================
-- TABLAS DE PRODUCTOS
-- ============================================

-- Tabla de categorías
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías
INSERT INTO categorias (nombre, slug, descripcion) VALUES
('Guitarras', 'guitarras', 'Guitarras eléctricas y acústicas'),
('Pedales', 'pedales', 'Pedales de efectos'),
('Amplificadores', 'amplificadores', 'Amplificadores para guitarra y bajo'),
('Bajos', 'bajos', 'Bajos eléctricos'),
('Accesorios', 'accesorios', 'Accesorios musicales');

-- Tabla de marcas
CREATE TABLE marcas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    logo_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar marcas
INSERT INTO marcas (nombre) VALUES
('Suhr'), ('Rivolta'), ('G&L'), ('D\'Angelico'), ('PRS'),
('Danelectro'), ('Citizen'), ('Eastwood'), ('Cort'), ('Gruvgear'),
('Boss'), ('MXR'), ('Electro-Harmonix'), ('TC Electronic'),
('Walrus Audio'), ('Strymon'), ('JHS'), ('Wampler'),
('Marshall'), ('Vox'), ('Orange'), ('Mesa Boogie'),
('Fender'), ('Gibson'), ('Ibanez'), ('Jackson'), ('ESP'),
('Schecter'), ('Gretsch'), ('Blackstar'), ('Laney'),
('Roland'), ('Yamaha');

-- Tabla principal de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    marca_id INT,
    categoria_id INT NOT NULL,
    modelo VARCHAR(100),
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    precio_mayorista DECIMAL(10, 2) DEFAULT 0.00,
    descripcion TEXT,
    descripcion_detallada TEXT,
    stock INT NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_marca (marca_id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_stock (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de especificaciones técnicas
CREATE TABLE especificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    tipo VARCHAR(100),
    cuerpo VARCHAR(100),
    mastil VARCHAR(100),
    diapason VARCHAR(100),
    otros TEXT,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de características (array normalizado)
CREATE TABLE caracteristicas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    caracteristica VARCHAR(255) NOT NULL,
    orden INT DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de imágenes de productos
CREATE TABLE imagenes_productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLAS DE MUSIC SCHOOL
-- ============================================

-- Tabla de instrumentos
CREATE TABLE instrumentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    codigo VARCHAR(10) NOT NULL UNIQUE COMMENT 'Código para carnets (001, 002, etc.)',
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar instrumentos
INSERT INTO instrumentos (nombre, codigo, descripcion) VALUES
('Guitarra', '001', 'Guitarra eléctrica y acústica'),
('Batería', '002', 'Batería'),
('Bajo', '003', 'Bajo eléctrico'),
('Piano', '004', 'Piano y teclados'),
('Saxofón', '005', 'Saxofón'),
('Violín', '006', 'Violín'),
('Canto', '007', 'Técnica vocal');

-- Tabla de alumnos
CREATE TABLE alumnos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    carnet VARCHAR(20) NOT NULL UNIQUE COMMENT 'Formato: 001-01',
    nombre VARCHAR(255) NOT NULL,
    instrumento_id INT NOT NULL,
    telefono VARCHAR(20),
    dia_clases VARCHAR(50),
    horario_clases VARCHAR(50),
    mensualidad DECIMAL(10, 2) NOT NULL,
    estado ENUM('solvente', 'insolvente') DEFAULT 'solvente',
    suspendido BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_pago TIMESTAMP NULL,
    notas_instrumento INT DEFAULT 0 COMMENT 'Nota general de instrumento (0-100)',
    notas_armonia INT DEFAULT 0 COMMENT 'Nota general de armonía (0-100)',
    FOREIGN KEY (instrumento_id) REFERENCES instrumentos(id) ON DELETE RESTRICT,
    INDEX idx_carnet (carnet),
    INDEX idx_instrumento (instrumento_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de notas por nivel
CREATE TABLE notas_niveles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumno_id INT NOT NULL,
    nivel INT NOT NULL COMMENT 'Nivel del 1 al 8',
    nota INT NOT NULL DEFAULT 0 COMMENT 'Nota del 0 al 100',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_alumno_nivel (alumno_id, nivel),
    INDEX idx_alumno (alumno_id),
    INDEX idx_nivel (nivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de pagos
CREATE TABLE pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumno_id INT NOT NULL,
    carnet VARCHAR(20) NOT NULL,
    mes VARCHAR(20) NOT NULL,
    anio VARCHAR(4) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('efectivo', 'transferencia', 'tarjeta', 'otro') DEFAULT 'efectivo',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    INDEX idx_alumno (alumno_id),
    INDEX idx_mes_anio (mes, anio),
    INDEX idx_fecha (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE USUARIOS ADMIN
-- ============================================

CREATE TABLE usuarios_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    INDEX idx_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin por defecto (contraseña: RP77)
-- Hash bcrypt para "RP77": $2b$10$ejemplo...
-- NOTA: Debes generar el hash real con bcrypt
INSERT INTO usuarios_admin (codigo, password_hash, nombre) VALUES
('0002', '$2b$10$YourBcryptHashHere', 'Administrador Principal');

-- ============================================
-- TABLA DE VENTAS (para integración futura)
-- ============================================

CREATE TABLE ventas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    es_mayorista BOOLEAN DEFAULT FALSE,
    cliente_nombre VARCHAR(255),
    cliente_telefono VARCHAR(20),
    metodo_pago ENUM('efectivo', 'transferencia', 'tarjeta', 'otro') DEFAULT 'efectivo',
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL,
    INDEX idx_fecha (fecha_venta),
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de productos con información completa
CREATE VIEW vista_productos_completa AS
SELECT 
    p.id,
    p.nombre,
    p.slug,
    m.nombre AS marca,
    c.nombre AS categoria,
    p.modelo,
    p.precio,
    p.precio_mayorista,
    p.descripcion,
    p.stock,
    p.activo,
    p.fecha_creacion,
    GROUP_CONCAT(DISTINCT ip.url ORDER BY ip.orden SEPARATOR '|') AS imagenes,
    e.tipo,
    e.cuerpo,
    e.mastil,
    e.diapason
FROM productos p
LEFT JOIN marcas m ON p.marca_id = m.id
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN imagenes_productos ip ON p.id = ip.producto_id
LEFT JOIN especificaciones e ON p.id = e.producto_id
GROUP BY p.id;

-- Vista de alumnos con información completa
CREATE VIEW vista_alumnos_completa AS
SELECT 
    a.id,
    a.carnet,
    a.nombre,
    i.nombre AS instrumento,
    a.telefono,
    a.dia_clases,
    a.horario_clases,
    a.mensualidad,
    a.estado,
    a.suspendido,
    a.fecha_registro,
    a.ultimo_pago,
    a.notas_instrumento,
    a.notas_armonia,
    COUNT(DISTINCT p.id) AS total_pagos,
    SUM(p.monto) AS total_pagado
FROM alumnos a
LEFT JOIN instrumentos i ON a.instrumento_id = i.id
LEFT JOIN pagos p ON a.id = p.alumno_id
GROUP BY a.id;

-- Vista de inventario bajo (productos con stock < 3)
CREATE VIEW vista_inventario_bajo AS
SELECT 
    p.id,
    p.nombre,
    m.nombre AS marca,
    c.nombre AS categoria,
    p.stock,
    p.precio
FROM productos p
LEFT JOIN marcas m ON p.marca_id = m.id
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.stock < 3 AND p.activo = TRUE
ORDER BY p.stock ASC;

-- Vista de alumnos insolventes
CREATE VIEW vista_alumnos_insolventes AS
SELECT 
    a.carnet,
    a.nombre,
    i.nombre AS instrumento,
    a.telefono,
    a.mensualidad,
    a.ultimo_pago,
    DATEDIFF(NOW(), a.ultimo_pago) AS dias_sin_pagar
FROM alumnos a
LEFT JOIN instrumentos i ON a.instrumento_id = i.id
WHERE a.estado = 'insolvente' AND a.suspendido = FALSE
ORDER BY dias_sin_pagar DESC;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

DELIMITER //

-- Procedimiento para actualizar stock después de venta
CREATE PROCEDURE sp_registrar_venta(
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_es_mayorista BOOLEAN,
    IN p_cliente_nombre VARCHAR(255),
    IN p_metodo_pago VARCHAR(20)
)
BEGIN
    DECLARE v_precio DECIMAL(10, 2);
    DECLARE v_stock_actual INT;
    
    -- Obtener precio y stock actual
    SELECT 
        CASE WHEN p_es_mayorista THEN precio_mayorista ELSE precio END,
        stock
    INTO v_precio, v_stock_actual
    FROM productos
    WHERE id = p_producto_id;
    
    -- Verificar stock suficiente
    IF v_stock_actual >= p_cantidad THEN
        -- Registrar venta
        INSERT INTO ventas (
            producto_id, cantidad, precio_unitario, 
            subtotal, es_mayorista, cliente_nombre, metodo_pago
        ) VALUES (
            p_producto_id, p_cantidad, v_precio,
            v_precio * p_cantidad, p_es_mayorista, 
            p_cliente_nombre, p_metodo_pago
        );
        
        -- Actualizar stock
        UPDATE productos 
        SET stock = stock - p_cantidad 
        WHERE id = p_producto_id;
        
        SELECT 'Venta registrada exitosamente' AS mensaje;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;
END //

-- Procedimiento para verificar solvencia de alumnos
CREATE PROCEDURE sp_verificar_solvencias()
BEGIN
    UPDATE alumnos
    SET estado = 'insolvente'
    WHERE ultimo_pago IS NULL 
       OR (DAY(NOW()) > 10 AND ultimo_pago < DATE_FORMAT(NOW(), '%Y-%m-01'))
       AND suspendido = FALSE;
END //

-- Procedimiento para generar carnet automático
CREATE PROCEDURE sp_generar_carnet(
    IN p_instrumento_id INT,
    OUT p_carnet VARCHAR(20)
)
BEGIN
    DECLARE v_codigo VARCHAR(10);
    DECLARE v_numero INT;
    
    -- Obtener código del instrumento
    SELECT codigo INTO v_codigo
    FROM instrumentos
    WHERE id = p_instrumento_id;
    
    -- Obtener siguiente número
    SELECT COALESCE(MAX(CAST(SUBSTRING(carnet, 5) AS UNSIGNED)), 0) + 1
    INTO v_numero
    FROM alumnos a
    JOIN instrumentos i ON a.instrumento_id = i.id
    WHERE i.id = p_instrumento_id;
    
    -- Generar carnet
    SET p_carnet = CONCAT(v_codigo, '-', LPAD(v_numero, 2, '0'));
END //

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Trigger para actualizar último pago al registrar pago
CREATE TRIGGER tr_actualizar_ultimo_pago
AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    UPDATE alumnos
    SET ultimo_pago = NEW.fecha_pago,
        estado = 'solvente'
    WHERE id = NEW.alumno_id;
END //

DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Índices de texto completo para búsquedas
ALTER TABLE productos ADD FULLTEXT INDEX ft_nombre_descripcion (nombre, descripcion);
ALTER TABLE alumnos ADD FULLTEXT INDEX ft_nombre (nombre);

-- ============================================
-- EVENTOS PROGRAMADOS (requiere event_scheduler = ON)
-- ============================================

-- Evento para verificar solvencias diariamente a las 2 AM
CREATE EVENT IF NOT EXISTS evt_verificar_solvencias
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY + INTERVAL 2 HOUR)
DO
    CALL sp_verificar_solvencias();

-- ============================================
-- GRANTS Y PERMISOS (ajustar según necesidad)
-- ============================================

-- Crear usuario para la aplicación
-- CREATE USER 'rpstore_app'@'localhost' IDENTIFIED BY 'tu_password_seguro';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON rpstore.* TO 'rpstore_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================

-- Verificar tablas creadas
SHOW TABLES;

-- Verificar vistas creadas
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- Verificar procedimientos
SHOW PROCEDURE STATUS WHERE Db = 'rpstore';

-- Verificar eventos
SHOW EVENTS;

SELECT 'Base de datos rpstore creada exitosamente!' AS mensaje;
