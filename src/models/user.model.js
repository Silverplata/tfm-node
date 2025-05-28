const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async register({ username, email, password, role }) {
    try {
      // Validar el rol
      const validRoles = ['user', 'guide'];
      const userRole = validRoles.includes(role) ? role : 'user'; // Por defecto, 'user'

      // Encriptar la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Iniciar transacción
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Insertar usuario en la tabla users
        const [userResult] = await connection.query(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, passwordHash]
        );

        const userId = userResult.insertId;

        // Insertar perfil con el rol
        await connection.query(
          'INSERT INTO profiles (user_id, availability, role) VALUES (?, ?, ?)',
          [userId, null, userRole]
        );

        await connection.commit();
        return { userId, username, email, role: userRole };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  },

  async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  },

  async findByEmailWithRole(email) {
    try {
      const [rows] = await pool.query(
        'SELECT u.user_id, u.email, u.password_hash, p.role ' +
        'FROM users u ' +
        'JOIN profiles p ON u.user_id = p.user_id ' +
        'WHERE u.email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user with role: ${error.message}`);
    }
  }
};

module.exports = User;