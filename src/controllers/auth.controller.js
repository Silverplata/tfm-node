const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password, role } = req.body;

      // Validaciones básicas
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Usuario, Email and password son requeridos' });
      }

      // Verificar si el email ya está registrado
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email ya registrado' });
      }

      // Crear usuario
      const newUser = await User.register({ username, email, password, role });

      // Respuesta exitosa
      res.status(201).json({
        message: 'Userio registrado satisfactoriamente',
        user: {
          userId: newUser.userId,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password son requeridos' });
      }

      // Buscar usuario con rol
      const user = await User.findByEmailWithRole(email);
      if (!user) {
        return res.status(401).json({ message: 'Email and password son requeridos' });
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email and password son requeridos' });
      }

      // Generar JWT
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expira en 1 hora
      );

      // Respuesta exitosa
      res.status(200).json({
        message: 'Login satisfactorio',
        token,
        user: {
          userId: user.user_id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;