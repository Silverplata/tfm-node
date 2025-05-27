const User = require('../models/user.model');

const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // Validaciones básicas
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      // Verificar si el email ya está registrado
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Crear usuario
      const newUser = await User.create({ username, email, password });

      // Respuesta exitosa
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          userId: newUser.userId,
          username: newUser.username,
          email: newUser.email
        }
      });
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  }
};

module.exports = authController;