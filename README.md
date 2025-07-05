
# tfm-node

# 📘 API – Planificador de Rutinas Semanales

API RESTful para la autenticación de usuarios, gestión de perfiles, intereses, objetivos, rutinas, actividades, categorías y relaciones entre guías y usuarios. Diseñada para apoyar a personas con TDAH, TEA u otras neurodivergencias, ofreciendo herramientas claras y flexibles para la organización, personalización y seguimiento de metas.

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

2. **Instalar dependencias con angular v20**:
   ```bash
   npm install
   ```
   **Instalar dependencias con angular v19**:
   ```bash
   npm install --legacy-peer-deps
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
     CLOUDINARY_CLOUD_NAME=repositorio imagenes cloud
     CLOUDINARY_API_KEY=api
     CLOUDINARY_API_SECRET=tu_secreto_cloud
     EMAIL_USER = 'correo_destinatario'
     EMAIL_PASS= contraseña_correo
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

* `201 Created`: Usuario registrado correctamente.

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

* `400 Bad Request`: Campos faltantes o inválidos (ej., número de teléfono no válido, edad menor a 14).
* `409 Conflict`: El correo ya está registrado.
* `500 Internal Server Error`: Error al registrar.

-----

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

* `200 OK`: Login exitoso.

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

* `400 Bad Request`: Faltan email o contraseña.
* `401 Unauthorized`: Credenciales inválidas.
* `500 Internal Server Error`: Error del servidor.

-----

## 🧑‍💼 Gestión de Perfiles

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/users/profile`

Obtiene los datos del perfil del usuario autenticado.

#### Responses

* `200 OK`: Perfil obtenido correctamente.

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

* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Usuario no encontrado.
* `500 Internal Server Error`: Error del servidor.

-----

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

* `200 OK`: Perfil actualizado correctamente.

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

* `400 Bad Request`: Campos inválidos (ej., número de teléfono no tiene 9 dígitos, paleta de colores no válida).
* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/users/interests`

Obtiene los intereses del usuario autenticado.

#### Responses

* `200 OK`: Intereses obtenidos correctamente.

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

* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

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

* `201 Created`: Interés añadido correctamente.

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

* `400 Bad Request`: Nombre del interés faltante o prioridad inválida.
* `401 Unauthorized`: Token faltante o inválido.
* `409 Conflict`: El interés ya está asociado.
* `500 Internal Server Error`: Error del servidor.

-----

### `PUT /api/users/availability`

Actualiza la disponibilidad del guía autenticado.

#### Request Body

```json
{
  "availability": "Lunes a Viernes, 10:00-14:00"
}
```

#### Responses

* `200 OK`: Disponibilidad actualizada correctamente.

  ```json
  {
    "message": "Disponibilidad actualizada correctamente",
    "availability": {
      "userId": 6,
      "availability": "Lunes a Viernes, 10:00-14:00"
    }
  }
  ```

* `400 Bad Request`: Disponibilidad faltante.
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo los guías pueden actualizar disponibilidad.
* `500 Internal Server Error`: Error del servidor.

-----

## 🎯 Gestión de Objetivos

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/profile-goals`

Obtiene todos los objetivos del usuario autenticado.

#### Responses

* `200 OK`: Objetivos obtenidos correctamente.

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

* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/profile-goals/:id`

Obtiene un objetivo específico por ID.

#### Request

```
GET /api/profile-goals/1
```

#### Responses

* `200 OK`: Objetivo obtenido correctamente.

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

* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Objetivo no encontrado o no pertenece al usuario.
* `500 Internal Server Error`: Error del servidor.

-----

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

* `201 Created`: Objetivo creado correctamente.

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

* `400 Bad Request`: Nombre faltante o datos inválidos (ej., progreso fuera de 0-100).
* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

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

* `200 OK`: Objetivo actualizado correctamente.

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

* `400 Bad Request`: Sin campos para actualizar o datos inválidos.
* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Objetivo no encontrado o no pertenece al usuario.
* `500 Internal Server Error`: Error del servidor.

-----

### `DELETE /api/profile-goals/:id`

Elimina un objetivo existente.

#### Request

```
DELETE /api/profile-goals/1
```

#### Responses

* `200 OK`: Objetivo eliminado correctamente.

  ```json
  {
    "message": "Objetivo eliminado correctamente"
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Objetivo no encontrado o no pertenece al usuario.
* `500 Internal Server Error`: Error del servidor.

-----

## 📅 Gestión de Rutinas

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/routines`

Obtiene todas las rutinas del usuario autenticado (o de sus usuarios asignados si es guía).

#### Responses

* `200 OK`: Rutinas obtenidas correctamente.

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
        "daily_routine": "Daily",
        "activities": [
          {
            "activity_id": 1,
            "activity_name": "Desayuno",
            "description": "Tomar un desayuno equilibrado",
            "day_of_week": null,
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

* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/routines/user/:userId`

Obtiene todas las rutinas de un usuario específico. Esto es útil para los guías que desean ver las rutinas de sus usuarios asignados.

#### Request

```
GET /api/routines/user/1
```

#### Responses

* `200 OK`: Rutinas obtenidas correctamente para el usuario especificado.

  ```json
  {
    "message": "Rutinas obtenidas correctamente para el usuario",
    "routines": [
      {
        "routine_id": 1,
        "user_id": 1,
        "name": "Rutina de Mañana",
        "description": "Actividades de inicio del día para el usuario",
        "is_template": false,
        "created_at": "2025-06-16T12:00:00.000Z",
        "updated_at": "2025-06-16T12:00:00.000Z",
        "start_time": "07:00:00",
        "end_time": "09:00:00",
        "daily_routine": "Daily",
        "activities": []
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: El usuario autenticado no está autorizado para ver las rutinas del `userId` especificado (ej., no es un guía asignado).
* `404 Not Found`: El `userId` no fue encontrado o no tiene rutinas.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/routines/:id`

Obtiene una rutina específica por ID.

#### Request

```
GET /api/routines/1
```

#### Responses

* `200 OK`: Rutina obtenida correctamente.

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
      "daily_routine": "Daily",
      "activities": [
        {
          "activity_id": 1,
          "activity_name": "Desayuno",
          "description": "Tomar un desayuno equilibrado",
          "day_of_week": null,
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

* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Rutina no encontrada o no autorizada.
* `500 Internal Server Error`: Error del servidor.

-----

### `POST /api/routines`

Crea una nueva rutina para el usuario autenticado o un usuario asignado (si es guía).

#### Request Body

```json
{
  "targetUserId": 5,
  "name": "Rutina matutina",
  "description": "Actividades para empezar el día organizado y enfocado",
  "is_template": false,
  "start_time": "2025-06-24T08:00:00Z",
  "end_time": "2025-06-24T10:00:00Z",
  "daily_routine": "Daily"
}
```

#### Responses

* `201 Created`: Rutina creada correctamente.

  ```json
  {
    "message": "Rutina creada correctamente",
    "routine": {
      "routine_id": 2,
      "user_id": 5,
      "name": "Rutina matutina",
      "description": "Actividades para empezar el día organizado y enfocado",
      "is_template": false,
      "created_at": "2025-06-24T00:00:00.000Z",
      "updated_at": "2025-06-24T00:00:00.000Z",
      "start_time": "2025-06-24T08:00:00.000Z",
      "end_time": "2025-06-24T10:00:00.000Z",
      "daily_routine": "Daily",
      "activities": []
    }
  }
  ```

* `400 Bad Request`: Campos faltantes o inválidos (ej., `daily_routine` no es "Daily", "Weekly" o "Monthly").
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo guías pueden crear rutinas para otros usuarios.
* `404 Not Found`: `targetUserId` no encontrado o no asignado al guía.
* `500 Internal Server Error`: Error del servidor.

-----

### `PUT /api/routines/:id`

Actualiza una rutina existente.

#### Request

```
PUT /api/routines/1
```

#### Request Body

```json
{
  "name": "Rutina matutina actualizada",
  "description": "Actividades optimizadas para empezar el día",
  "start_time": "2025-06-24T07:30:00Z",
  "end_time": "2025-06-24T09:30:00Z",
  "daily_routine": "Daily"
}
```

#### Responses

* `200 OK`: Rutina actualizada correctamente.

  ```json
  {
    "message": "Rutina actualizada correctamente",
    "routine": {
      "routine_id": 1,
      "user_id": 1,
      "name": "Rutina matutina actualizada",
      "description": "Actividades optimizadas para empezar el día",
      "is_template": false,
      "created_at": "2025-06-16T12:00:00.000Z",
      "updated_at": "2025-06-24T12:00:00.000Z",
      "start_time": "2025-06-24T07:30:00Z",
      "end_time": "2025-06-24T09:30:00Z",
      "daily_routine": "Daily",
      "activities": []
    }
  }
  ```

* `400 Bad Request`: Sin campos para actualizar o datos inválidos.
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Rutina no pertenece al usuario o no autorizada.
* `404 Not Found`: Rutina no encontrada.
* `500 Internal Server Error`: Error del servidor.

-----

### `DELETE /api/routines/:id`

Elimina una rutina existente.

#### Request

```
DELETE /api/routines/1
```

#### Responses

* `200 OK`: Rutina eliminada correctamente.

  ```json
  {
    "message": "Rutina eliminada correctamente"
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Rutina no pertenece al usuario o no autorizada.
* `404 Not Found`: Rutina no encontrada.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/routines/public/templates`

Obtiene todas las rutinas marcadas como plantillas públicas.

#### Responses

* `200 OK`: Plantillas públicas obtenidas correctamente.

  ```json
  {
    "message": "Plantillas públicas obtenidas correctamente",
    "templates": [
      {
        "routine_id": 3,
        "user_id": 6,
        "name": "Plantilla de Mañana Productiva",
        "description": "Una rutina general para un inicio de día productivo.",
        "is_template": true,
        "created_at": "2025-06-20T00:00:00.000Z",
        "updated_at": "2025-06-20T00:00:00.000Z",
        "start_time": "07:00:00",
        "end_time": "09:00:00",
        "daily_routine": "Daily",
        "activities": []
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

### `POST /api/routines/create-from-template`

Crea una nueva rutina para el usuario autenticado a partir de una plantilla pública.

#### Request Body

```json
{
  "templateId": 3,
  "name": "Mi Rutina de Mañana Personalizada",
  "description": "Adaptación de la plantilla para mis necesidades diarias",
  "start_time": "2025-07-01T07:30:00Z",
  "end_time": "2025-07-01T09:30:00Z"
}
```

#### Responses

* `201 Created`: Rutina creada a partir de la plantilla.

  ```json
  {
    "message": "Rutina creada a partir de la plantilla correctamente",
    "routine": {
      "routine_id": 4,
      "user_id": 1,
      "name": "Mi Rutina de Mañana Personalizada",
      "description": "Adaptación de la plantilla para mis necesidades diarias",
      "is_template": false,
      "created_at": "2025-07-01T00:00:00.000Z",
      "updated_at": "2025-07-01T00:00:00.000Z",
      "start_time": "2025-07-01T07:30:00.000Z",
      "end_time": "2025-07-01T09:30:00.000Z",
      "daily_routine": "Daily",
      "activities": [
        {
          "activity_id": 5,
          "title": "Actividad de Plantilla 1",
          "description": "Descripción de la actividad de plantilla",
          "start_time": "07:30:00",
          "end_time": "08:00:00",
          "icon": "sun",
          "category_name": "Bienestar"
        }
      ]
    }
  }
  ```

* `400 Bad Request`: `templateId` o campos de rutina faltantes/inválidos.
* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Plantilla no encontrada.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/routines/shared/by-me`

Obtiene las rutinas que el usuario autenticado (guía) ha compartido con otros usuarios.

#### Responses

* `200 OK`: Rutinas compartidas obtenidas correctamente.

  ```json
  {
    "message": "Rutinas compartidas por el usuario guía obtenidas correctamente",
    "sharedRoutines": [
      {
        "routine_id": 2,
        "user_id": 6,
        "name": "Rutina de Estudio",
        "description": "Rutina para mejorar la concentración en el estudio",
        "is_template": false,
        "shared_with_user_id": 5,
        "shared_with_username": "usuario_ejemplo"
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo los guías pueden acceder a esta ruta.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/routines/shared/received`

Obtiene las rutinas que el usuario autenticado (no guía) ha recibido de guías.

#### Responses

* `200 OK`: Rutinas recibidas obtenidas correctamente.

  ```json
  {
    "message": "Rutinas recibidas por el usuario obtenidas correctamente",
    "receivedRoutines": [
      {
        "routine_id": 2,
        "user_id": 5,
        "name": "Rutina de Estudio",
        "description": "Rutina para mejorar la concentración en el estudio",
        "is_template": false,
        "shared_by_guide_id": 6,
        "shared_by_guide_username": "carlos_t"
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo los usuarios pueden acceder a esta ruta.
* `500 Internal Server Error`: Error del servidor.

-----

## 🛠️ Gestión de Actividades

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/activities`

Obtiene todas las actividades del usuario autenticado (o de sus usuarios asignados si es guía).

#### Responses

* `200 OK`: Actividades obtenidas correctamente.

  ```json
  {
    "message": "Actividades obtenidas correctamente",
    "activities": [
      {
        "activity_id": 1,
        "routine_id": 1,
        "category_id": 1,
        "title": "Hacer lista de tareas",
        "description": "Escribir 3 tareas prioritarias del día en una libreta",
        "day_of_week": null,
        "start_time": "08:00:00",
        "end_time": "08:15:00",
        "location": null,
        "datetime_start": null,
        "datetime_end": null,
        "created_at": "2025-06-24T00:00:00.000Z",
        "updated_at": "2025-06-24T00:00:00.000Z",
        "icon": "list",
        "routine_name": "Rutina matutina",
        "category_name": "Productividad",
        "category_color": "#4682B4"
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/activities/:activityId`

Obtiene una actividad específica por ID.

#### Request

```
GET /api/activities/1
```

#### Responses

* `200 OK`: Actividad obtenida correctamente.

  ```json
  {
    "message": "Actividad obtenida correctamente",
    "activity": {
      "activity_id": 1,
      "routine_id": 1,
      "category_id": 1,
      "title": "Hacer lista de tareas",
      "description": "Escribir 3 tareas prioritarias del día en una libreta",
      "day_of_week": null,
      "start_time": "08:00:00",
      "end_time": "08:15:00",
      "location": null,
      "datetime_start": null,
      "datetime_end": null,
      "created_at": "2025-06-24T00:00:00.000Z",
      "updated_at": "2025-06-24T00:00:00.000Z",
      "icon": "list",
      "routine_name": "Rutina matutina",
      "category_name": "Productividad",
      "category_color": "#4682B4"
    }
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Actividad no encontrada o no autorizada.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/activities/routine/:routineId`

Obtiene todas las actividades asociadas a una rutina específica.

#### Request

```
GET /api/activities/routine/1
```

#### Responses

* `200 OK`: Actividades obtenidas correctamente para la rutina.

  ```json
  {
    "message": "Actividades de la rutina obtenidas correctamente",
    "activities": [
      {
        "activity_id": 1,
        "routine_id": 1,
        "category_id": 1,
        "title": "Desayuno",
        "description": "Tomar un desayuno equilibrado",
        "start_time": "08:00:00",
        "end_time": "08:30:00",
        "icon": "spoon",
        "category_name": "Alimentación"
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: La rutina no pertenece al usuario autenticado o no está autorizado.
* `404 Not Found`: Rutina no encontrada o sin actividades.
* `500 Internal Server Error`: Error del servidor.

-----

### `POST /api/activities`

Crea una nueva actividad dentro de una rutina.

#### Request Body

```json
{
  "routine_id": 1,
  "category_id": 1,
  "title": "Hacer lista de tareas",
  "description": "Escribir 3 tareas prioritarias del día en una libreta",
  "day_of_week": null,
  "start_time": "08:00:00",
  "end_time": "08:15:00",
  "icon": "list"
}
```

#### Responses

* `201 Created`: Actividad creada correctamente.

  ```json
  {
    "message": "Actividad creada correctamente",
    "activity": {
      "activity_id": 1,
      "routine_id": 1,
      "category_id": 1,
      "title": "Hacer lista de tareas",
      "description": "Escribir 3 tareas prioritarias del día en una libreta",
      "day_of_week": null,
      "start_time": "08:00:00",
      "end_time": "08:15:00",
      "location": null,
      "datetime_start": null,
      "datetime_end": null,
      "created_at": "2025-06-24T00:00:00.000Z",
      "updated_at": "2025-06-24T00:00:00.000Z",
      "icon": "list",
      "routine_name": "Rutina matutina",
      "category_name": "Productividad",
      "category_color": "#4682B4"
    }
  }
  ```

* `400 Bad Request`: Campos faltantes o inválidos (ej., `routine_id` no existe).
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Rutina no pertenece al usuario o no autorizada.
* `404 Not Found`: `routine_id` o `category_id` no encontrados.
* `500 Internal Server Error`: Error del servidor.

-----

### `PUT /api/activities/:activityId`

Actualiza una actividad existente.

#### Request

```
PUT /api/activities/1
```

#### Request Body

```json
{
  "title": "Hacer lista de tareas",
  "description": "Tarea completada: 3 prioridades definidas"
}
```

#### Responses

* `200 OK`: Actividad actualizada correctamente.

  ```json
  {
    "message": "Actividad actualizada correctamente",
    "activity": {
      "activity_id": 1,
      "routine_id": 1,
      "category_id": 1,
      "title": "Hacer lista de tareas",
      "description": "Tarea completada: 3 prioridades definidas",
      "day_of_week": null,
      "start_time": "08:00:00",
      "end_time": "08:15:00",
      "location": null,
      "datetime_start": null,
      "datetime_end": null,
      "created_at": "2025-06-24T00:00:00.000Z",
      "updated_at": "2025-06-24T12:00:00.000Z",
      "icon": "list",
      "routine_name": "Rutina matutina",
      "category_name": "Productividad",
      "category_color": "#4682B4"
    }
  }
  ```

* `400 Bad Request`: Sin campos para actualizar o datos inválidos.
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Actividad no pertenece al usuario o no autorizada.
* `404 Not Found`: Actividad no encontrada.
* `500 Internal Server Error`: Error del servidor.

-----

### `DELETE /api/activities/:activityId`

Elimina una actividad existente.

#### Request

```
DELETE /api/activities/1
```

#### Responses

* `200 OK`: Actividad eliminada correctamente.

  ```json
  {
    "message": "Actividad eliminada correctamente"
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Actividad no pertenece al usuario o no autorizada.
* `404 Not Found`: Actividad no encontrada.
* `500 Internal Server Error`: Error del servidor.

-----

## 🏷️ Gestión de Categorías

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /api/categories`

Obtiene todas las categorías disponibles (globales o creadas por guías).

#### Responses

* `200 OK`: Categorías obtenidas correctamente.

  ```json
  {
    "message": "Categorías obtenidas correctamente",
    "categories": [
      {
        "category_id": 1,
        "user_id": null,
        "name": "Productividad",
        "color": "#4682B4",
        "icon": "task",
        "description": "Tareas para mejorar la organización",
        "created_at": "2025-06-24T00:00:00.000Z"
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

### `POST /api/categories`

Crea una nueva categoría (solo guías).

#### Request Body

```json
{
  "name": "Productividad",
  "color": "#4682B4",
  "icon": "task",
  "description": "Tareas para mejorar la organización"
}
```

#### Responses

* `201 Created`: Categoría creada correctamente.

  ```json
  {
    "message": "Categoría creada correctamente",
    "category": {
      "category_id": 1,
      "user_id": 6,
      "name": "Productividad",
      "color": "#4682B4",
      "icon": "task",
      "description": "Tareas para mejorar la organización",
      "created_at": "2025-06-24T00:00:00.000Z"
    }
  }
  ```

* `400 Bad Request`: Campos faltantes o inválidos (ej., color no es un código hexadecimal).
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo guías pueden crear categorías.
* `500 Internal Server Error`: Error del servidor.

-----

## 👥 Relación Guía–Usuario

> Requiere autenticación con JWT en the header `Authorization: Bearer <token>`

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

* `201 Created`: Relación guía-usuario creada.

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

* `400 Bad Request`: Faltan `guideId` o `userId`.
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo guías pueden crear relaciones, o `guideId` no coincide con el usuario autenticado.
* `404 Not Found`: Guía o usuario no encontrado.
* `409 Conflict`: Relación ya existe.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/guide-user`

Obtiene todas las relaciones guía-usuario.

#### Responses

* `200 OK`: Relaciones obtenidas correctamente.

  ```json
  {
    "message": "Relaciones guía-usuario obtenidas correctamente",
    "relations": [
      {
        "guideUserId": 1,
        "guideId": 6,
        "userId": 5,
        "guideUsername": "carlos_t",
        "userUsername": "usuario_ejemplo"
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/guide-user/unassigned-users`

Obtiene todos los usuarios que aún no están asignados a un guía.

#### Responses

* `200 OK`: Usuarios no asignados obtenidos correctamente.

  ```json
  {
    "message": "Usuarios sin guía asignado obtenidos correctamente",
    "unassignedUsers": [
      {
        "userId": 7,
        "username": "nuevo_usuario",
        "email": "nuevo.usuario@example.com"
      }
    ]
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo los guías pueden acceder a esta ruta.
* `500 Internal Server Error`: Error del servidor.

-----

### `GET /api/guide-user/:guideUserId`

Obtiene una relación guía-usuario específica por ID.

#### Request

```
GET /api/guide-user/1
```

#### Responses

* `200 OK`: Relación obtenida correctamente.

  ```json
  {
    "message": "Relación guía-usuario obtenida correctamente",
    "relation": {
      "guideUserId": 1,
      "guideId": 6,
      "userId": 5,
      "guideUsername": "carlos_t",
      "userUsername": "usuario_ejemplo"
    }
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `404 Not Found`: Relación no encontrada o no autorizada.
* `500 Internal Server Error`: Error del servidor.

-----

### `DELETE /api/guide-user/:guideUserId`

Elimina una relación guía-usuario existente.

#### Request

```
DELETE /api/guide-user/1
```

#### Responses

* `200 OK`: Relación eliminada correctamente.

  ```json
  {
    "message": "Relación guía-usuario eliminada correctamente"
  }
  ```

* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: No autorizado para eliminar esta relación.
* `404 Not Found`: Relación no encontrada.
* `500 Internal Server Error`: Error del servidor.

-----

## 🔒 Seguridad

La API usa autenticación **Bearer Token (JWT)** para endpoints protegidos.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Token**: Obtenido vía `POST /api/auth/login`.
- **Expiración**: 5 horas.
- **Validación**: Requerida para endpoints `/users`, `/profile-goals`, `/routines`, `/activities`, `/categories`, y `/guide-user`.

---

## 📚 Documentación Adicional

- **Swagger UI**: Explora todos los endpoints en `http://localhost:3000/api-docs`.
- **Peticiones de Prueba**: Usa el archivo `peticiones.rest` para probar los endpoints con herramientas como REST Client (VS Code) o Postman.
- **Base de Datos**: Estructura definida en scripts SQL para tablas `users`, `profiles`, `profile_interests`, `profile_goals`, `routines`, `activities`, `categories`, y `guide_user`.
- **Pruebas**:
  - Autentica un guía (ej., Carlos, `user_id: 6`) o usuario (ej., María, `user_id: 1`) con `POST /api/auth/login`.
  - Usa el token para probar endpoints protegidos.
  - Verifica cambios en MySQL (ej., `SELECT * FROM guide_user;` or `SELECT * FROM activities;`).

---

## 🌟 Características para Neurodivergencia

- **Respuestas Claras**: Mensajes descriptivos y estructurados (ej., "Actividad creada correctamente") para reducir confusión.
- **Personalización**: Soporte para `color_palette` en perfiles y `color` en categorías, permitiendo interfaces visuales adaptadas a necesidades sensoriales.
- **Organización**: Rutinas y actividades con campos como `start_time`, `end_time`, y `progress` para un seguimiento visual claro.
- **Flexibilidad**: Los usuarios pueden pausar/cancelar objetivos (`PUT /api/profile-goals/:id`), eliminar rutinas (`DELETE /api/routines/:id`), o actividades (`DELETE /api/activities/:activityId`), apoyando la adaptabilidad.
- **Estructura**: Categorías y actividades accesibles en una sola llamada (`GET /api/categories`, `GET /api/activities`), minimizando la carga cognitiva para usuarios con TDAH.
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
  - **403 Forbidden**: Asegúrate de que el usuario tiene el rol correcto (ej., `guide` para `POST /api/categories`).
  - **409 Conflict**: Revisa duplicados en `email` (`POST /api/auth/register`), relaciones (`POST /api/guide-user`), o categorías (`POST /api/categories`).
  - **Header name must be a valid HTTP token**: Si usas REST Client, revisa espacios/caracteres invisibles en `peticiones.rest`. Usa Postman o curl como alternativa:
    ```bash
    curl -X POST http://localhost:3000/api/activities \
      -H "Authorization: Bearer <tu-token>" \
      -H "Content-Type: application/json" \
      -d '{"routine_id": 1, "category_id": 1, "title": "Hacer lista de tareas", "description": "Escribir 3 tareas prioritarias del día", "start_time": "08:00:00", "end_time": "08:15:00", "icon": "list"}'
    ```

- **Depuración**:
  - Añade logs en `checkToken` para inspeccionar encabezados:
    ```javascript
    console.log('Headers received:', req.headers);
    ```