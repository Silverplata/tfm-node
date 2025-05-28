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
  "username": "juan123",
  "email": "juan@example.com",
  "password": "123456",
  "role": "user" // o "guide"
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
    "message": "Inicio de sesión exitoso",
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "userId": 12,
      "email": "juan@example.com",
      "role": "user"
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

---

## 🔒 Seguridad

Este API usa autenticación tipo **Bearer Token (JWT)** en los endpoints protegidos.

```http
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

