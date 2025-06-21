const pool = require('../config/db');

const GuideUser = {
  async create({ guideId, userId }) {
    try {
      // Verificar que userId existe
      const [userRows] = await pool.query(
        'SELECT user_id FROM users WHERE user_id = ?',
        [userId]
      );
      if (!userRows[0]) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que guideId existe y es un guía
      const [guideRows] = await pool.query(
        'SELECT u.user_id FROM users u JOIN profiles p ON u.user_id = p.user_id WHERE u.user_id = ? AND p.role = ?',
        [guideId, 'guide']
      );
      if (!guideRows[0]) {
        throw new Error('Guía no encontrado o no tiene rol de guía');
      }

      // Verificar que no son el mismo usuario
      if (guideId === userId) {
        throw new Error('Guía y usuario no pueden ser el mismo');
      }

      // Insertar relación
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
        'SELECT gu.guide_user_id, gu.guide_id, gu.user_id, gu.created_at, u.username, p.role ' +
        'FROM guide_user gu ' +
        'JOIN users u ON gu.user_id = u.user_id ' +
        'JOIN profiles p ON u.user_id = p.user_id ' +
        'WHERE gu.guide_id = ?',
        [guideId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al encontrar relaciones por guía: ${error.message}`);
    }
  },

  async findByUserId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT gu.guide_user_id, gu.guide_id, gu.user_id, gu.created_at, u.username, p.role ' +
        'FROM guide_user gu ' +
        'JOIN users u ON gu.guide_id = u.user_id ' +
        'JOIN profiles p ON u.user_id = p.user_id ' +
        'WHERE gu.user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al encontrar relaciones por usuario: ${error.message}`);
    }
  },

  async getAllRelations(userId, role) {
    try {
      let query;
      let values;

      if (role === 'guide') {
        query = `
          SELECT 
            gu.guide_user_id, gu.guide_id, gu.user_id, gu.created_at,
            ug.username AS guide_username, ug.first_name AS guide_first_name, ug.last_name AS guide_last_name,
            pg.role AS guide_role,
            uu.username AS user_username, uu.first_name AS user_first_name, uu.last_name AS user_last_name,
            pu.role AS user_role
          FROM guide_user gu
          JOIN users ug ON gu.guide_id = ug.user_id
          JOIN profiles pg ON ug.user_id = pg.user_id
          JOIN users uu ON gu.user_id = uu.user_id
          JOIN profiles pu ON uu.user_id = pu.user_id
          WHERE gu.guide_id = ?
        `;
        values = [userId];
      } else {
        query = `
          SELECT 
            gu.guide_user_id, gu.guide_id, gu.user_id, gu.created_at,
            ug.username AS guide_username, ug.first_name AS guide_first_name, ug.last_name AS guide_last_name,
            pg.role AS guide_role,
            uu.username AS user_username, uu.first_name AS user_first_name, uu.last_name AS user_last_name,
            pu.role AS user_role
          FROM guide_user gu
          JOIN users ug ON gu.guide_id = ug.user_id
          JOIN profiles pg ON ug.user_id = pg.user_id
          JOIN users uu ON gu.user_id = uu.user_id
          JOIN profiles pu ON uu.user_id = pu.user_id
          WHERE gu.user_id = ?
        `;
        values = [userId];
      }

      const [rows] = await pool.query(query, values);
      return rows.map(row => ({
        guide_user_id: row.guide_user_id,
        guide: {
          user_id: row.guide_id,
          username: row.guide_username,
          first_name: row.guide_first_name,
          last_name: row.guide_last_name,
          role: row.guide_role,
        },
        user: {
          user_id: row.user_id,
          username: row.user_username,
          first_name: row.user_first_name,
          last_name: row.user_last_name,
          role: row.user_role,
        },
        created_at: row.created_at,
      }));
    } catch (error) {
      throw new Error(`Error al obtener relaciones guía-usuario: ${error.message}`);
    }
  },

  async getRelationById(guideUserId, userId, role) {
    try {
      let query;
      let values;

      if (role === 'guide') {
        query = `
          SELECT 
            gu.guide_user_id, gu.guide_id, gu.user_id, gu.created_at,
            ug.username AS guide_username, ug.first_name AS guide_first_name, ug.last_name AS guide_last_name,
            pg.role AS guide_role,
            uu.username AS user_username, uu.first_name AS user_first_name, uu.last_name AS user_last_name,
            pu.role AS user_role
          FROM guide_user gu
          JOIN users ug ON gu.guide_id = ug.user_id
          JOIN profiles pg ON ug.user_id = pg.user_id
          JOIN users uu ON gu.user_id = uu.user_id
          JOIN profiles pu ON uu.user_id = pu.user_id
          WHERE gu.guide_user_id = ? AND gu.guide_id = ?
        `;
        values = [guideUserId, userId];
      } else {
        query = `
          SELECT 
            gu.guide_user_id, gu.guide_id, gu.user_id, gu.created_at,
            ug.username AS guide_username, ug.first_name AS guide_first_name, ug.last_name AS guide_last_name,
            pg.role AS guide_role,
            uu.username AS user_username, uu.first_name AS user_first_name, uu.last_name AS user_last_name,
            pu.role AS user_role
          FROM guide_user gu
          JOIN users ug ON gu.guide_id = ug.user_id
          JOIN profiles pg ON ug.user_id = pg.user_id
          JOIN users uu ON gu.user_id = uu.user_id
          JOIN profiles pu ON uu.user_id = pu.user_id
          WHERE gu.guide_user_id = ? AND gu.user_id = ?
        `;
        values = [guideUserId, userId];
      }

      const [rows] = await pool.query(query, values);
      if (rows.length === 0) {
        throw new Error('Relación no encontrada o no autorizada');
      }

      const row = rows[0];
      return {
        guide_user_id: row.guide_user_id,
        guide: {
          user_id: row.guide_id,
          username: row.guide_username,
          first_name: row.guide_first_name,
          last_name: row.guide_last_name,
          role: row.guide_role,
        },
        user: {
          user_id: row.user_id,
          username: row.user_username,
          first_name: row.user_first_name,
          last_name: row.user_last_name,
          role: row.user_role,
        },
        created_at: row.created_at,
      };
    } catch (error) {
      throw new Error(`Error al obtener la relación guía-usuario: ${error.message}`);
    }
  },

  async deleteRelation(guideUserId, userId, role) {
    try {
      let query;
      let values;

      if (role === 'guide') {
        query = 'DELETE FROM guide_user WHERE guide_user_id = ? AND guide_id = ?';
        values = [guideUserId, userId];
      } else {
        query = 'DELETE FROM guide_user WHERE guide_user_id = ? AND user_id = ?';
        values = [guideUserId, userId];
      }

      const [result] = await pool.query(query, values);
      if (result.affectedRows === 0) {
        throw new Error('Relación no encontrada o no autorizada');
      }
      return { guideUserId };
    } catch (error) {
      throw new Error(`Error al eliminar la relación guía-usuario: ${error.message}`);
    }
  },
};

module.exports = GuideUser;