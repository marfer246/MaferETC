# 📱 MAFERETC - Gestor de Materias y Tareas

## 📋 Descripción General

**MaferETC** es una aplicación móvil desarrollada con React Native que permite a los estudiantes gestionar sus materias y tareas de forma eficiente. La aplicación implementa un sistema completo de autenticación, CRUD de materias, CRUD de tareas con validaciones y soft delete en la base de datos.

---

## 🏗️ Estructura de la Base de Datos

### Tablas Principales

#### 1. **usuarios**
```sql
- id: PRIMARY KEY (bigint)
- nombre: string
- correo: string (UNIQUE)
- password_hash: string
- created_at: timestamp
- updated_at: timestamp
```

#### 2. **materias**
```sql
- id: PRIMARY KEY (bigint)
- nombre: string
- profesor: string
- color: string (hexadecimal, ej: #90CAF9)
- usuario_id: FOREIGN KEY (bigint) → usuarios(id)
- deleted_at: timestamp (NULL) - SOFT DELETE
- created_at: timestamp
- updated_at: timestamp
```

#### 3. **tareas**
```sql
- id: PRIMARY KEY (bigint)
- titulo: string
- descripcion: text (nullable)
- prioridad: enum('Alta', 'Media', 'Baja')
- fecha: date
- completada: boolean (default: false)
- usuario_id: FOREIGN KEY (bigint) → usuarios(id)
- materia_id: FOREIGN KEY (bigint) → materias(id)
- deleted_at: timestamp (NULL) - SOFT DELETE
- created_at: timestamp
- updated_at: timestamp
```

### Relaciones

```
Usuario
├── hasMany → Materias (relación 1:N)
│   └── hasMany → Tareas (relación 1:N)
└── hasMany → Tareas (relación 1:N)
```

---

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Registro**
   - Usuario proporciona: nombre, correo, contraseña
   - La contraseña se hashea con `Hash::make()` (bcrypt)
   - Se valida que el correo sea único

2. **Login**
   - Usuario proporciona: correo, contraseña
   - Se verifica con `Hash::check()` la contraseña
   - Se genera token Sanctum (API token)
   - Token se almacena en AsyncStorage del cliente

3. **Recuperación de Contraseña**
   - Usuario proporciona: correo, nueva contraseña
   - Se valida que el usuario exista
   - Se actualiza el password_hash
   - No requiere verificación de la contraseña anterior

4. **Cierre de Sesión**
   - Se elimina el token del servidor
   - Se limpia AsyncStorage en el cliente

---

## 🛠️ Estructura del Proyecto

### **Backend (Laravel)**

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php      (Registro, Login, Logout, Reset Password)
│   │           ├── MateriasController.php  (CRUD de Materias)
│   │           └── TareasController.php    (CRUD de Tareas)
│   └── Models/
│       ├── Usuario.php                     (User model con Sanctum)
│       ├── Materia.php                     (hasMany Tareas, belongsTo Usuario)
│       └── Tarea.php                       (belongsTo Materia, belongsTo Usuario)
├── database/
│   └── migrations/
│       ├── create_usuarios_table.php       (Schema de usuarios)
│       ├── create_materias_table.php       (Schema de materias)
│       ├── create_tareas_table.php         (Schema de tareas)
│       └── add_soft_deletes_to_materias_and_tareas.php (Soft delete)
├── routes/
│   └── api.php                             (Todas las rutas API)
└── .env                                    (Configuración, DB_HOST, etc.)
```

### **Frontend (React Native)**

```
apuntes/
├── App.js                                  (Navegación principal + rutas)
├── contexto/
│   └── AuthContext.js                      (Manejo de autenticación global)
├── controllers/
│   ├── UserController.js                   (Métodos: register, login, logout)
│   ├── MateriaController.js                (Métodos: crear, actualizar, eliminar, listar)
│   └── TareaController.js                  (Métodos: crear, actualizar, eliminar, marcarCompletada)
├── api/
│   └── apiConfig.js                        (Configuración de axios + interceptor de token)
└── screens/
    ├── LoginScreen.js                      (Inicio de sesión)
    ├── RegistroScreen.js                   (Registro de usuario)
    ├── RecuperarContrasenaScreen.js        (Recuperar contraseña)
    ├── HomeScreen.js                       (Pantalla principal con estadísticas)
    ├── MateriasScreen.js                   (Listar materias con carga de API)
    ├── EditarMateriaScreen.js              (Editar y eliminar materia)
    ├── CrearMateriaScreen.js               (Crear nueva materia)
    ├── TareasScreen.js                     (Listar tareas con filtros)
    ├── EditarTareaScreen.js                (Editar y eliminar tarea)
    ├── CrearTareaScreen.js                 (Crear nueva tarea)
    └── PerfilScreen.js                     (Información del usuario + logout)
