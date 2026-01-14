-- ============================================
-- SCRIPT DE BASE DE DATOS MYSQL - RP STORE
-- Base de datos: rpstore
-- Fecha: 13 de enero de 2026
-- Estructura completa: TIENDA + ESCUELA
-- ============================================

-- Crear y usar la base de datos
DROP DATABASE IF EXISTS rpstore;
CREATE DATABASE rpstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rpstore;

-- =========================================================
--  BD: TIENDA + ESCUELA 
-- =========================================================

-- ---------------------------
-- 1) SEGURIDAD / USUARIOS
-- ---------------------------
CREATE TABLE roles (
  role_id   INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  user_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  role_id       INT NOT NULL,
  username      VARCHAR(50) NOT NULL UNIQUE,
  email         VARCHAR(120) UNIQUE,
  pass_hash     VARCHAR(255) NOT NULL,
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  creado_en     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_roles
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

INSERT INTO roles(nombre) VALUES ('admin'), ('empleado'), ('maestro');

-- ---------------------------
-- 2) TIENDA: CATÁLOGO
-- ---------------------------
CREATE TABLE categorias (
  categoria_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Insertar categorías
INSERT INTO categorias (nombre) VALUES
('Guitarras'), ('Pedales'), ('Amplificadores'), ('Bajos'), ('Accesorios');

CREATE TABLE marcas (
  marca_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

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

CREATE TABLE productos (
  producto_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
  categoria_id     INT NOT NULL,
  marca_id         INT NOT NULL,
  nombre           VARCHAR(120) NOT NULL,
  modelo           VARCHAR(80) NULL,
  descripcion      TEXT NULL,
  detalle          TEXT NULL,
  precio_mayorista DECIMAL(10,2) NOT NULL,
  precio_venta     DECIMAL(10,2) NOT NULL,
  stock            INT NOT NULL DEFAULT 0,
  activo           TINYINT(1) NOT NULL DEFAULT 1,
  creado_en        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id),
  CONSTRAINT fk_productos_marca     FOREIGN KEY (marca_id) REFERENCES marcas(marca_id),
  CONSTRAINT ck_precios CHECK (precio_mayorista >= 0 AND precio_venta >= 0),
  INDEX idx_prod_nombre (nombre),
  INDEX idx_prod_modelo (modelo)
) ENGINE=InnoDB;

CREATE TABLE producto_imagenes (
  imagen_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
  producto_id  BIGINT NOT NULL,
  url          VARCHAR(400) NOT NULL,
  es_principal TINYINT(1) NOT NULL DEFAULT 0,
  creado_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_img_producto FOREIGN KEY (producto_id) REFERENCES productos(producto_id)
    ON DELETE CASCADE,
  INDEX idx_img_producto (producto_id)
) ENGINE=InnoDB;

-- Vista para ocultar precio_mayorista (útil para panel empleado)
CREATE OR REPLACE VIEW vw_productos_publico AS
SELECT
  p.producto_id, p.categoria_id, p.marca_id, p.nombre, p.modelo,
  p.descripcion, p.detalle, p.precio_venta, p.stock, p.activo,
  p.creado_en, p.actualizado_en
FROM productos p;

-- ---------------------------
-- 3) TIENDA: CLIENTES / VENTAS
-- ---------------------------
CREATE TABLE clientes (
  cliente_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombres    VARCHAR(120) NOT NULL,
  nit        VARCHAR(25) NULL,
  telefono   VARCHAR(30) NULL,
  email      VARCHAR(120) NULL,
  direccion  VARCHAR(200) NULL,
  creado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE ventas (
  venta_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT NOT NULL,       -- quien registró (empleado/admin)
  cliente_id     BIGINT NULL,
  fecha_venta    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo_pago      ENUM('EFECTIVO','TARJETA') NOT NULL,
  tipo_entrega   ENUM('DIRECTA','RECOGER_EN_TIENDA') NOT NULL,
  subtotal       DECIMAL(12,2) NOT NULL DEFAULT 0,
  descuento      DECIMAL(12,2) NOT NULL DEFAULT 0,
  total          DECIMAL(12,2) NOT NULL DEFAULT 0,
  observaciones  VARCHAR(250) NULL,
  CONSTRAINT fk_ventas_usuario FOREIGN KEY (user_id) REFERENCES usuarios(user_id),
  CONSTRAINT fk_ventas_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id),
  CONSTRAINT ck_totales CHECK (subtotal >= 0 AND descuento >= 0 AND total >= 0),
  INDEX idx_ventas_fecha (fecha_venta)
) ENGINE=InnoDB;

