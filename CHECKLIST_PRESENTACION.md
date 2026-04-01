# ✅ CHECKLIST DE PRESENTACIÓN - MaferETC

## 📱 Estado de la Aplicación

Esta es una lista completa de todo lo que se puede demostrar durante la presentación en vivo.

---

## 🔐 1. GESTIÓN DE USUARIO

### ✅ Registro de Usuario
- [ ] 1. Abre la pantalla de Registro
- [ ] 2. Ingresa nombre: "Juan Pérez"
- [ ] 3. Ingresa correo: "juan@example.com"
- [ ] 4. Ingresa contraseña: "password123"
- [ ] 5. Confirma contraseña: "password123"
- [ ] 6. Toca "Crear Cuenta"
- [ ] Verificación: Muestra alerta de éxito y vuelve a Login
- [ ] BD: Ejecuta `SELECT * FROM usuarios` - debe aparecer el nuevo usuario con password hasheado

### ✅ Inicio de Sesión
- [ ] 1. Ingresa el mismo correo y contraseña
- [ ] 2. Toca "Iniciar Sesión"
- [ ] Verificación: Navega a la pantalla Home (pestañas visibles)
- [ ] Token se almacena en AsyncStorage

### ✅ Cierre de Sesión
- [ ] 1. Ve a pestaña "Perfil"
- [ ] 2. Toca el botón "Cerrar Sesión"
- [ ] Verificación: Vuelve a la pantalla Login
- [ ] AsyncStorage se limpia

### ✅ Recuperar Contraseña
- [ ] 1. En Login, toca "¿Olvidaste tu contraseña?"
- [ ] 2. Ingresa el correo registrado
- [ ] 3. Ingresa nueva contraseña: "nuevapassword456"
- [ ] 4. Confirma la nueva contraseña
- [ ] 5. Toca "Actualizar contraseña"
- [ ] Verificación: Muestra alerta de éxito
- [ ] 6. Vuelve a Login y prueba con la nueva contraseña
- [ ] Debe funcionar el login

---

## 📚 2. GESTIÓN DE MATERIAS

### ✅ Listar Materias
- [ ] 1. Ve a la pestaña "Materias"
- [ ] Verificación: Carga datos de la APIy no muestra datos hardcodeados
- [ ] Si no hay materias, muestra mensaje "No tienes materias aún"

