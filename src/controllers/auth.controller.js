const User = require('../models/user.model');

const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password, role } = req.body;

      // Validaciones básicas
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password son requeridas' });
      }

      // Verificar si el email ya está registrado
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Username, email, and password son requerida' });
      }

      // Crear usuario
      const newUser = await User.register({ username, email, password, role });

      // Respuesta exitosa
      res.status(201).json({
        message: 'User registered successfully',
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
  }
};

module.exports = authController;