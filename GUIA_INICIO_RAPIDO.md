# 🎬 GUÍA DE INICIO RÁPIDO - MaferETC

## ⚡ ANTES DE LA PRESENTACIÓN

### Verificar que todo está en su lugar:

```bash
# 1. Verificar que la BD existe
mysql -u root -p maferetc_db -e "SELECT 1"

# 2. Verificar que los archivos están en su lugar
cd c:\Users\Satanas\Desktop\ETC\io\MaferETC
dir backend
dir apuntes
```

---

## 🖥️ PASO 1: INICIAR EL BACKEND

### Terminal 1 - Backend (PHP/Laravel)

```bash
# Navega a la carpeta backend
cd c:\Users\Satanas\Desktop\ETC\io\MaferETC\backend

# Inicia el servidor
php artisan serve --host=0.0.0.0 --port=8000
```

**Salida esperada:**
```
Illuminate\Foundation\ComposerScripts::postAutoloadDump
@php artisan package:discover --ansi

Laravel development server started on [http://0.0.0.0:8000]
Press Ctrl+C to stop the server
```

✅ El backend estará disponible en:
- `http://127.0.0.1:8000` (local)
- `http://192.168.100.24:8000` (red local)

### Si el Backend Falla:

**Problema: "Could not open input file: artisan"**
```bash
# Solución: Usa la ruta completa
php "c:\Users\Satanas\Desktop\ETC\io\MaferETC\backend\artisan" serve --host=0.0.0.0 --port=8000
```

**Problema: "Port 8000 in use"**
```bash
# Usa otro puerto
php artisan serve --host=0.0.0.0 --port=8001
# Y actualiza apiConfig.js en el frontend para usar puerto 8001
```

**Problema: "Connection Refused" en la BD**
```bash
# Verifica que MySQL está corriendo
mysql -u root -p -e "SELECT 'OK'"

# Verifica las credenciales en .env
cat .env | grep DB_
```

---

## 📱 PASO 2: INICIAR EL FRONTEND

### Terminal 2 - Frontend (React Native)

```bash
# Navega a la carpeta apuntes
cd c:\Users\Satanas\Desktop\ETC\io\MaferETC\apuntes

# Limpia cache y reinicia
npm start -- --reset-cache
```

**Salida esperada:**
```
Starting Metro Bundler
...
Your app is running at http://localhost:19000
```

### Opciones de Ejecución:

**Opción 1: Emulador Android**
```
Presiona: 'a'
↓
Se abre Android Studio emulator automáticamente
```

**Opción 2: Dispositivo Físico**
```
1. Instala Expo Go en tu teléfono (App Store/Play Store)
2. Abre Expo Go
3. Escanea el QR que aparece en la terminal
4. La app carga en tu dispositivo en tiempo real
```

**Opción 3: Web (Prueba rápida)**
```
Presiona: 'w'
↓
Se abre en navegador (localhost:19006)
⚠️ Nota: Algunas características native no funcionarán
```

---

## 🔗 PASO 3: VERIFICAR CONECTIVIDAD

Una vez que están corriendo ambos servidores:

### En la terminal del frontend, busca este mensaje:
```
✅ Backend disponible en: http://192.168.100.24:8000
```

