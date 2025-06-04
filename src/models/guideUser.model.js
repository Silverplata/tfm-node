const pool = require('../config/db');

const GuideUser = {
  async create({ guideId, userId }) {
    try {
      const [userRows] = await pool.query(
        'SELECT user_id FROM users WHERE user_id = ?',
        [userId]
      );
      if (!userRows[0]) {
        throw new Error('Usuario no encontrado');
      }
      if (guideId === userId) {
        throw new Error('Guía y usuario no pueden ser el mismo');
      }
      const [result] = await pool.query(
        'INSERT INTO guide_user (guide_id, user_id) VALUES (?, ?)',
        [guideId, userId]
      );
      return { guideUserId: result.insertId, guideId, userId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Esta relación ya existe entre el guía y el usuario');
      }
      throw new Error(`Error al crear la relación guía-usuario: ${error.message}`);
    }
  },

  async findByGuideId(guideId) {
    try {
      const [rows] = await pool.query(
        'SELECT guide_user_id, guide_id, user_id, created_at FROM guide_user WHERE guide_id = ?',
        [guideId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error encontrando la relacion guia-usuario: ${error.message}`);
    }
  },

  async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT guide_user_id, guide_id, user_id, created_at FROM guide_user WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error encontrando la relacion guia-usuario: ${error.message}`);
    }
  }
};

module.exports = GuideUser;