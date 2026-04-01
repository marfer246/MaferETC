# 🏗️ ARQUITECTURA TÉCNICA DE MAFERETC

## 📋 Tabla de Contenidos
1. [Diagrama General](#1-diagrama-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Flujo de Autenticación](#3-flujo-de-autenticación)
4. [Estructura de Base de Datos](#4-estructura-de-base-de-datos)
5. [Flujo de Datos API](#5-flujo-de-datos-api)
6. [Patrones de Diseño](#6-patrones-de-diseño)
7. [Seguridad](#7-seguridad)

---

## 1. DIAGRAMA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    DISPOSITIVO USUARIO                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             REACT NATIVE + EXPO APP                  │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │         PANTALLAS (Screens/)                │    │   │
│  │  │  • LoginScreen                              │    │   │
│  │  │  • RegistroScreen                           │    │   │
│  │  │  • HomeScreen                               │    │   │
│  │  │  • MateriasScreen/EditarMateriaScreen       │    │   │
│  │  │  • TareasScreen/EditarTareaScreen           │    │   │
│  │  │  • PerfilScreen                             │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                       ↑↓                             │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │        CONTROLLERS (controllers/)           │    │   │
│  │  │  • UserController.js                        │    │   │
│  │  │  • MateriaController.js                     │    │   │
│  │  │  • TareaController.js                       │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                       ↑↓                             │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │      CONTEXT API (contexto/)                │    │   │
│  │  │  • AuthContext.js (Estado Global)           │    │   │
│  │  │  • Almacena: token, usuario, isLoggedIn     │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                       ↑↓                             │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │     HTTP CLIENT (api/)                      │    │   │
│  │  │  • apiConfig.js → Axios                     │    │   │
│  │  │  • Bearer Token Header                      │    │   │
│  │  │  • Interceptor para Token                   │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                       ↑↓                             │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │      AsyncStorage (Persistent State)        │    │   │
│  │  │  • token (Bearer)                           │    │   │
│  │  │  • usuario (JSON)                           │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                       ↑↓                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  NETWORK REQUEST (HTTPS/HTTP)                       │   │
│  │  GET/POST/PUT/DELETE + Bearer Token                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓↑                                 │
└─────────────────────────────────────────────────────────────┘
                           INTERNET
        ┌───────────────────────────────────────────┐
        │  BACKEND SERVER (Laravel 11 en PHP)       │
        │  http://192.168.100.24:8000               │
        │                                           │
        │  ┌─────────────────────────────────────┐  │
        │  │  ROUTES (routes/api.php)            │  │
        │  │  POST   /login                      │  │
        │  │  POST   /registro                   │  │
        │  │  GET    /materias (auth:sanctum)    │  │
        │  │  POST   /materias (auth:sanctum)    │  │
        │  │  PUT    /materias/{id}              │  │
        │  │  DELETE /materias/{id}              │  │
        │  │  GET    /tareas (auth:sanctum)      │  │
        │  │  POST   /tareas (auth:sanctum)      │  │
        │  │  PUT    /tareas/{id}                │  │
        │  │  DELETE /tareas/{id}                │  │
        │  └─────────────────────────────────────┘  │
        │                  ↑↓                        │
        │  ┌─────────────────────────────────────┐  │
        │  │  CONTROLLERS (app/Http/Controllers) │  │
        │  │  • MateriasController                │  │
        │  │  • TareasController                  │  │
        │  │  • UserController                    │  │
        │  │  • AuthController                    │  │
        │  └─────────────────────────────────────┘  │
        │                  ↑↓                        │
        │  ┌─────────────────────────────────────┐  │
        │  │  MODELS (app/Models)                │  │
        │  │  • User / Usuario                    │  │
        │  │  • Materia (SoftDeletes)             │  │
        │  │  • Tarea (SoftDeletes)               │  │
        │  │  Relationships:                      │  │
        │  │  Usuario → Materias (1:N)           │  │
        │  │  Usuario → Tareas (1:N)             │  │
        │  │  Materia → Tareas (1:N)             │  │
        │  └─────────────────────────────────────┘  │
        │                  ↑↓                        │
        │  ┌─────────────────────────────────────┐  │
        │  │  AUTHENTICATION (Sanctum)            │  │
        │  │  • Genera Bearer Token en Login      │  │
        │  │  • Valida Token en requests          │  │
        │  │  • Middleware: auth:sanctum          │  │
        │  └─────────────────────────────────────┘  │
        │                  ↑↓                        │
        │  ┌─────────────────────────────────────┐  │
        │  │  DATABASE (MySQL)                    │  │
        │  │  maferetc_db                         │  │
        │  │  • usuarios                          │  │
        │  │  • materias (deleted_at)             │  │
        │  │  • tareas (deleted_at)               │  │
        │  │  • personal_access_tokens (Sanctum)  │  │
        │  └─────────────────────────────────────┘  │
        │                                           │
        └───────────────────────────────────────────┘
```

---

## 2. STACK TECNOLÓGICO

### Frontend (Dispositivo Móvil)

```
React Native 0.73+ 
├── Framework: Expo
├── Navigation: React Navigation v5+
│   ├── Bottom Tabs Navigator
│   ├── Stack Navigator (Private/Public)
│   └── Native Stack Navigator
├── State Management
│   ├── Context API (datos globales)
│   ├── useState (estado local)
│   └── AsyncStorage (persistencia)
├── HTTP Client: Axios v1.0+
│   └── Interceptors (auto-agregar token)
├── Icons
│   ├── Feather Icons
│   ├── Ionicons
│   └── MaterialCommunityIcons
└── UI: StyleSheet nativo + componentes React Native
    ├── View, Text, ScrollView
    ├── FlatList, TextInput
    ├── TouchableOpacity, Alert
    ├── ActivityIndicator, Modal
    └── DatePicker, ColorPicker
```

### Backend (Servidor)

```
PHP 8.2+
└── Laravel Framework 11
    ├── Sanctum (API Authentication)
    │   └── Bearer Token Generation
    ├── Database
    │   ├── ORM: Eloquent
    │   ├── Driver: MySQL
    │   ├── Migrations (Schema Management)
    │   └── SoftDeletes (Logical Deletion)
    ├── Controllers
    │   └── Action-based (CRUD methods)
    ├── Models
    │   ├── User / Usuario
    │   ├── Materia (with relationships)
    │   └── Tarea (with relationships)
    ├── Middleware
    │   ├── auth:sanctum (API protection)
    │   └── cors (Cross-Origin)
    ├── Routing
    │   ├── API routes
    │   ├── Resource routing (REST)
    │   └── Custom routes
    └── Sessions
        └── Driver: file (no database sessions)

Database: MySQL 5.7+
└── Database: maferetc_db
    ├── Table: usuarios
    │   ├── id (PK)
    │   ├── nombre
    │   ├── correo (UNIQUE)
    │   ├── password_hash
    │   ├── remember_token
    │   ├── email_verified_at
    │   ├── created_at, updated_at
    │   └── deleted_at (soft delete)
    ├── Table: materias
    │   ├── id (PK)
    │   ├── usuario_id (FK → usuarios)
    │   ├── nombre
    │   ├── profesor
    │   ├── color (hex)
    │   ├── created_at, updated_at
    │   └── deleted_at (soft delete) ← NUEVO
    ├── Table: tareas
    │   ├── id (PK)
    │   ├── materia_id (FK → materias)
    │   ├── usuario_id (FK → usuarios)
    │   ├── titulo
    │   ├── descripcion
    │   ├── fecha (DATE)
    │   ├── prioridad (ENUM: Alta/Media/Baja)
    │   ├── completada (BOOLEAN)
    │   ├── created_at, updated_at
    │   └── deleted_at (soft delete) ← NUEVO
    └── Table: personal_access_tokens (Sanctum)
        ├── id (PK)
        ├── tokenable_id, tokenable_type
        ├── name (nombre del token)
        ├── token (hash)
        ├── abilities (permisos)
        └── created_at
```

---

## 3. FLUJO DE AUTENTICACIÓN

### A. Registro de Usuario

```
┌────────────────────────────────────────────────────┐
│ FRONTEND: Pantalla Registro                        │
│ User ingresa: nombre, correo, password             │
└────────────────────────────────────────────────────┘
                          ↓
    POST /api/registro {nombre, correo, password}
                          ↓
┌────────────────────────────────────────────────────┐
│ BACKEND: AuthController@register                   │
│ 1. Valida email único                              │
│ 2. Valida formato email                            │
│ 3. Valida password ≥ 6 caracteres                  │
│ 4. Hash password con bcrypt                        │
│ 5. Crea usuario en BD                              │
│ 6. Retorna usuario creado                          │
└────────────────────────────────────────────────────┘
                          ↓
    Response 201 + JSON user
                          ↓
┌────────────────────────────────────────────────────┐
│ FRONTEND: UserController.registro()                │
│ 1. Recibe JSON con usuario                         │
│ 2. Muestra alerta "Usuario creado"                 │
│ 3. Navega a LoginScreen                            │
│ 4. Usuario ya existe en BD listo para login        │
└────────────────────────────────────────────────────┘
```

### B. Inicio de Sesión (Login)

```
┌────────────────────────────────────────────────────┐
│ FRONTEND: Pantalla Login                           │
│ User ingresa: correo, password                     │
└────────────────────────────────────────────────────┘
                          ↓
    POST /api/login {correo, password}
                          ↓
┌────────────────────────────────────────────────────┐
│ BACKEND: AuthController@login                      │
│ 1. Busca usuario por correo                        │
│ 2. Verifica password con Hash::check()             │
│ 3. Genera Bearer Token con Sanctum                 │
│ 4. Almacena token en personal_access_tokens        │
│ 5. Retorna {token, usuario}                        │
└────────────────────────────────────────────────────┘
                          ↓
    Response 200 + {token: "eyJ0eXAi...", user: {...}}
                          ↓
┌────────────────────────────────────────────────────┐
│ FRONTEND: UserController.login()                   │
│ 1. Recibe token y datos usuario                    │
│ 2. Almacena token en AsyncStorage                  │
│ 3. Almacena usuario en AuthContext                 │
│ 4. Configura header Authorization para futuros req │
│ 5. Navega a HomeScreen (Authenticated)             │
└────────────────────────────────────────────────────┘
                          ↓
        Usuario en sesión autenticada
    (Todos los requests llevan: Bearer token)
```

### C. Request Autenticado (Ejemplo GET /materias)

```
┌────────────────────────────────────────────────────┐
│ FRONTEND: MateriasScreen.cargarMaterias()          │
│ 1. Lee token de AsyncStorage                       │
│ 2. Crear request con Axios                         │
└────────────────────────────────────────────────────┘
                          ↓
    GET /api/materias
    Header: Authorization: Bearer eyJ0eXAi...
                          ↓
┌────────────────────────────────────────────────────┐
│ BACKEND: autenticación                             │
│ 1. Middleware auth:sanctum intercepta request      │
│ 2. Extrae token del header                         │
│ 3. Valida token en tabla personal_access_tokens    │
│ 4. Si inválido/expirado → 401 Unauthorized         │
│ 5. Si válido → $request->user() = usuario autent   │
└────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────┐
│ BACKEND: MateriasController@index                  │
│ 1. Accede a $request->user()                       │
│ 2. Query: $request->user()->materias()->get();     │
│    Solo devuelve materias del usuario autenticado  │
│ 3. Retorna JSON con materias                       │
└────────────────────────────────────────────────────┘
                          ↓
    Response 200 + JSON materias
                          ↓
┌────────────────────────────────────────────────────┐
│ FRONTEND: MateriasScreen                           │
│ 1. Recibe JSON                                     │
│ 2. setState(materias)                              │
│ 3. FlatList renderiza cada materia                 │
└────────────────────────────────────────────────────┘
```

### D. Logout

```
┌────────────────────────────────────────────────────┐
│ FRONTEND: PerfilScreen.handleLogout()              │
│ User toca "Cerrar Sesión"                          │
└────────────────────────────────────────────────────┘
                          ↓
    POST /api/logout
    Header: Authorization: Bearer token
                          ↓
┌────────────────────────────────────────────────────┐
│ BACKEND: AuthController@logout                     │
│ 1. Recibe request autenticado                      │
│ 2. Elimina token de personal_access_tokens         │
│ 3. Retorna {message: "Desconectado"}               │
└────────────────────────────────────────────────────┘
                          ↓
    Response 200
                          ↓
┌────────────────────────────────────────────────────┐
│ FRONTEND: UserController.logout()                  │
│ 1. Elimina token de AsyncStorage                   │
│ 2. Limpia AuthContext                              │
│ 3. Navega a LoginScreen                            │
└────────────────────────────────────────────────────┘
                          ↓
        Usuario nuevamente en sesión pública
```

---

## 4. ESTRUCTURA DE BASE DE DATOS

### Tabla: usuarios

```sql
CREATE TABLE usuarios (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMP NULL,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Índices para búsqueda rápida
INDEX idx_correo (correo);
INDEX idx_created_at (created_at);
```

**Relaciones:**
```
Usuario (1) ──────→ (N) Materias (hasMany)
Usuario (1) ──────→ (N) Tareas    (hasMany)
```

---

### Tabla: materias

```sql
CREATE TABLE materias (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  profesor VARCHAR(255),
  color VARCHAR(7) DEFAULT '#ffffff',  -- Color hex
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,  -- ← SOFT DELETE
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
INDEX idx_usuario_id (usuario_id);
INDEX idx_deleted_at (deleted_at);
```

**Relaciones:**
```
Materia (N) ───belongs_to──→ (1) Usuario
Materia (1) ───hasMany──→ (N) Tareas
```

**Soft Delete:**
- Cuando se elimina: `UPDATE materias SET deleted_at = NOW() WHERE id = X;`
- Queries automáticas excluyen: `WHERE deleted_at IS NULL`
- Restaurar: `UPDATE materias SET deleted_at = NULL WHERE id = X;`

---

### Tabla: tareas

```sql
CREATE TABLE tareas (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  materia_id BIGINT UNSIGNED NOT NULL,
  usuario_id BIGINT UNSIGNED NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  prioridad ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
  completada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,  -- ← SOFT DELETE
  
  FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices
INDEX idx_materia_id (materia_id);
INDEX idx_usuario_id (usuario_id);
INDEX idx_completada (completada);
INDEX idx_deleted_at (deleted_at);
```

**Relaciones:**
```
Tarea (N) ───belongs_to──→ (1) Materia
Tarea (N) ───belongs_to──→ (1) Usuario
```

**Soft Delete:**
- Cuando se elimina: `UPDATE tareas SET deleted_at = NOW() WHERE id = X;`
- Queries excluyen: Incluye `WHERE deleted_at IS NULL` automático
- Al mostrar: Solo aparecen tareas no eliminadas

---

### Tabla: personal_access_tokens (Sanctum)

```sql
CREATE TABLE personal_access_tokens (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  tokenable_type VARCHAR(255) NOT NULL,  -- "App\Models\User"
  tokenable_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  token VARCHAR(80) UNIQUE NOT NULL,
  abilities LONGTEXT,                    -- JSON permisos
  last_used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (tokenable_id) REFERENCES usuarios(id)
);

-- Índices
INDEX idx_tokenable (tokenable_type, tokenable_id);
UNIQUE INDEX idx_token (token);
```

**Uso:**
- Cada login genera un nuevo token
- Token válido por 1 hora (configurable)
- Al logout se elimina de esta tabla

---

## 5. FLUJO DE DATOS API

### Crear Materia

```
FRONTEND                            BACKEND
┌─────────────────┐               ┌──────────────────┐
│ CrearMateria    │               │ MateriasController
│ Screen          │               │ @store()          │
└────────┬────────┘               └──────────────────┘
         │
         │ MateriaController
         │ .crear(nombre,
         │        profesor,
         │        color)
         │
         ↓
    Validar:
    ✓ nombre ≠ ""
    ✓ profesor ≠ ""
    ✓ nombre.length ≥ 2
    ✓ color válido hex
         │
         ↓
    POST /api/materias
    {
      nombre: "Matemáticas",
      profesor: "Dr. García",
      color: "#90CAF9"
    }
    Header: Authorization: Bearer token
         │
         ├─→ BACKEND Validación
         │   ✓ email único
         │   ✓ campos no nulos
         │   ✓ color formato hex
         │
         ├─→ BACKEND Crear
         │   $materia = $request->user()
         │             ->materias()
         │             ->create($validated);
         │
         └→ BACKEND Respuesta
            201 Created
            {
              id: 5,
              usuario_id: 1,
              nombre: "Matemáticas",
              profesor: "Dr. García",
              color: "#90CAF9",
              created_at: "2024-03-31T...",
              updated_at: "2024-03-31T..."
            }
         │
         ↓ FRONTEND
         setState(materias=[...materias, new])
         Alert "Materia creada"
         Navigate back to MateriasScreen
```

---

### Eliminar Materia (Soft Delete)

```
FRONTEND                          BACKEND
┌─────────────────┐              ┌──────────────────┐
│ MateriasScreen  │              │ MateriasController
│ Delete button   │              │ @destroy()        │
└────────┬────────┘              └──────────────────┘
         │
         │ User confirms Alert
         │
         ↓
    MateriaController.eliminar(id)
         │
         ↓
    DELETE /api/materias/5
    Header: Authorization: Bearer token
         │
         ├─→ BACKEND Authorization
         │   if (materia.usuario_id !== auth()->id())
         │     return 403 Forbidden
         │
         ├─→ BACKEND Soft Delete
         │   $materia->delete();
         │   // Usa SoftDeletes trait
         │   // Update materias SET deleted_at = NOW()
         │
         └→ BACKEND Respuesta
            204 No Content
         │
         ↓ FRONTEND
         setState(materias filter out deleted)
         Alert "Materia eliminada"
         
┌─────────────────────────────┐
│ BD: ANTES                   │
├─────────────────────────────┤
│ id=5, nombre="Matemáticas"  │
│ deleted_at=NULL             │
└─────────────────────────────┘
              ↓↓↓ DELETE
┌─────────────────────────────┐
│ BD: DESPUÉS (Soft Delete)   │
├─────────────────────────────┤
│ id=5, nombre="Matemáticas"  │
│ deleted_at="2024-03-31 14:30│
└─────────────────────────────┘

SELECT * FROM materias;
-- No devuelve materias eliminadas (scope global)

SELECT * FROM materias WHERE deleted_at IS NOT NULL;
-- Sí devuelve solo eliminadas (audit trail)
```

---

## 6. PATRONES DE DISEÑO

### A. MVC Pattern (Model-View-Controller)

```
VIEW (Screens/)           CONTROLLER (controllers/)      MODEL (Models/)
┌────────────────┐       ┌────────────────┐            ┌────────────────┐
│ MateriasScreen │  ───→ │ MateriaController   ────→ │ Materia        │
│                │       │ .listar()        │         │                │
│ Renderiza UI   │       │ .crear()         │         │ Relationships  │
│ Maneja eventos │       │ .actualizar()    │         │ .hasMany(Tarea)│
│ Muestra datos  │       │ .eliminar()      │         │ .belongsTo(U.) │
│                │       │                  │         │                │
│ Datos          │       │ Lógica de        │         │ Validaciones   │
│ cargados por   │  ←── │ negocio /API     │  ←────  │ Relaciones BD  │
│ controllers    │       │                  │         │                │
└────────────────┘       └────────────────┘         └────────────────┘
```

**Separación de Responsabilidades:**
- **SCREEN**: Solo renderiza datos y captura eventos de usuario
- **CONTROLLER**: Maneja lógica: validaciones, llamadas API, manejo de errores
- **MODEL**: Define estructura datos, relaciones, métodos Eloquent

---

### B. Repository/Controller Pattern (Lógica en Controllers)

```javascript
// SCREEN (dumb component)
import MateriaController from '../controllers/MateriaController';

function MateriasScreen() {
  const [materias, setMaterias] = useState([]);

  const cargarMaterias = async () => {
    const resultado = await MateriaController.listar();
    if (resultado.success) {
      setMaterias(resultado.materias);
    }
  };

  return <FlatList data={materias} renderItem={renderMateria} />;
}
```

```javascript
// CONTROLLER (smart component)
class MateriaController {
  static async listar() {
    try {
      const response = await api.get('/materias');
      return { success: true, materias: response.data };
    } catch (error) {
      return { success: false, ERROR: error.message };
    }
  }

  static async crear(nombre, profesor, color) {
    try {
      // VALIDACIONES
      if (!nombre || nombre.length < 2) {
        return { success: false, error: 'Nombre inválido' };
      }
      // API CALL
      const response = await api.post('/materias', {
        nombre, profesor, color
      });
      return { success: true, materia: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }
}
```

---

### C. Context API for Global State

```
State Global (AuthContext)
┌──────────────────────┐
│ token                │
│ usuario              │
│ isLoading            │
│ error                │
└──────────────────────┘
         ↑ (Provider)
         │
    ┌────┴────┬────────┬─────────┐
    │          │        │         │
 Screen1    Screen2  Screen3  Navigation
```

**Flujo:**
1. AuthContext mantine token + usuario
2. MateriasScreen accede con `useContext(AuthContext)`
3. Cuando login exitoso: Actualiza AuthContext (todo re-renderiza)
4. AuthContext propaga token a todos los controllers

---

## 7. SEGURIDAD

### A. Password Hashing

```
REGISTRO:
"password123"
    ↓ Hash::make() (bcrypt)
"$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86.SVqbrnF2"
    ↓ Almacena en BD (password_hash)
```

```
LOGIN:
User ingresa: "password123"
    ↓
Hash::check("password123", stored_hash)
    ↓
true/false (procede o error)
```

**Ventajas:**
- Password nunca se almacena en texto plano
- Incluso si alguien accede la BD, no ve passwords
- Hash es unidireccional (no se puede revertir)

---

### B. Bearer Token Authentication

```
LOGIN EXITOSO:
Backend genera token único
    ↓
Devuelve: "Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
    ↓
Frontend almacena en AsyncStorage
    ↓
GET /api/materias
Header: Authorization: Bearer eyJ0eXAi...
    ↓
Backend valida token en personal_access_tokens
    ↓
Si válido → Acceso permitido
Si inválido → 401 Unauthorized
```

**Ventajas:**
- Stateless (no requiere sessions en el servidor)
- Puede expirar automáticamente
- No vulnerable a CSRF (sin cookies)
- Escalable en múltiples servidores

---

### C. Authorization Checks

```php
// MateriasController@destroy
public function destroy(Materia $materia, Request $request) {
    // Verifica que el usuario autenticado es el dueño
    if ($materia->usuario_id !== $request->user()->id) {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    
    $materia->delete();
    return response()->json(null, 204);
}
```

**Previene:**
- Cross-User manipulation (User A modifica datos de User B)
- Escalación de privilegios
- Acceso no autorizado a resources

---

### D. Input Validation

```php
// MateriasController@store
public function store(Request $request) {
    $validated = $request->validate([
        'nombre' => 'required|string|min:2|max:255',
        'profesor' => 'required|string|max:255',
        'color' => 'required|string|regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/',
    ]);
    
    // Solo procede si validación pasa
    // Si falla → 422 Unprocessable Entity + errores
}
```

**Previene:**
- SQL Injection (Eloquent escapa automáticamente)
- XSS (solo acepta strings válidos)
- Datos inválidos en BD
- Stack overflow (limita longitudes)

---

## 📞 EXPLICAR DURANTE LA PRESENTACIÓN

**Puntos clave para enfatizar:**

1. **Arquitectura separada:**
   - "El frontend y backend son completamente independientes"
   - "Frontend = Interfaz user"
   - "Backend = Lógica y datos"

2. **Flujo de autenticación:**
   - "Cuando login, backend genera un token"
   - "Token se almacena en el teléfono"
   - "Cada request lleva el token"
   - "Backend verifica token antes de permitir acceso"

3. **Base de datos:**
   - "3 tablas principales: usuarios, materias, tareas"
   - "Relaciones: Usuario tiene muchas materias"
   - "Materia tiene muchas tareas"

4. **Soft Delete:**
   - "No borra datos realmente"
   - "Solo marca con timestamp de eliminación"
   - "Permite auditoría y recuperación"

5. **Seguridad:**
   - "Passwords hasheadas (no se ven en BD)"
   - "Token-based (stateless, sin sesiones)"
   - "Validaciones en frontend y backend"
   - "Autorización (User A no ve datos de User B)"