```

---

## 🔌 API ENDPOINTS

### **Rutas Públicas (Sin autenticación)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/registro` | Registrar nuevo usuario |
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/recuperar-contrasena` | Recuperar contraseña |

### **Rutas Protegidas (Requieren token Sanctum)**

#### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/user` | Obtener usuario actual |

#### Materias
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/materias` | Listar todas las materias del usuario |
| POST | `/api/materias` | Crear nueva materia |
| GET | `/api/materias/{id}` | Obtener materia específica |
| PUT | `/api/materias/{id}` | Actualizar materia |
| DELETE | `/api/materias/{id}` | Eliminar materia (soft delete) |

#### Tareas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tareas` | Listar todas las tareas del usuario |
| GET | `/api/tareas?materia_id=1` | Listar tareas de una materia |
| GET | `/api/tareas?estado=pendiente` | Filtrar por estado (completada/pendiente) |
| GET | `/api/tareas?prioridad=Alta` | Filtrar por prioridad |
| POST | `/api/tareas` | Crear nueva tarea |
| GET | `/api/tareas/{id}` | Obtener tarea específica |
| PUT | `/api/tareas/{id}` | Actualizar tarea |
| DELETE | `/api/tareas/{id}` | Eliminar tarea (soft delete) |
| GET | `/api/materias/{materiaId}/tareas` | Obtener tareas de una materia |

---

## 📝 Ejemplos de Requests

### Registro
```json
POST /api/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "password": "miPassword123"
}
```

