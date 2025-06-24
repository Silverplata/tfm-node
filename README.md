# tfm-node

# 📘 API – Planificador de Rutinas Semanales

API RESTful para la autenticación de usuarios, gestión de perfiles, intereses, objetivos, rutinas y relaciones entre guías y usuarios. Diseñada para apoyar a personas con TDAH, TEA u otras neurodivergencias, ofreciendo herramientas claras y flexibles para la organización, personalización y seguimiento de metas.

**Versión:** 1.0.0  
**Base URL (desarrollo):** `http://localhost:3000/api`  
**Documentación Swagger:** `http://localhost:3000/api-docs`

---

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Silverplata/tfm-node.git
   cd tfm-node
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Crea un archivo `.env` en la raíz del proyecto.
   - Ejemplo:
     ```env
     PORT=3000
     JWT_SECRET=tu_secreto_jwt
     DB_HOST=localhost
     DB_USER=tu_usuario
     DB_PASSWORD=tu_contraseña
     DB_NAME=planificador_db
     ```

4. **Configurar la base de datos**:
   - Usa los scripts SQL proporcionados para crear las tablas `users`, `profiles`, `profile_interests`, `profile_goals`, `routines`, `activities`, `categories`, y `guide_user`.
   - Ejecuta:
     ```sql
     CREATE DATABASE planificador_db;
     ```

5. **Iniciar el servidor**:
   ```bash
   npm start
   # O para desarrollo con nodemon:
   npm run dev
   ```

---

## 🔐 Autenticación

### `POST /api/auth/register`

Registra un nuevo usuario o guía.

#### Request Body

```json
{
  "username": "carlos_t",
  "email": "carlos.torres@example.com",
  "password": "securepassword123",
  "first_name": "Carlos",
  "last_name": "Torres",
  "age": 30,
  "num_tel": "123456789",
  "gender": "Hombre",
  "image": "carlos.jpg",
  "role": "guide"
}
```

#### Responses

- `201 Created`: Usuario registrado correctamente.
  ```json
  {
    "message": "Usuario registrado satisfactoriamente",
    "user": {
      "userId": 6,
      "username": "carlos_t",
      "email": "carlos.torres@example.com",
      "role": "guide",
      "image": "carlos.jpg"
    }
  }
  ```

- `400 Bad Request`: Campos faltantes o inválidos (ej., número de teléfono no válido, edad menor a 14).
- `409 Conflict`: El correo ya está registrado.
- `500 Internal Server Error`: Error al registrar.

---

### `POST /api/auth/login`

Inicia sesión y devuelve un token JWT.

#### Request Body

```json
{
  "email": "carlos.torres@example.com",
  "password": "securepassword123"
}
```

#### Responses

- `200 OK`: Login exitoso.
  ```json
  {
    "message": "Login satisfactorio",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 6,
      "email": "carlos.torres@example.com",
      "role": "guide"
    }
  }
  ```

- `400 Bad Request`: Faltan email o contraseña.
- `401 Unauthorized`: Credenciales inválidas.
- `500 Internal Server Error`: Error del servidor.

---