CREATE TABLE venta_detalle (
  venta_detalle_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  venta_id         BIGINT NOT NULL,
  producto_id      BIGINT NOT NULL,
  cantidad         INT NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL,
  total_linea      DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_vd_venta    FOREIGN KEY (venta_id)    REFERENCES ventas(venta_id) ON DELETE CASCADE,
  CONSTRAINT fk_vd_producto FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
  CONSTRAINT ck_vd_cantidad CHECK (cantidad > 0),
  INDEX idx_vd_venta (venta_id),
  INDEX idx_vd_producto (producto_id)
) ENGINE=InnoDB;

-- ---------------------------
-- 4) TIENDA: FACTURACIÓN
-- ---------------------------
CREATE TABLE facturas (
  factura_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
  venta_id       BIGINT NOT NULL UNIQUE,
  numero_factura VARCHAR(40) NOT NULL UNIQUE,
  fecha_emision  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  nombre_fiscal  VARCHAR(150) NOT NULL,
  nit_fiscal     VARCHAR(25) NULL,
  direccion_fiscal VARCHAR(200) NULL,
  subtotal       DECIMAL(12,2) NOT NULL,
  impuesto       DECIMAL(12,2) NOT NULL DEFAULT 0,
  total          DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_fact_venta FOREIGN KEY (venta_id) REFERENCES ventas(venta_id),
  CONSTRAINT ck_fact_totales CHECK (subtotal >= 0 AND impuesto >= 0 AND total >= 0),
  INDEX idx_fact_fecha (fecha_emision)
) ENGINE=InnoDB;

-- ---------------------------
-- 5) TIENDA: COMPRAS (para reportes)
-- ---------------------------
CREATE TABLE proveedores (
  proveedor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  nit          VARCHAR(25) NULL,
  telefono     VARCHAR(30) NULL,
  email        VARCHAR(120) NULL,
  direccion    VARCHAR(200) NULL,
  activo       TINYINT(1) NOT NULL DEFAULT 1,
  creado_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE compras (
  compra_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
  proveedor_id  BIGINT NOT NULL,
  user_id       BIGINT NOT NULL,
  fecha_compra  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  numero_doc    VARCHAR(60) NULL, -- no. factura proveedor / referencia
  subtotal      DECIMAL(12,2) NOT NULL DEFAULT 0,
  impuesto      DECIMAL(12,2) NOT NULL DEFAULT 0,
  total         DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_comp_prov FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id),
  CONSTRAINT fk_comp_user FOREIGN KEY (user_id) REFERENCES usuarios(user_id),
  INDEX idx_comp_fecha (fecha_compra)
) ENGINE=InnoDB;

CREATE TABLE compra_detalle (
  compra_detalle_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  compra_id         BIGINT NOT NULL,
  producto_id       BIGINT NOT NULL,
  cantidad          INT NOT NULL,
  costo_unitario    DECIMAL(10,2) NOT NULL,
  total_linea       DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_cd_compra   FOREIGN KEY (compra_id)   REFERENCES compras(compra_id) ON DELETE CASCADE,
  CONSTRAINT fk_cd_producto FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
  CONSTRAINT ck_cd_cantidad CHECK (cantidad > 0),
  INDEX idx_cd_compra (compra_id)
) ENGINE=InnoDB;

-- =========================================================
-- 6) ESCUELA
-- =========================================================

