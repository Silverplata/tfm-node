// src/models/user.model.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async register({ username, email, password, first_name, last_name, age, num_tel, gender, image, role }) {
    try {
      // Validar el rol
      const validRoles = ['user', 'guide'];
      const userRole = validRoles.includes(role) ? role : 'user';

      // Encriptar la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Iniciar transacción
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Insertar usuario en la tabla users
        const [userResult] = await connection.query(
          'INSERT INTO users (username, email, password_hash, first_name, last_name, age, num_tel, gender, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [username, email, passwordHash, first_name, last_name, age, num_tel, gender, image || null]
        );

        const userId = userResult.insertId;

        // Insertar perfil con el rol
        const defaultPalette = JSON.stringify({
          primary: '#4682B4',
          secondary: '#708090',
          accent: '#FFD700',
          background: '#F5F5F5'
        });
        await connection.query(
          'INSERT INTO profiles (user_id, availability, role, color_palette) VALUES (?, ?, ?, ?)',
          [userId, null, userRole, defaultPalette]
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
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  },

  async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error al encontrar usuario por mail: ${error.message}`);
    }
  },

  async findByEmailWithRole(email) {
    try {
      let [rows] = await pool.query(
        'SELECT u.user_id, u.email, u.password_hash, p.role ' +
        'FROM users u LEFT JOIN profiles p ON u.user_id = p.user_id ' +
        'WHERE u.email = ?',
        [email]
      );
      if (rows[0] && !rows[0].role) {
        rows[0].role = 'user'; // Rol por defecto si falta el perfil
      }
      return rows[0];
    } catch (error) {
      throw new Error(`Error al encontrar usuario por rol: ${error.message}`);
    }
  }
};

module.exports = User;