## 🧑‍💼 Gestión de Perfiles

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/users/profile`

Obtiene los datos del perfil del usuario autenticado.

#### Responses

- `200 OK`: Perfil obtenido correctamente.
  ```json
  {
    "message": "Perfil obtenido correctamente",
    "profile": {
      "userId": 6,
      "username": "carlos_t",
      "email": "carlos.torres@example.com",
      "firstName": "Carlos",
      "lastName": "Torres",
      "age": 30,
      "numTel": "123456789",
      "gender": "Hombre",
      "image": "carlos.jpg",
      "availability": "Lunes a Viernes, 10:00-14:00",
      "role": "guide",
      "colorPalette": {
        "primary": "#4682B4",
        "secondary": "#708090",
        "accent": "#FFD700",
        "background": "#F5F5F5"
      }
    }
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `404 Not Found`: Usuario no encontrado.
- `500 Internal Server Error`: Error del servidor.

---

### `PUT /api/users/profile`

Actualiza los datos del perfil del usuario autenticado.

#### Request Body

```json
{
  "first_name": "Carlos Alberto",
  "num_tel": "987654321",
  "gender": "Hombre",
  "color_palette": {
    "primary": "#FF6F61",
    "secondary": "#4682B4"
  },
  "remove_image": false
}
```

#### Responses

- `200 OK`: Perfil actualizado correctamente.
  ```json
  {
    "message": "Perfil actualizado correctamente",
    "profile": {
      "userId": 6,
      "username": "carlos_t",
      "email": "carlos.torres@example.com",
      "firstName": "Carlos Alberto",
      "lastName": "Torres",
      "age": 30,
      "numTel": "987654321",
      "gender": "Hombre",
      "image": "carlos.jpg",
      "availability": "Lunes a Viernes, 10:00-14:00",
      "role": "guide",
      "colorPalette": {
        "primary": "#FF6F61",
        "secondary": "#4682B4"
      }
    }
  }
  ```

- `400 Bad Request`: Campos inválidos (ej., número de teléfono no tiene 9 dígitos, paleta de colores no válida).
- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `GET /api/users/interests`

Obtiene los intereses del usuario autenticado.

#### Responses

- `200 OK`: Intereses obtenidos correctamente.
  ```json
  {
    "message": "Intereses obtenidos correctamente",
    "interests": [
      {
        "interest_id": 1,
        "interest_name": "Coaching",
        "priority": "high",
        "created_at": "2025-06-16T12:00:00.000Z"
      }
    ]
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `POST /api/users/interests`

Añade un nuevo interés al usuario autenticado.

#### Request Body

```json
{
  "interest_name": "Mindfulness",
  "priority": "medium"
}
```

#### Responses

- `201 Created`: Interés añadido correctamente.
  ```json
  {
    "message": "Interés añadido correctamente",
    "interest": {
      "interest_id": 2,
      "profile_id": 6,
      "interest_name": "Mindfulness",
      "priority": "medium"
    }
  }
  ```

- `400 Bad Request`: Nombre del interés faltante o prioridad inválida.
- `401 Unauthorized`: Token faltante o inválido.
- `409 Conflict`: El interés ya está asociado.
- `500 Internal Server Error`: Error del servidor.

---

### `PUT /api/users/availability`

Actualiza la disponibilidad del guía autenticado.

#### Request Body

```json
{
  "availability": "Lunes a Viernes, 10:00-14:00"
}
```

#### Responses

- `200 OK`: Disponibilidad actualizada correctamente.
  ```json
  {
    "message": "Disponibilidad actualizada correctamente",
    "availability": {
      "userId": 6,
      "availability": "Lunes a Viernes, 10:00-14:00"
    }
  }
  ```

- `400 Bad Request`: Disponibilidad faltante.
- `401 Unauthorized`: Token faltante o inválido.
- `403 Forbidden`: Solo los guías pueden actualizar disponibilidad.
- `500 Internal Server Error`: Error del servidor.

---

## 🎯 Gestión de Objetivos

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/profile-goals`

Obtiene todos los objetivos del usuario autenticado.

#### Responses

- `200 OK`: Objetivos obtenidos correctamente.
  ```json
  {
    "message": "Objetivos obtenidos correctamente",
    "goals": [
      {
        "goalId": 1,
        "profileId": 1,
        "name": "Mejorar organización",
        "goalType": "Productividad",
        "description": "Crear listas de tareas diarias",
        "targetHoursWeekly": 5,
        "status": "active",
        "progress": 30,
        "deadline": "2025-07-15",
        "createdAt": "2025-06-16T12:00:00.000Z",
        "updatedAt": "2025-06-16T12:00:00.000Z"
      }
    ]
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `GET /api/profile-goals/:id`

Obtiene un objetivo específico por ID.

#### Request

```
GET /api/profile-goals/1
```

#### Responses

- `200 OK`: Objetivo obtenido correctamente.
  ```json
  {
    "message": "Objetivo obtenido correctamente",
    "goal": {
      "goalId": 1,
      "profileId": 1,
      "name": "Mejorar organización",
      "goalType": "Productividad",
      "description": "Crear listas de tareas diarias",
      "targetHoursWeekly": 5,
      "status": "active",
      "progress": 30,
      "deadline": "2025-07-15",
      "createdAt": "2025-06-16T12:00:00.000Z",
      "updatedAt": "2025-06-16T12:00:00.000Z"
    }
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `404 Not Found`: Objetivo no encontrado o no pertenece al usuario.
- `500 Internal Server Error`: Error del servidor.

---

### `POST /api/profile-goals`

Crea un nuevo objetivo para el usuario autenticado.

#### Request Body

```json
{
  "name": "Leer un libro",
  "goal_type": "Aprendizaje",
  "description": "Leer 20 páginas al día",
  "target_hours_weekly": 4,
  "status": "active",
  "progress": 0,
  "deadline": "2025-08-01"
}
```

#### Responses

- `201 Created`: Objetivo creado correctamente.
  ```json
  {
    "message": "Objetivo creado correctamente",
    "goal": {
      "goalId": 2,
      "profileId": 1,
      "name": "Leer un libro",
      "goalType": "Aprendizaje",
      "description": "Leer 20 páginas al día",
      "targetHoursWeekly": 4,
      "status": "active",
      "progress": 0,
      "deadline": "2025-08-01",
      "createdAt": "2025-06-16T12:00:00.000Z",
      "updatedAt": "2025-06-16T12:00:00.000Z"
    }
  }
  ```

- `400 Bad Request`: Nombre faltante o datos inválidos (ej., progreso fuera de 0-100).
- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `PUT /api/profile-goals/:id`

Actualiza un objetivo existente.

#### Request

```
PUT /api/profile-goals/1
```

#### Request Body

```json
{
  "progress": 50,
  "status": "active",
  "deadline": "2025-07-20"
}
```

#### Responses

- `200 OK`: Objetivo actualizado correctamente.
  ```json
  {
    "message": "Objetivo actualizado correctamente",
    "goal": {
      "goalId": 1,
      "profileId": 1,
      "name": "Mejorar organización",
      "goalType": "Productividad",
      "description": "Crear listas de tareas diarias",
      "targetHoursWeekly": 5,
      "status": "active",
      "progress": 50,
      "deadline": "2025-07-20",
      "createdAt": "2025-06-16T12:00:00.000Z",
      "updatedAt": "2025-06-16T12:30:00.000Z"
    }
  }
  ```

- `400 Bad Request`: Sin campos para actualizar o datos inválidos.
- `401 Unauthorized`: Token faltante o inválido.
- `404 Not Found`: Objetivo no encontrado o no pertenece al usuario.
- `500 Internal Server Error`: Error del servidor.

---

### `DELETE /api/profile-goals/:id`

Elimina un objetivo existente.

#### Request

```
DELETE /api/profile-goals/1
```

#### Responses

- `200 OK`: Objetivo eliminado correctamente.
  ```json
  {
    "message": "Objetivo eliminado correctamente"
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `404 Not Found`: Objetivo no encontrado o no pertenece al usuario.
- `500 Internal Server Error`: Error del servidor.

---

## 📅 Gestión de Rutinas

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/routines`

Obtiene todas las rutinas del usuario autenticado (o de sus usuarios asignados si es guía).

#### Responses

- `200 OK`: Rutinas obtenidas correctamente.
  ```json
  {
    "message": "Rutinas obtenidas correctamente",
    "routines": [
      {
        "routine_id": 1,
        "user_id": 1,
        "name": "Rutina matutina",
        "description": "Actividades para empezar el día",
        "is_template": false,
        "created_at": "2025-06-16T12:00:00.000Z",
        "updated_at": "2025-06-16T12:00:00.000Z",
        "start_time": "08:00:00",
        "end_time": "12:00:00",
        "daily_routine": true,
        "activities": [
          {
            "activity_id": 1,
            "activity_name": "Desayuno",
            "description": "Tomar un desayuno equilibrado",
            "day_of_week": "Lunes",
            "start_time": "08:00:00",
            "end_time": "08:30:00",
            "location": "Cocina",
            "datetime_start": "2025-06-16T08:00:00.000Z",
            "datetime_end": "2025-06-16T08:30:00.000Z",
            "icon": "spoon",
            "category": {
              "name": "Alimentación",
              "color": "#FF6347"
            }
          }
        ]
      }
    ]
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `GET /api/routines/:id`

Obtiene una rutina específica por ID.

#### Request

```
GET /api/routines/1
```

#### Responses

- `200 OK`: Rutina obtenida correctamente.
  ```json
  {
    "message": "Rutina obtenida correctamente",
    "routine": {
      "routine_id": 1,
      "user_id": 1,
      "name": "Rutina matutina",
      "description": "Actividades para empezar el día",
      "is_template": false,
      "created_at": "2025-06-16T12:00:00.000Z",
      "updated_at": "2025-06-16T12:00:00.000Z",
      "start_time": "08:00:00",
      "end_time": "12:00:00",
      "daily_routine": true,
      "activities": [
        {
          "activity_id": 1,
          "activity_name": "Desayuno",
          "description": "Tomar un desayuno equilibrado",
          "day_of_week": "Lunes",
          "start_time": "08:00:00",
          "end_time": "08:30:00",
          "location": "Cocina",
          "datetime_start": "2025-06-16T08:00:00.000Z",
          "datetime_end": "2025-06-16T08:30:00.000Z",
          "icon": "spoon",
          "category": {
            "name": "Alimentación",
            "color": "#FF6347"
          }
        }
      ]
    }
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `404 Not Found`: Rutina no encontrada o no autorizada.
- `500 Internal Server Error`: Error del servidor.

---

## 👥 Relación Guía–Usuario

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `POST /api/guide-user`

Permite a un guía vincularse con un usuario.

#### Request Body

```json
{
  "guideId": 6,
  "userId": 5
}
```

#### Responses

- `201 Created`: Relación guía-usuario creada.
  ```json
  {
    "message": "Relación guía-usuario creada correctamente",
    "relation": {
      "guideUserId": 6,
      "guideId": 6,
      "userId": 5
    }
  }
  ```

- `400 Bad Request`: Faltan `guideId` o `userId`.
- `401 Unauthorized`: Token faltante o inválido.
- `403 Forbidden`: Solo guías pueden crear relaciones, o `guideId` no coincide con el usuario autenticado.
- `404 Not Found`: Guía o usuario no encontrado.
- `409 Conflict`: Relación ya existe.
- `500 Internal Server Error`: Error del servidor.

---

### `GET /api/guide-user`

Obtiene todas las relaciones guía-usuario asociadas al usuario autenticado (como guía o usuario).

#### Responses

- `200 OK`: Relaciones obtenidas correctamente.
  ```json
  {
    "message": "Relaciones guía-usuario obtenidas correctamente",
    "relations": [
      {
        "guide_user_id": 1,
        "guide": {
          "user_id": 6,
          "username": "carlos_t",
          "first_name": "Carlos",
          "last_name": "Torres",
          "role": "guide"
        },
        "user": {
          "user_id": 1,
          "username": "maria_g",
          "first_name": "María",
          "last_name": "Gómez",
          "role": "user"
        },
        "created_at": "2025-06-05T00:00:00.000Z"
      }
    ]
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `GET /api/guide-user/:guideUserId`

Obtiene los detalles de una relación guía-usuario específica por su ID.

#### Request

```
GET /api/guide-user/1
```

#### Responses

- `200 OK`: Relación obtenida correctamente.
  ```json
  {
    "message": "Relación guía-usuario obtenida correctamente",
    "relation": {
      "guide_user_id": 1,
      "guide": {
        "user_id": 6,
        "username": "carlos_t",
        "first_name": "Carlos",
        "last_name": "Torres",
        "role": "guide"
      },
      "user": {
        "user_id": 1,
        "username": "maria_g",
        "first_name": "María",
        "last_name": "Gómez",
        "role": "user"
      },
      "created_at": "2025-06-05T00:00:00.000Z"
    }
  }
  ```

- `400 Bad Request`: ID inválido (no numérico).
- `401 Unauthorized`: Token faltante o inválido.
- `403 Forbidden`: Relación no encontrada o no autorizada.
- `500 Internal Server Error`: Error del servidor.

---

### `DELETE /api/guide-user/:guideUserId`

Elimina una relación guía-usuario específica por su ID.

#### Request

```
DELETE /api/guide-user/1
```

#### Responses

- `200 OK`: Relación eliminada correctamente.
  ```json
  {
    "message": "Relación guía-usuario eliminada correctamente",
    "guideUserId": 1
  }
  ```

- `400 Bad Request`: ID inválido (no numérico).
- `401 Unauthorized`: Token faltante o inválido.
- `403 Forbidden`: Relación no encontrada o no autorizada.
- `500 Internal Server Error`: Error del servidor.

---

## 🔒 Seguridad

La API usa autenticación **Bearer Token (JWT)** para endpoints protegidos.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Token**: Obtenido vía `POST /api/auth/login`.
- **Expiración**: 5 horas.
- **Validación**: Requerida para endpoints `/users`, `/profile-goals`, `/routines`, y `/guide-user`.

---

## 📚 Documentación Adicional

- **Swagger UI**: Explora todos los endpoints en `http://localhost:3000/api-docs`.
- **Peticiones de Prueba**: Usa el archivo `peticiones.rest` para probar los endpoints con herramientas como REST Client (VS Code) o Postman.
- **Base de Datos**: Estructura definida en scripts SQL para tablas `users`, `profiles`, `profile_interests`, `profile_goals`, `routines`, `activities`, `categories`, y `guide_user`.
- **Pruebas**:
  - Autentica un guía (ej., Carlos, `user_id: 6`) o usuario (ej., María, `user_id: 1`) con `POST /api/auth/login`.
  - Usa el token para probar endpoints protegidos.
  - Verifica cambios en MySQL (ej., `SELECT * FROM guide_user;`).

---

## 🌟 Características para Neurodivergencia

- **Respuestas Claras**: Mensajes descriptivos y estructurados (ej., "Relación guía-usuario creada correctamente") para reducir confusión.
- **Personalización**: Soporte para `color_palette` en perfiles, permitiendo interfaces visuales adaptadas a necesidades sensoriales.
- **Organización**: Rutinas y objetivos con campos como `progress`, `status`, y `start_time` para un seguimiento visual claro.
- **Flexibilidad**: Los usuarios pueden pausar/cancelar objetivos (`PUT /api/profile-goals/:id`) o eliminar relaciones guía-usuario (`DELETE /api/guide-user/:guideUserId`), apoyando la adaptabilidad.
- **Estructura**: Relaciones guía-usuario accesibles en una sola llamada (`GET /api/guide-user`), minimizando la carga cognitiva para usuarios con TDAH.
- **Seguridad**: Verificaciones de permisos aseguran que solo los involucrados accedan/modifiquen datos, creando un entorno confiable para usuarios con TEA.

---

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express
- **Base de Datos**: MySQL
- **Autenticación**: JSON Web Tokens (JWT), bcryptjs
- **Documentación**: Swagger
- **Almacenamiento de Imágenes**: Cloudinary (opcional)
- **Otras Dependencias**: cors, dotenv, multer, nodemon

---

## 📝 Notas para Desarrolladores

- **Errores Comunes**:
  - **401 Unauthorized**: Verifica que el token sea válido y no haya expirado.
  - **403 Forbidden**: Asegúrate de que el usuario tiene el rol correcto (ej., `guide` para `POST /api/guide-user`).
  - **409 Conflict**: Revisa duplicados en `email` (`POST /api/auth/register`) o relaciones (`POST /api/guide-user`).
  - **Header name must be a valid HTTP token**: Si usas REST Client, revisa espacios/caracteres invisibles en `peticiones.rest`. Usa Postman o curl como alternativa:
    ```bash
    curl -X POST http://localhost:3000/api/guide-user \
      -H "Authorization: Bearer <tu-token>" \
      -H "Content-Type: application/json" \
      -d '{"guideId": 6, "userId": 5}'
    ```

- **Depuración**:
  - Añade logs en `checkToken` para inspeccionar encabezados:
    ```javascript
    console.log('Headers received:', req.headers);
    ```
  - Verifica la base de datos con consultas SQL (ej., `SELECT * FROM guide_user;`).
  - Usa `peticiones.rest` limpio para evitar errores de formato:
    ```rest
    @host = http://localhost:3000
    @token = <tu-token>
    POST {{host}}/api/guide-user
    Authorization: Bearer {{token}}
    Content-Type: application/json
    {
      "guideId": 6,
      "userId": 5
    }
    ```