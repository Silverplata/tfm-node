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
  },

  async getProfile(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT u.user_id, u.username, u.email, u.first_name, u.last_name, u.age, u.num_tel, u.gender, u.image, 
                p.availability, p.role, p.color_palette
         FROM users u
         JOIN profiles p ON u.user_id = p.user_id
         WHERE u.user_id = ?`,
        [userId]
      );
      if (!rows[0]) {
        throw new Error('Usuario no encontrado');
      }
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener perfil: ${error.message}`);
    }
  },

  async updateProfile(userId, { first_name, last_name, num_tel, gender, color_palette }) {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Actualizar tabla users
        const updateFields = [];
        const updateValues = [];
        if (first_name) {
          updateFields.push('first_name = ?');
          updateValues.push(first_name);
        }
        if (last_name) {
          updateFields.push('last_name = ?');
          updateValues.push(last_name);
        }
        if (num_tel) {
          updateFields.push('num_tel = ?');
          updateValues.push(num_tel);
        }
        if (gender) {
          updateFields.push('gender = ?');
          updateValues.push(gender);
        }
        if (updateFields.length > 0) {
          updateValues.push(userId);
          await connection.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
            updateValues
          );
        }

        // Actualizar tabla profiles (color_palette)
        if (color_palette) {
          await connection.query(
            'UPDATE profiles SET color_palette = ? WHERE user_id = ?',
            [JSON.stringify(color_palette), userId]
          );
        }

        await connection.commit();
        return await this.getProfile(userId);
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw new Error(`Error al actualizar perfil: ${error.message}`);
    }
  },

  async getInterests(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT pi.interest_id, pi.interest_name, pi.priority, pi.created_at
         FROM profile_interests pi
         JOIN profiles p ON pi.profile_id = p.profile_id
         WHERE p.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener intereses: ${error.message}`);
    }
  },

  async addInterest(userId, { interest_name, priority }) {
    try {
      // Obtener profile_id
      const [profileRows] = await pool.query(
        'SELECT profile_id FROM profiles WHERE user_id = ?',
        [userId]
      );
      if (!profileRows[0]) {
        throw new Error('Perfil no encontrado');
      }
      const profileId = profileRows[0].profile_id;

      // Insertar interés
      const [result] = await pool.query(
        'INSERT INTO profile_interests (profile_id, interest_name, priority) VALUES (?, ?, ?)',
        [profileId, interest_name, priority || 'medium']
      );
      return { interest_id: result.insertId, profile_id: profileId, interest_name, priority: priority || 'medium' };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('El interés ya está asociado al usuario');
      }
      throw new Error(`Error al añadir interés: ${error.message}`);
    }
  },

  async updateAvailability(userId, availability) {
    try {
      const [profileRows] = await pool.query(
        'SELECT profile_id, role FROM profiles WHERE user_id = ?',
        [userId]
      );
      if (!profileRows[0]) {
        throw new Error('Perfil no encontrado');
      }
      if (profileRows[0].role !== 'guide') {
        throw new Error('Solo los guías pueden actualizar su disponibilidad');
      }

      await pool.query(
        'UPDATE profiles SET availability = ? WHERE user_id = ?',
        [availability, userId]
      );
      return { userId, availability };
    } catch (error) {
      throw new Error(`Error al actualizar disponibilidad: ${error.message}`);
    }
  },
};

module.exports = User;