### Si ves error "Network request failed":
```
PROBLEMA: El frontend no puede conectar con el backend

SOLUCIÓN 1: Verificar URL en apiConfig.js
```bash
# Abre apuntes/api/apiConfig.js
# Línea: const API_URL = 'http://192.168.100.24:8000/api';
# Cambia 192.168.100.24 por tu IP actual o 127.0.0.1
```

SOLUCIÓN 2: Firewalls bloquean puerto 8000
```bash
# Desactiva firewall temporalmente (solo para testing)
# O abre puerto 8000 en el firewall
```

---

## 📊 PASO 4: TESEAR CONEXIÓN CON CURL

Abre **Terminal 3** para probar la API:

### Test 1: Verificar que el servidor está vivo
```bash
curl -i http://127.0.0.1:8000/api/login
```

**Respuesta esperada:**
```
HTTP/1.1 405 Method Not Allowed
```
(405 es correcto porque GET no es permitido, pero significa que el servidor responde)

### Test 2: Hacer login (para obtener token)
```bash
# En PowerShell:
$body = @{
    correo = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://127.0.0.1:8000/api/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$response.Content | ConvertFrom-Json
```

**Respuesta esperada:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "correo": "test@example.com",
    "nombre": "Test User"
  }
}
```

### Test 3: Obtener materias del usuario (requiere token)
```bash
# En PowerShell:
$token = "PEGA_EL_TOKEN_AQUI"

$response = Invoke-WebRequest `
    -Uri "http://127.0.0.1:8000/api/materias" `
    -Method Get `
    -Headers @{Authorization="Bearer $token"} `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json
```

---

## 🗄️ PASO 5: VERIFICAR BASE DE DATOS

Abre **Terminal 4** para inspeccionar la BD:

```bash
# Conecta a MySQL
mysql -u root -p maferetc_db
```

Una vez dentro, ejecuta:

### Ver estructura de tablas
```sql
SHOW TABLES;
DESCRIBE usuarios;
DESCRIBE materias;
DESCRIBE tareas;
```

### Ver datos históricos (incluyendo soft deletes)
```sql
-- Usuarios activos
SELECT id, correo, nombre FROM usuarios;

-- Materias activas
SELECT id, nombre, profesor FROM materias WHERE deleted_at IS NULL;

-- Materias eliminadas
SELECT id, nombre, deleted_at FROM materias WHERE deleted_at IS NOT NULL;

-- Tareas completadas
SELECT id, titulo, completada FROM tareas WHERE completada = 1;

-- Tareas eliminadas
SELECT id, titulo, deleted_at FROM tareas WHERE deleted_at IS NOT NULL;
```

---

## 🎯 ORDEN DE DEMOSTRACIÓN RECOMENDADO

### 1. Mostrar Backend encendido (2 min)
```bash
# En Terminal 1
# Muestra el servidor escuchando en 0.0.0.0:8000
```

### 2. Mostrar Base de Datos (2 min)
```bash
# En Terminal 4
mysql> SELECT COUNT(*) as total_usuarios FROM usuarios;
mysql> DESCRIBE materias;
```

### 3. Abrir Aplicación en Dispositivo (1 min)
```bash
# En Terminal 2
# Muestra Metro Bundler listo
# El app abre en el emulador/dispositivo
```

### 4. Demostración en Vivo de Funcionalidades (15-20 min)
**Orden sugerido:**
- a. Registrar usuario nuevo
- b. Iniciar sesión
- c. Ver materias (lista vacía inicialmente)
- d. Crear materia "Matemáticas"
- e. Crear materia "Física"
- f. Ir a Tareas → crear tarea "Integral definida" en Matemáticas
- g. Crear tarea "Óptica" en Física
- h. Marcar tarea como completada (checkbox)
- i. Editar tarea: cambiar prioridad a "Alta"
- j. Eliminar una materia → verificar soft delete en BD

### 5. Mostrar Cambios en BD (3 min)
```bash
# En Terminal 4
mysql> SELECT * FROM tareas WHERE id LIKE '%';
# Muestra la tarea editada
mysql> SELECT * FROM materias WHERE deleted_at IS NOT NULL;
# Muestra la materia eliminada con timestamp
```

### 6. Responder Preguntas Técnicas (5-10 min)
- "¿Cómo se comunican frontend y backend?"
- "¿Cómo se guardan las contraseñas?"
- "¿Qué es soft delete y por qué se usa?"
- "¿Cómo se validan los datos?"

---

## ⚙️ CONFIGURACIÓN IMPORTANTE

### Archivo: `apuntes/api/apiConfig.js`

```javascript
// Línea crítica:
const API_URL = 'http://192.168.100.24:8000/api';
//             ↑ Cambia 192.168.100.24 por tu IP actual si es necesario
```

**Cómo saber tu IP:**
```bash
# En Windows PowerShell:
ipconfig | Select-String "IPv4"
# Busca una IP como 192.168.x.x o 10.x.x.x
```

### Archivo: `backend/.env`

```
DB_HOST=127.0.0.1      # ← BD local
DB_PORT=3306           # ← Puerto MySQL estándar
DB_DATABASE=maferetc_db
DB_USERNAME=root       # ← Usuario MySQL
DB_PASSWORD=           # ← Contraseña (vacía si no tienes)
```

---

## 🔑 DATOS DE PRUEBA

Si necesitas crear un usuario manualmente para testing:

```bash
# En Terminal 1 (backend):
php artisan tinker

# En el tinker shell:
$user = User::create([
    'nombre' => 'Test User',
    'correo' => 'test@example.com',
    'password' => Hash::make('password123')
]);

exit
```

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **Backend no enciende** | "Could not open input file" | Usa ruta completa al artisan |
| **Puerto 8000 en uso** | "Address already in use" | Usa otro puerto (8001, 8002) |
| **BD no conecta** | "SQLSTATE[HY000]" | Verifica que MySQL corre, .env correcta |
| **Frontend no ve backend** | "Network request failed" | Verifica IP en apiConfig.js |
| **Token expirado** | "Unauthorized" después 1 hora | Toca logout y login nuevamente |
| **Datos no se guardan** | Crea pero no aparece en lista | Recarga la pantalla (swipe down) |
| **Soft delete no funciona** | Detecta deleted_at NULL | Verifica migración aplicada |

---

## ✅ CHECKLIST PRE-PRESENTACIÓN

- [ ] MySQL corre sin errores
- [ ] Backend inicia en puerto 8000
- [ ] Frontend conecta con backend
- [ ] apiConfig.js tiene IP correcta
- [ ] Usuario de prueba existe en BD
- [ ] Materias y tareas de prueba creadas (opcional)
- [ ] Dispositivo/emulador funciona
- [ ] Network conectado (no wifi lenta)
- [ ] Batería del dispositivo > 50%
- [ ] Documentación abierta (este archivo) para referencia

---

## 📞 COMANDO RÁPIDO DE EMERGENCIA

Si algo no funciona en el último momento:

```bash
# Reinicia TODO completamente:

# 1. Para todos los servidores (Ctrl+C en cada terminal)
# 2. Limpia cache Laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 3. Reinicia BD
mysql -u root -p -e "TRUNCATE TABLE usuarios;"
# ⚠️ Esto borra datos, solo si es emergencia

# 4. Reinicia frontend
npm start -- --reset-cache

# 5. Reinicia backend
php artisan serve --host=0.0.0.0 --port=8000
```

---

## 💡 TIPS ÚTILES

1. **Mantén estas terminales abiertas:**
   - Terminal 1: Backend
   - Terminal 2: Frontend
   - Terminal 3: Curl/tests (optional but helpful)
   - Terminal 4: MySQL (optional but recommended)

2. **Antes de cada demostración:** Dale un poco de tiempo al frontend para que conecte

3. **Si pierdes el QR de Expo:** Presiona `'a'` nuevamente para que lo muestre

4. **Guarda screenshots:** De tus materias/tareas creadas por si acaso

5. **Lleva contraseña anotada:** Por si se congela el app

