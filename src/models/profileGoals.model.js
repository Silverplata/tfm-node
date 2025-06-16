const pool = require('../config/db');

const ProfileGoal = {
  async getAllByUserId(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT pg.goal_id, pg.profile_id, pg.name, pg.goal_type, pg.description, 
                pg.target_hours_weekly, pg.status, pg.progress, pg.deadline, 
                pg.created_at, pg.updated_at
         FROM profile_goals pg
         JOIN profiles p ON pg.profile_id = p.profile_id
         WHERE p.user_id = ?`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener objetivos: ${error.message}`);
    }
  },

  async getById(goalId, userId) {
    try {
      const [rows] = await pool.query(
        `SELECT pg.goal_id, pg.profile_id, pg.name, pg.goal_type, pg.description, 
                pg.target_hours_weekly, pg.status, pg.progress, pg.deadline, 
                pg.created_at, pg.updated_at
         FROM profile_goals pg
         JOIN profiles p ON pg.profile_id = p.profile_id
         WHERE pg.goal_id = ? AND p.user_id = ?`,
        [goalId, userId]
      );
      if (!rows[0]) {
        throw new Error('Objetivo no encontrado o no pertenece al usuario');
      }
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener objetivo: ${error.message}`);
    }
  },

  async create(userId, { name, goal_type, description, target_hours_weekly, status, progress, deadline }) {
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

      // Insertar objetivo
      const [result] = await pool.query(
        `INSERT INTO profile_goals (profile_id, name, goal_type, description, 
                                    target_hours_weekly, status, progress, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profileId,
          name,
          goal_type || null,
          description || null,
          target_hours_weekly || null,
          status || 'active',
          progress || 0,
          deadline || null,
        ]
      );
      return await this.getById(result.insertId, userId);
    } catch (error) {
      throw new Error(`Error al crear objetivo: ${error.message}`);
    }
  },

  async update(goalId, userId, { name, goal_type, description, target_hours_weekly, status, progress, deadline }) {
    try {
      // Verificar que el objetivo existe y pertenece al usuario
      await this.getById(goalId, userId);

      // Actualizar objetivo
      const updateFields = [];
      const updateValues = [];
      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (goal_type !== undefined) {
        updateFields.push('goal_type = ?');
        updateValues.push(goal_type);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (target_hours_weekly !== undefined) {
        updateFields.push('target_hours_weekly = ?');
        updateValues.push(target_hours_weekly);
      }
      if (status) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }
      if (progress !== undefined) {
        updateFields.push('progress = ?');
        updateValues.push(progress);
      }
      if (deadline !== undefined) {
        updateFields.push('deadline = ?');
        updateValues.push(deadline);
      }

      if (updateFields.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      updateValues.push(goalId);
      await pool.query(
        `UPDATE profile_goals SET ${updateFields.join(', ')} WHERE goal_id = ?`,
        updateValues
      );
      return await this.getById(goalId, userId);
    } catch (error) {
      throw new Error(`Error al actualizar objetivo: ${error.message}`);
    }
  },

  async delete(goalId, userId) {
    try {
      // Verificar que el objetivo existe y pertenece al usuario
      await this.getById(goalId, userId);

      // Eliminar objetivo
      await pool.query('DELETE FROM profile_goals WHERE goal_id = ?', [goalId]);
    } catch (error) {
      throw new Error(`Error al eliminar objetivo: ${error.message}`);
    }
  },
};

module.exports = ProfileGoal;