CREATE TABLE niveles (
  nivel_id INT PRIMARY KEY,
  nombre   VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 8 niveles
INSERT INTO niveles(nivel_id, nombre) VALUES
(1,'Nivel 1'), (2,'Nivel 2'), (3,'Nivel 3'), (4,'Nivel 4'),
(5,'Nivel 5'), (6,'Nivel 6'), (7,'Nivel 7'), (8,'Nivel 8');

CREATE TABLE cursos (
  curso_id  INT AUTO_INCREMENT PRIMARY KEY,
  nivel_id  INT NOT NULL,
  nombre    VARCHAR(120) NOT NULL,
  activo    TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_curso_nivel FOREIGN KEY (nivel_id) REFERENCES niveles(nivel_id),
  UNIQUE KEY uq_curso_nivel_nombre (nivel_id, nombre)
) ENGINE=InnoDB;

-- Tabla de alumnos (perfil alumno)
CREATE TABLE alumnos (
  alumno_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  carnet      VARCHAR(30) NOT NULL UNIQUE,
  nombres     VARCHAR(120) NOT NULL,
  apellidos   VARCHAR(120) NOT NULL,
  fecha_nac   DATE NULL,
  telefono    VARCHAR(30) NULL,
  email       VARCHAR(120) NULL,
  direccion   VARCHAR(200) NULL,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  creado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Horarios (estructura simple, puedes crecerla después)
CREATE TABLE horarios (
  horario_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(80) NOT NULL,     -- Ej: "Lun-Mie-Vie 3pm"
  descripcion VARCHAR(200) NULL
) ENGINE=InnoDB;

-- Periodos/ciclos (ej: 2026-01, 2026)
CREATE TABLE periodos (
  periodo_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(40) NOT NULL UNIQUE,  -- "2026", "2026-1", etc.
  fecha_inicio DATE NOT NULL,
  fecha_fin    DATE NOT NULL,
  CONSTRAINT ck_periodo CHECK (fecha_fin >= fecha_inicio)
) ENGINE=InnoDB;

-- Relación maestro (usuario) asignado a un curso en un periodo + horario
CREATE TABLE asignaciones_maestro (
  asignacion_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  periodo_id    INT NOT NULL,
  curso_id      INT NOT NULL,
  maestro_user_id BIGINT NOT NULL, -- debe ser usuario con rol maestro (se valida en app)
  horario_id    INT NOT NULL,
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_asig_periodo FOREIGN KEY (periodo_id) REFERENCES periodos(periodo_id),
  CONSTRAINT fk_asig_curso   FOREIGN KEY (curso_id)   REFERENCES cursos(curso_id),
  CONSTRAINT fk_asig_maestro FOREIGN KEY (maestro_user_id) REFERENCES usuarios(user_id),
  CONSTRAINT fk_asig_horario FOREIGN KEY (horario_id) REFERENCES horarios(horario_id),
  UNIQUE KEY uq_asig (periodo_id, curso_id, maestro_user_id, horario_id)
) ENGINE=InnoDB;

-- Inscripción del alumno a una asignación (curso+maestro+periodo+horario)
CREATE TABLE inscripciones (
  inscripcion_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  alumno_id      BIGINT NOT NULL,
  asignacion_id  BIGINT NOT NULL,
  fecha_inscripcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado         ENUM('ACTIVA','RETIRADA','FINALIZADA') NOT NULL DEFAULT 'ACTIVA',
  CONSTRAINT fk_insc_alumno FOREIGN KEY (alumno_id) REFERENCES alumnos(alumno_id),
  CONSTRAINT fk_insc_asig   FOREIGN KEY (asignacion_id) REFERENCES asignaciones_maestro(asignacion_id),
  UNIQUE KEY uq_alumno_asig (alumno_id, asignacion_id),
  INDEX idx_insc_alumno (alumno_id)
) ENGINE=InnoDB;

-- Notas: vinculadas a la inscripción (así garantizas curso/maestro correctos)
CREATE TABLE notas (
  nota_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  inscripcion_id  BIGINT NOT NULL,
  bimestre        TINYINT NOT NULL,          -- 1..4 por ejemplo
  nota            DECIMAL(5,2) NOT NULL,     -- 0..100 o 0..10 según uses
  comentario      VARCHAR(250) NULL,
  creado_por_user BIGINT NOT NULL,           -- auditoría
  actualizado_por_user BIGINT NULL,
  creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notas_insc  FOREIGN KEY (inscripcion_id) REFERENCES inscripciones(inscripcion_id) ON DELETE CASCADE,
  CONSTRAINT fk_notas_creado_por FOREIGN KEY (creado_por_user) REFERENCES usuarios(user_id),
  CONSTRAINT fk_notas_act_por   FOREIGN KEY (actualizado_por_user) REFERENCES usuarios(user_id),
  CONSTRAINT ck_bimestre CHECK (bimestre BETWEEN 1 AND 4),
  CONSTRAINT ck_nota CHECK (nota >= 0),
  UNIQUE KEY uq_nota (inscripcion_id, bimestre)
) ENGINE=InnoDB;

-- =========================================================
-- 7) CONSULTAS ÚTILES (REPORTES / ESTADÍSTICAS)
-- (Son vistas opcionales para que empieces rápido)
-- =========================================================

-- Productos más vendidos (top por cantidad)
CREATE OR REPLACE VIEW vw_top_productos_vendidos AS
SELECT
  p.producto_id,
  p.nombre,
  p.modelo,
  SUM(vd.cantidad) AS unidades_vendidas,
  SUM(vd.total_linea) AS monto_vendido
FROM venta_detalle vd
JOIN productos p ON p.producto_id = vd.producto_id
GROUP BY p.producto_id, p.nombre, p.modelo;

-- Ventas por fecha (día)
CREATE OR REPLACE VIEW vw_ventas_por_dia AS
SELECT
  DATE(v.fecha_venta) AS dia,
  COUNT(*) AS num_ventas,
  SUM(v.total) AS total_vendido
FROM ventas v
GROUP BY DATE(v.fecha_venta);

-- Compras por fecha (día)
CREATE OR REPLACE VIEW vw_compras_por_dia AS
SELECT
  DATE(c.fecha_compra) AS dia,
  COUNT(*) AS num_compras,
  SUM(c.total) AS total_comprado
FROM compras c
GROUP BY DATE(c.fecha_compra);

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================

-- Verificar tablas creadas
SHOW TABLES;

SELECT 'Base de datos rpstore creada exitosamente!' AS mensaje;
