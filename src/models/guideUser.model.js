const pool = require('../config/db');

const GuideUser = {
  async create({ guideId, userId }) {
    try {
      // Verificar que guideId y userId existan en la tabla users y que guideId tenga rol 'guide'
      const [guideRows] = await pool.query(
        'SELECT u.user_id FROM users u JOIN profiles p ON u.user_id = p.user_id WHERE u.user_id = ? AND p.role = ?',
        [guideId, 'guide']
      );
      const [userRows] = await pool.query(
        'SELECT user_id FROM users WHERE user_id = ?',
        [userId]
      );

      if (!guideRows[0]) {
        throw new Error('Guide not found or does not have guide role');
      }
      if (!userRows[0]) {
        throw new Error('User not found');
      }
      if (guideId === userId) {
        throw new Error('Guide and user cannot be the same');
      }

      // Insertar relación
      const [result] = await pool.query(
        'INSERT INTO guide_user (guide_id, user_id) VALUES (?, ?)',
        [guideId, userId]
      );

      return { guideUserId: result.insertId, guideId, userId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('This guide-user relationship already exists');
      }
      throw new Error(`Error creating guide-user relationship: ${error.message}`);
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
      throw new Error(`Error finding guide-user relationships: ${error.message}`);
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
      throw new Error(`Error finding guide-user relationships: ${error.message}`);
    }
  }
};

module.exports = GuideUser;