const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - age
 *               - num_tel
 *               - gender
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: a1b2c3d6
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               age:
 *                 type: integer
 *                 example: 25
 *               num_tel:
 *                 type: string
 *                 pattern: '^\d{9}$'
 *                 example: 123456789
 *               gender:
 *                 type: string
 *                 enum: [Hombre, Mujer, Otro]
 *                 example: Hombre
 *               role:
 *                 type: string
 *                 enum: [user, guide]
 *                 example: user
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: profile.jpg
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Error en los datos proporcionados
 *       409:
 *         description: El correo ya está registrado
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name, age, num_tel, gender, image, role } = req.body;

    // Validaciones básicas
    if (!username || !email || !password || !first_name || !last_name || !age || !num_tel || !gender) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Validar formato
    if (!/^\d{9}$/.test(num_tel)) {
      return res.status(400).json({ message: 'Número de teléfono inválido' });
    }
    if (!['Hombre', 'Mujer', 'Otro'].includes(gender)) {
      return res.status(400).json({ message: 'Género inválido' });
    }
    if (age < 14) {
      return res.status(400).json({ message: 'Debes ser mayor de 14 años' });
    }

    // Verificar si el email ya está registrado
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    // Crear usuario
    const newUser = await User.register({ username, email, password, first_name, last_name, age, num_tel, gender, image, role });

    // Respuesta exitosa
    res.status(201).json({
      message: 'Usuario registrado satisfactoriamente',
      user: {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: a1b2c3d6
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Faltan email o password
 *       401:
 *         description: Credenciales inválidas
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son requeridos' });
    }

    // Buscar usuario con rol
    const user = await User.findByEmailWithRole(email);
    if (!user) {
      return res.status(401).json({ message: 'Email y password incorrectos' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email y password incorrectos' });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );

    // Respuesta exitosa
    res.status(200).json({
      message: 'Login satisfactorio',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };