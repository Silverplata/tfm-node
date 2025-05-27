const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create({ username, email, password }) {
    try {
      // Encriptar la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Iniciar transacción para crear usuario y perfil
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Insertar usuario en la tabla users
        const [userResult] = await connection.query(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, passwordHash]
        );

        const userId = userResult.insertId;

        // Insertar perfil asociado en la tabla profiles (con availability opcional)
        await connection.query(
          'INSERT INTO profiles (user_id, availability) VALUES (?, ?)',
          [userId, null] // Puedes ajustar availability según tus necesidades
        );

        await connection.commit();
        return { userId, username, email };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }
};

module.exports = User;