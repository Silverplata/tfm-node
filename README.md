# tfm-node

# 📘 API – Planificador de Rutinas Semanales

API RESTful para autenticación de usuarios y gestión de relaciones entre guías y usuarios.

**Versión:** 1.0.0
**Base URL (desarrollo):** `http://localhost:3000/api`

---

## 🔐 Autenticación

### `POST /auth/register`

Registra un nuevo usuario o guía.

#### Request Body

```json
{
  "message": "Usuario registrado satisfactoriamente",
  "user": {
    "userId": 1,
    "username": "alumno1",
    "email": "alumno1@gmail.com",
    "role": "user"
  }
}
```

#### Responses

* `201 Created`: Usuario registrado correctamente.
* `400 Bad Request`: Campos faltantes o inválidos.
* `409 Conflict`: El correo ya está registrado.
* `500 Internal Server Error`: Error al registrar el usuario.

---

### `POST /auth/login`

Inicia sesión y devuelve un token JWT.

#### Request Body

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

#### Responses

* `200 OK`: Devuelve token JWT y datos del usuario.

  ```json
  {
    "message": "Login satisfactorio",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 2,
      "email": "alumno2@gmail.com",
      "role": "guide"
    }
  } 
  ```

* `400 Bad Request`: Faltan campos requeridos.

* `401 Unauthorized`: Credenciales inválidas.

* `500 Internal Server Error`: Error del servidor.

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

* `201 Created`: Relación guía-usuario creada.
* `400 Bad Request`: Datos faltantes o inválidos.
* `401 Unauthorized`: Token faltante o inválido.
* `403 Forbidden`: Solo los guías pueden realizar esta acción.
* `409 Conflict`: Relación ya existente.
* `500 Internal Server Error`: Error del servidor.


  {
    "message": "Relación guía-usuario creada correctamente",
    "relation": {
      "guideUserId": 1,
      "guideId": 2,
      "userId": 1
    }
  }
---

## 🔒 Seguridad

Este API usa autenticación tipo **Bearer Token (JWT)** en los endpoints protegidos.

```http
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