### ✅ Crear Materia
- [ ] 1. Toca "Agregar Materia"
- [ ] 2. Ingresa nombre: "Matemáticas Avanzadas"
- [ ] 3. Ingresa profesor: "Dr. Juan García"
- [ ] 4. Selecciona color azul (#90CAF9)
- [ ] 5. Toca "Crear Materia"
- [ ] Verificación: Muestra alerta de éxito y vuelve a Materias list
- [ ] La nueva materia aparece en la lista

### ✅ Editar Materia
- [ ] 1. En MateriasScreen, presiona LARGO en una materia
- [ ] Alternativa: Toca en una materia existente y navega a EditarMateria
- [ ] 2. Cambia el nombre a "Cálculo Diferencial"
- [ ] 3. Cambia el profesor a "Dra. María López"
- [ ] 4. Cambia el color a verde (#A5D6A7)
- [ ] 5. Toca "Guardar Cambios"
- [ ] Verificación: Vuelve a Materias y muestra los cambios
- [ ] BD: Los cambios se reflejan en la tabla materias

### ✅ Eliminar Materia (Soft Delete)
- [ ] 1. En MateriasScreen, toca el ícono de basura
- [ ] 2. Confirma "Eliminar"
- [ ] Verificación: La materia desaparece de la lista
- [ ] BD: Ejecuta `SELECT * FROM materias WHERE deleted_at IS NULL` - no aparece
- [ ] BD: Ejecuta `SELECT * FROM materias WHERE deleted_at IS NOT NULL` - sí aparece con fecha

---

## ✏️ 3. GESTIÓN DE TAREAS

### ✅ Crear Tarea
- [ ] 1. Ve a pestaña "Tareas"
- [ ] 2. Toca "Nueva Tarea"
- [ ] 3. Ingresa título: "Resolver integrales"
- [ ] 4. Ingresa descripción: "Capítulo 5, ejercicios 1-20"
- [ ] 5. Selecciona una materia de la lista
- [ ] 6. Selecciona prioridad "Alta" (rojo)
- [ ] 7. Ingresa fecha: "2026-04-15" (formato YYYY-MM-DD)
- [ ] 8. Toca "Crear Tarea"
- [ ] Verificación: Aparece en la lista de Tareas con los datos correctos
- [ ] BD: Consulta `SELECT * FROM tareas` - aparece con materia_id correcto

### ✅ Listar Tareas con Filtros
- [ ] 1. En TareasScreen, verifica que cargue datos de la API
- [ ] 2. Toca filtro "Pendientes" - muestra solo tareas no completadas
- [ ] 3. Toca filtro "Completas" - muestra solo tareas completadas
- [ ] 4. Toca filtro "Todas" - muestra todas las tareas

### ✅ Marcar Tarea como Completada
- [ ] 1. En TareasScreen, toca el checkbox de una tarea
- [ ] Verificación: El checkbox se marca y el texto se tácha
- [ ] BD: `SELECT * FROM tareas WHERE id=X` - completada cambió a 1
- [ ] Toca nuevamente para desmarcar

### ✅ Editar Tarea
- [ ] 1. En TareasScreen, toca una tarea
- [ ] 2. Se abre EditarTareaScreen
- [ ] 3. Cambia el título a "Resolver derivadas"
- [ ] 4. Cambia la prioridad a "Media" (amarillo)
- [ ] 5. Cambia la fecha a "2026-05-20"
- [ ] 6. Toca "Guardar Cambios"
- [ ] Verificación: Vuelve a Tareas y muestra los cambios
- [ ] BD: Los cambios se reflejan en la tabla tareas

### ✅ Eliminar Tarea (Soft Delete)
- [ ] 1. En EditarTareaScreen, toca "Eliminar Tarea"
- [ ] 2. Confirma la eliminación
- [ ] Verificación: Vuelve a TareasScreen y la tarea desaparece
- [ ] BD: Ejecuta `SELECT * FROM tareas WHERE deleted_at IS NULL` - no aparece
- [ ] BD: Ejecuta `SELECT * FROM tareas WHERE deleted_at IS NOT NULL` - sí aparece

---

## 🎨 4. VALIDACIONES DE FORMULARIOS

### ✅ Validación de Registro
- [ ] 1. Intenta registrarse con nombre vacío - muestra error
- [ ] 2. Intenta registrarse con correo vacío - muestra error
- [ ] 3. Intenta registrarse con contraseña < 6 caracteres - muestra error
- [ ] 4. Intenta registrarse con correo duplicado - muestra error del servidor
- [ ] 5. Intenta registrarse con contraseñas no coincidentes - muestra error

### ✅ Validación de Materia
- [ ] 1. Intenta crear materia con nombre vacío - muestra error
- [ ] 2. Intenta crear materia sin profesor - muestra error
- [ ] 3. Intenta crear materia con nombre < 2 caracteres - muestra error
- [ ] 4. Intenta crear materia sin color - usa el color por defecto

### ✅ Validación de Tarea
- [ ] 1. Intenta crear tarea con título vacío - muestra error
- [ ] 2. Intenta crear tarea sin materia - muestra error
- [ ] 3. Intenta crear tarea con fecha vacía - muestra error
- [ ] 4. Intenta crear tarea con fecha en formato incorrecto - muestra error
- [ ] 5. Validación: Solo acepta formato "YYYY-MM-DD"

---

## 📊 5. VERIFICACIÓN DE BASE DE DATOS

### ✅ Conectar a la BD desde línea de comandos
```bash
mysql -u root -p maferetc_db
```

### ✅ Verificar Estructura
```sql
DESCRIBE usuarios;
DESCRIBE materias;
DESCRIBE tareas;
```

### ✅ Verificar Soft Delete
```bash
# Muestra registros activos
SELECT id, nombre, deleted_at FROM materias WHERE deleted_at IS NULL;

# Muestra registros eliminados
SELECT id, nombre, deleted_at FROM materias WHERE deleted_at IS NOT NULL;
```

### ✅ Ver Relaciones
```sql
-- Todas las materias del usuario con ID 1
SELECT m.* FROM materias m 
WHERE m.usuario_id = 1 AND m.deleted_at IS NULL;

-- Todas las tareas del usuario con ID 1
SELECT t.* FROM tareas t
WHERE t.usuario_id = 1 AND t.deleted_at IS NULL;

-- Tareas de una materia específica
SELECT t.* FROM tareas t
INNER JOIN materias m ON t.materia_id = m.id
WHERE m.id = 1 AND t.deleted_at IS NULL;
```

---

## 🔌 6. VERIFICACIÓN DE API

### ✅ Probar Endpoint de Login (PowerShell)
```powershell
$body = @{
    correo = "juan@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://192.168.100.24:8000/api/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$response.Content | ConvertFrom-Json | Format-List
```

### ✅ Probar Endpoint de Materias (Con Token)
```powershell
$token = "YOUR_TOKEN_HERE"

$response = Invoke-WebRequest `
    -Uri "http://192.168.100.24:8000/api/materias" `
    -Method Get `
    -Headers @{Authorization="Bearer $token"} `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json | Format-List
```

---

## 📱 7. PANTALLA HOME

### ✅ Mostrar Estadísticas
- [ ] 1. Ve a la pestaña "Inicio"
- [ ] 2. Debe mostrar:
  - [ ] Saludo personalizado con el nombre del usuario
  - [ ] Cantidad de materias
  - [ ] Cantidad de tareas totales
  - [ ] Porcentaje de tareas completadas
  - [ ] Próxima tarea pendiente con detalles
- [ ] 3. Los números deben actualizarse cuando se crean/eliminen materias/tareas

---

## 📁 8. ORGANIZACIÓN DEL CÓDIGO

### ✅ Estructura de Carpetas
```
apuntes/
├── api/
│   └── apiConfig.js ✓
├── controllers/
│   ├── UserController.js ✓
│   ├── MateriaController.js ✓
│   └── TareaController.js ✓
├── contexto/
│   └── AuthContext.js ✓
├── screens/ (10 pantallas) ✓
│   ├── LoginScreen.js
│   ├── RegistroScreen.js
│   ├── RecuperarContrasenaScreen.js
│   ├── HomeScreen.js
│   ├── MateriasScreen.js
│   ├── EditarMateriaScreen.js
│   ├── CrearMateriaScreen.js
│   ├── TareasScreen.js
│   ├── EditarTareaScreen.js
│   ├── CrearTareaScreen.js
│   └── PerfilScreen.js
├── App.js ✓
└── package.json ✓
```

### ✅ Código Legible
- [ ] 1. Abre cualquier archivo de pantalla
- [ ] 2. Verifica que tenga indentación consistente
- [ ] 3. Verifica que tenga nombres descriptivos de variables
- [ ] 4. Verifica que los StyleSheets sean bien organizados

---

## 🎯 RESUMEN DEL CUMPLIMIENTO

### ✅ Requisitos Obligatorios

| Requisito | Estado | Checklist |
|-----------|--------|-----------|
| Separación Interfaz/Lógica | ✅ | controllers/ + screens/ |
| CRUD Funcional | ✅ | Usuarios, Materias, Tareas |
| Validaciones | ✅ | Todos los formularios |
| Manejo de Errores | ✅ | Try-catch + Alerts |
| Organización | ✅ | Carpetas bien estructuradas |
| Código Legible | ✅ | Indentado y comentado |
| Soft Delete | ✅ | deleted_at en BD |
| Cambios en BD | ✅ | SELECT verificables |

### ✅ Gestión de Usuario
- [x] Registro ✓
- [x] Inicio de sesión ✓
- [x] Cierre de sesión ✓
- [x] Recuperar contraseña ✓

### ✅ Gestión de Materias
- [x] Crear ✓
- [x] Editar ✓
- [x] Eliminar (Soft Delete) ✓
- [x] Listar ✓

### ✅ Gestión de Tareas
- [x] Crear ✓
- [x] Editar ✓
- [x] Eliminar (Soft Delete) ✓
- [x] Marcar como completada ✓
- [x] Consultar por materia ✓
- [x] Filtrar por estado ✓
- [x] Filtrar por prioridad ✓

---

## 🚀 GUÍA RÁPIDA PARA LA PRESENTACIÓN

### Orden Sugerido:

1. **Mostrar la estructura del proyecto** (5 min)
   - Abrir VS Code y mostrar carpetas

2. **Explicar Base de Datos** (5 min)
   - Mostrar MySQL con tablas y relaciones
   - Mostrar soft delete en acción

3. **Demostración en vivo** (20 min)
   - Registrar usuario nuevo
   - Crear materia
   - Crear tarea
   - Editar tarea
   - Marcar tarea como completada
   - Eliminar tarea
   - Verificar soft delete en BD

4. **Mostrar API endpoints** (5 min)
   - Hacer POST /api/login con Postman o curl
   - Mostrar respuesta JSON

5. **Responder preguntas técnicas** (5 min)
   - Estructura de BD y relaciones
   - Cómo funciona la autenticación
   - Cómo comunicarse con la API

---

## 📞 NOTAS FINALES

- Asegúrate de que el backend esté corriendo
- La base de datos debe estar accesible
- El dispositivo debe conectarse a la red local (192.168.x.x o 10.x.x.x)
- Las materias creadas antes de las tareas para que funcione correctamente el selector
- Tener una conexión estable a internet para cargar imágenes/iconos