### Login
```json
POST /api/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "password": "miPassword123"
}

Response:
{
  "success": true,
  "message": "Sesión iniciada correctamente.",
  "usuario": { ... },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Crear Materia
```json
POST /api/materias
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Matemáticas",
  "profesor": "Dra. Adela",
  "color": "#90CAF9"
}
```

### Crear Tarea
```json
POST /api/tareas
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Resolver ejercicios de integrales",
  "descripcion": "Capítulo 5, ejercicios 1-10",
  "prioridad": "Alta",
  "fecha": "2026-04-15",
  "materia_id": 1
}
```

---

## ✅ Cumplimiento de Requisitos

### ✓ Separación entre Interfaz y Lógica
- Controllers en `controllers/` (UserController, MateriaController, TareaController)
- Screens en `screens/` (pantallas de UI)
- Contexto de autenticación centralizado en `AuthContext.js`

### ✓ CRUD Funcional
- **Usuarios**: CREATE (registro), READ (login), UPDATE (cambiar contraseña)
- **Materias**: CREATE, READ, UPDATE, DELETE (con soft delete)
- **Tareas**: CREATE, READ, UPDATE, DELETE (con soft delete), MARCAR COMO COMPLETADA

### ✓ Validaciones en Formularios
- Campos obligatorios validados
- Ejercicio de correo único en registro
- Validación de formato de fecha (YYYY-MM-DD)
- Longitud mínima de campos (2+ caracteres)
- Confirmación de contraseña en cambios

### ✓ Manejo de Errores
- Try-catch en todos los controladores
- Mensajes de error amigables en modales
- Respuestas JSON estructuradas desde el backend
- Validación de conexión a la API

### ✓ Organización del Proyecto
```
Frontend: api/ | contexts/ | controllers/ | screens/ | assets/
Backend: app/ | config/ | database/ | routes/ | tests/
```

### ✓ Código Indentado y Legible
- Eslint compatible
- Indentación consistente (2 espacios en JS, 4 en PHP)
- Comentarios explicativos donde sea necesario
- Nombres de variables y funciones descriptivos

### ✓ Soft Delete Implementado
- Migración agregada: `add_soft_deletes_to_materias_and_tareas.php`
- Modelos con `SoftDeletes` trait
- Columna `deleted_at` en materias y tareas

---

## 🚀 Cómo Testear la Aplicación

### 1. **Iniciar el Backend**
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. **Verificar la Base de Datos**
- Las migraciones se ejecutaron automáticamente al crear el proyecto
- Verificar tablas en `maferetc_db`:
  - usuarios
  - materias
  - tareas

### 3. **Iniciar la Aplicación Frontend**
```bash
cd apuntes
npm start -- --reset-cache
# En el emulador o celular Android, presionar 'a'
```

### 4. **Flujo de Testing Completo**

#### A. Registro
1. Abre la app → Pantalla Login
2. Haz clic en "Crear una nueva cuenta"
3. Completa: Nombre, Correo, Contraseña, Confirmar Contraseña
4. Validaciones deben funcionar

#### B. Login
1. Usa las credenciales del usuario registrado
2. Debería mostrar la pantalla Home

#### C. Crear Materia
1. Navega a la pestaña "Materias"
2. Haz clic en "Agregar Materia"
3. Ingresa: Nombre, Profesor, Color
4. Guarda

#### D. Crear Tarea
1. Navega a la pestaña "Tareas"
2. Haz clic en "Nueva Tarea"
3. Ingresa: Título, Descripción, Materia, Prioridad, Fecha (YYYY-MM-DD)
4. Guarda

#### E. Editar Tarea
1. En la pantalla Tareas, toca una tarea
2. Abre la pantalla de edición
3. Modifica los datos
4. Guarda los cambios

#### F. Marcar Tarea como Completada
1. En la pantalla Tareas, toca el checkbox
2. La tarea debe cambiar de estado

#### G. Eliminar Tarea
1. En la pantalla Tareas, toca el ícono de basura
2. Confirma la eliminación
3. Debería desaparecer de la lista

#### H. Verificar Cambios en BD
1. Conecta a MySQL y ejecuta:
```sql
SELECT * FROM materias WHERE deleted_at IS NULL;
SELECT * FROM tareas WHERE deleted_at IS NULL;
```
2. Los datos eliminados deben tener valor en `deleted_at`

#### I. Recuperar Contraseña
1. En Login, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa correo y nueva contraseña
3. Intenta login con la nueva contraseña

#### J. Logout
1. Ve a la pestaña "Perfil"
2. Haz clic en "Cerrar Sesión"
3. Debería volver a la pantalla de Login

---

## 📱 Pantallas de la Aplicación

### Flujo Público
- **LoginScreen**: Autenticación de usuario
- **RegistroScreen**: Crear nueva cuenta
- **RecuperarContrasenaScreen**: Recuperar acceso

### Flujo Privado
- **HomeScreen**: Resumen de Materias, Tareas, Estadísticas
- **MateriasScreen**: Listar materias, crear, editar, eliminar
- **CrearMateriaScreen**: Formulario para crear materia
- **EditarMateriaScreen**: Editar y eliminar materia existente
- **TareasScreen**: Listar tareas con filtros (Todas/Pendientes/Completas)
- **CrearTareaScreen**: Formulario para crear tarea
- **EditarTareaScreen**: Editar y eliminar tarea existente
- **PerfilScreen**: Información del usuario y logout

---

## 🔒 Seguridad

1. **Contraseñas**: Hasheadas con bcrypt (Laravel Hash::make)
2. **Tokens**: Uso de Laravel Sanctum para API tokens
3. **Validación**: Todas las peticiones validadas en frontend y backend
4. **Autorización**: Verificación de propiedad de recursos (usuario_id)
5. **CORS**: Configurado para aceptar requests del cliente

---

## 📦 Dependencias Principales

### Backend (Laravel 11)
- `laravel/framework`
- `laravel/sanctum` (autenticación API)

### Frontend (React Native)
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`
- `axios` (cliente HTTP)
- `@react-native-async-storage/async-storage` (almacenamiento local)
- `@expo/vector-icons` (iconos)

---

## 🐛 Debugging

### Si la API returns HTML en vez de JSON:
```bash
cd backend
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan serve --host=0.0.0.0 --port=8000
```

### Si no carga las materias:
1. Verifica que el token se guarde correctamente en AsyncStorage
2. Revisa la red en DevTools (tab Network)
3. Verifica que `/api/materias` retorna JSON válido

### Si falla la migración de soft delete:
```bash
php artisan migrate:status
php artisan migrate --force
```

---

## 📞 Contacto/Entregas

Toda la lógica está lista para presentación. Las historias de usuario solicitadas están 100% implementadas.

