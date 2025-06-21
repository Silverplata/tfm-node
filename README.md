# tfm-node

# 📘 API – Planificador de Rutinas Semanales

API RESTful para la autenticación de usuarios, gestión de perfiles, intereses, objetivos y relaciones entre guías y usuarios. Diseñada para apoyar a personas con TDAH, TEA u otras neurodivergencias, ofreciendo herramientas para la organización, personalización y seguimiento de metas.

**Versión:** 1.0.0  
**Base URL (desarrollo):** `http://localhost:3000/api`  
**Documentación Swagger:** `http://localhost:3000/api-docs`

---

## 🔐 Autenticación

### `POST /auth/register`

Registra un nuevo usuario o guía.

#### Request Body

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "age": 25,
  "num_tel": "123456789",
  "gender": "Hombre",
  "image": "profile.jpg",
  "role": "user"
}
```

#### Responses

- `201 Created`: Usuario registrado correctamente.

  ```json
  {
    "message": "Usuario registrado satisfactoriamente",
    "user": {
      "userId": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

- `400 Bad Request`: Campos faltantes o inválidos (ej., número de teléfono no válido, género incorrecto).
- `409 Conflict`: El correo ya está registrado.
- `500 Internal Server Error`: Error al registrar el usuario.

---

### `POST /auth/login`

Inicia sesión y devuelve un token JWT.

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Responses

- `200 OK`: Devuelve token JWT y datos del usuario.

  ```json
  {
    "message": "Login satisfactorio",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

- `400 Bad Request`: Faltan email o contraseña.
- `401 Unauthorized`: Credenciales inválidas.
- `500 Internal Server Error`: Error del servidor.

---

## 🧑‍💼 Gestión de Perfiles

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `GET /users/profile`

Obtiene los datos del perfil del usuario autenticado.

#### Responses

- `200 OK`: Perfil obtenido correctamente.

  ```json
  {
    "message": "Perfil obtenido correctamente",
    "profile": {
      "userId": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "age": 25,
      "numTel": "123456789",
      "gender": "Hombre",
      "image": "profile.jpg",
      "availability": null,
      "role": "user",
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

### `PUT /users/profile`

Actualiza los datos del perfil del usuario autenticado.

#### Request Body

```json
{
  "first_name": "Juan",
  "num_tel": "611223344",
  "gender": "Hombre",
  "color_palette": {
    "primary": "#FF6F61",
    "secondary": "#4682B4"
  }
}
```

#### Responses

- `200 OK`: Perfil actualizado correctamente.

  ```json
  {
    "message": "Perfil actualizado correctamente",
    "profile": {
      "userId": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "Juan",
      "lastName": "Doe",
      "age": 25,
      "numTel": "611223344",
      "gender": "Hombre",
      "image": "profile.jpg",
      "availability": null,
      "role": "user",
      "colorPalette": {
        "primary": "#FF6F61",
        "secondary": "#4682B4"
      }
    }
  }
  ```

- `400 Bad Request`: Campos inválidos (ej., número de teléfono no tiene 9 dígitos).
- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `GET /users/interests`

Obtiene los intereses del usuario autenticado.

#### Responses

- `200 OK`: Intereses obtenidos correctamente.

  ```json
  {
    "message": "Intereses obtenidos correctamente",
    "interests": [
      {
        "interest_id": 1,
        "interest_name": "Danza",
        "priority": "high",
        "created_at": "2025-06-16T12:00:00.000Z"
      }
    ]
  }
  ```

- `401 Unauthorized`: Token faltante o inválido.
- `500 Internal Server Error`: Error del servidor.

---

### `POST /users/interests`

Añade un nuevo interés al usuario autenticado.

#### Request Body

```json
{
  "interest_name": "Yoga",
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
      "profile_id": 1,
      "interest_name": "Yoga",
      "priority": "medium"
    }
  }
  ```

- `400 Bad Request`: Nombre del interés faltante o prioridad inválida.
- `401 Unauthorized`: Token faltante o inválido.
- `409 Conflict`: El interés ya está asociado.
- `500 Internal Server Error`: Error del servidor.

---

### `PUT /users/availability`

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
      "userId": 2,
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

### `GET /profile-goals`

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

### `GET /profile-goals/:id`

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

### `POST /profile-goals`

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

### `PUT /profile-goals/:id`

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

### `DELETE /profile-goals/:id`

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

## 👥 Relación Guía–Usuario

> Requiere autenticación con JWT en el header `Authorization: Bearer <token>`

### `POST /guide-user`

Permite a un guía vincularse con un usuario.

#### Request Body

```json
{
  "guideId": 5,
  "userId": 12
}
```

#### Responses

- `201 Created`: Relación guía-usuario creada.

  ```json
  {
    "message": "Relación guía-usuario creada correctamente",
    "relation": {
      "guideUserId": 1,
      "guideId": 5,
      "userId": 12
    }
  }
  ```

- `400 Bad Request`: Datos faltantes o inválidos.
- `401 Unauthorized`: Token faltante o inválido.
- `403 Forbidden`: Solo los guías pueden realizar esta acción.
- `409 Conflict`: Relación ya existente.
- `500 Internal Server Error`: Error del servidor.

---

## 🔒 Seguridad

La API usa autenticación **Bearer Token (JWT)** para endpoints protegidos.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Token**: Obtenido vía `POST /auth/login`.
- **Expiración**: 5 horas.
- **Validación**: Requerida para endpoints `/users`, `/profile-goals`, y `/guide-user`.

---

## 📚 Documentación Adicional

- **Swagger UI**: Explora todos los endpoints en `http://localhost:3000/api-docs`.
- **Peticiones de Prueba**: Usa el archivo `peticiones.rest` para probar los endpoints con herramientas como REST Client (VS Code).
- **Base de Datos**: Estructura definida en scripts SQL para tablas `users`, `profiles`, `profile_interests`, `profile_goals`, y `guide_user`.

---

## 🌟 Características para Neurodivergencia

- **Respuestas Claras**: Mensajes descriptivos (ej., "Objetivo creado correctamente") para reducir confusión.
- **Personalización**: Soporte para `color_palette` en perfiles, permitiendo interfaces adaptadas a necesidades sensoriales.
- **Organización**: Objetivos con `progress` y `status` para fomentar el seguimiento visual de metas.
- **Flexibilidad**: Los objetivos pueden pausarse o cancelarse, apoyando la adaptabilidad de usuarios con TDAH/TEA.