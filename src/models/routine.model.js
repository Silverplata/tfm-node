const pool = require('../config/db');

const Routine = {
  async getUserRoutines(userId, role) {
    try {
      let query;
      let values;

      if (role === 'guide') {
        query = `
          SELECT 
            r.routine_id, r.user_id, r.name, r.description, r.is_template, 
            r.created_at, r.updated_at, r.start_time, r.end_time, r.daily_routine,
            a.activity_id, a.title AS activity_name, a.description AS activity_description,
            a.day_of_week, a.start_time AS activity_start_time, a.end_time AS activity_end_time,
            a.location, a.datetime_start, a.datetime_end, a.icon,
            c.name AS category_name, c.color AS category_color
          FROM routines r
          LEFT JOIN activities a ON r.routine_id = a.routine_id
          LEFT JOIN categories c ON a.category_id = c.category_id
          WHERE r.user_id = ? OR r.user_id IN (
            SELECT user_id FROM guide_user WHERE guide_id = ?
          )
          ORDER BY r.start_time, a.datetime_start
        `;
        values = [userId, userId];
      } else {
        query = `
          SELECT 
            r.routine_id, r.user_id, r.name, r.description, r.is_template, 
            r.created_at, r.updated_at, r.start_time, r.end_time, r.daily_routine,
            a.activity_id, a.title AS activity_name, a.description AS activity_description,
            a.day_of_week, a.start_time AS activity_start_time, a.end_time AS activity_end_time,
            a.location, a.datetime_start, a.datetime_end, a.icon,
            c.name AS category_name, c.color AS category_color
          FROM routines r
          LEFT JOIN activities a ON r.routine_id = a.routine_id
          LEFT JOIN categories c ON a.category_id = c.category_id
          WHERE r.user_id = ?
          ORDER BY r.start_time, a.datetime_start
        `;
        values = [userId];
      }

      const [rows] = await pool.query(query, values);

      const routines = [];
      const routineMap = new Map();

      rows.forEach(row => {
        const routineId = row.routine_id;
        if (!routineMap.has(routineId)) {
          routineMap.set(routineId, {
            routine_id: row.routine_id,
            user_id: row.user_id,
            name: row.name,
            description: row.description,
            is_template: Boolean(row.is_template),
            created_at: row.created_at,
            updated_at: row.updated_at,
            start_time: row.start_time,
            end_time: row.end_time,
            daily_routine: row.daily_routine,
            activities: [],
          });
        }

        if (row.activity_id) {
          routineMap.get(routineId).activities.push({
            activity_id: row.activity_id,
            activity_name: row.activity_name,
            description: row.activity_description,
            day_of_week: row.day_of_week,
            start_time: row.activity_start_time,
            end_time: row.activity_end_time,
            location: row.location,
            datetime_start: row.datetime_start,
            datetime_end: row.datetime_end,
            icon: row.icon,
            category: row.category_name ? {
              name: row.category_name,
              color: row.category_color,
            } : null,
          });
        }
      });

      routineMap.forEach(routine => routines.push(routine));
      return routines;
    } catch (error) {
      throw new Error(`Error al obtener rutinas: ${error.message}`);
    }
  },

  async getRoutinesByUserId(targetUserId) {
    try {
      const query = `
        SELECT 
          r.routine_id, r.user_id, r.name, r.description, r.is_template, 
          r.created_at, r.updated_at, r.start_time, r.end_time, r.daily_routine,
          a.activity_id, a.title AS activity_name, a.description AS activity_description,
          a.day_of_week, a.start_time AS activity_start_time, a.end_time AS activity_end_time,
          a.location, a.datetime_start, a.datetime_end, a.icon,
          c.name AS category_name, c.color AS category_color
        FROM routines r
        LEFT JOIN activities a ON r.routine_id = a.routine_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        WHERE r.user_id = ?
        ORDER BY r.start_time, a.datetime_start
      `;
      const values = [targetUserId];

      const [rows] = await pool.query(query, values);

      const routines = [];
      const routineMap = new Map();

      rows.forEach(row => {
        const routineId = row.routine_id;
        if (!routineMap.has(routineId)) {
          routineMap.set(routineId, {
            routine_id: row.routine_id,
            user_id: row.user_id,
            name: row.name,
            description: row.description,
            is_template: Boolean(row.is_template),
            created_at: row.created_at,
            updated_at: row.updated_at,
            start_time: row.start_time,
            end_time: row.end_time,
            daily_routine: row.daily_routine,
            activities: [],
          });
        }

        if (row.activity_id) {
          routineMap.get(routineId).activities.push({
            activity_id: row.activity_id,
            activity_name: row.activity_name,
            description: row.activity_description,
            day_of_week: row.day_of_week,
            start_time: row.activity_start_time,
            end_time: row.activity_end_time,
            location: row.location,
            datetime_start: row.datetime_start,
            datetime_end: row.datetime_end,
            icon: row.icon,
            category: row.category_name ? {
              name: row.category_name,
              color: row.category_color,
            } : null,
          });
        }
      });

      routineMap.forEach(routine => routines.push(routine));
      return routines;
    } catch (error) {
      throw new Error(`Error al obtener rutinas: ${error.message}`);
    }
  },

  async getRoutineById(routineId, userId, role) {
    try {
      let query;
      let values;

      if (role === 'guide') {
        query = `
          SELECT 
            r.routine_id, r.user_id, r.name, r.description, r.is_template, 
            r.created_at, r.updated_at, r.start_time, r.end_time, r.daily_routine,
            a.activity_id, a.title AS activity_name, a.description AS activity_description,
            a.day_of_week, a.start_time AS activity_start_time, a.end_time AS activity_end_time,
            a.location, a.datetime_start, a.datetime_end, a.icon,
            c.name AS category_name, c.color AS category_color
          FROM routines r
          LEFT JOIN activities a ON r.routine_id = a.routine_id
          LEFT JOIN categories c ON a.category_id = c.category_id
          WHERE r.routine_id = ? AND (r.user_id = ? OR r.user_id IN (
            SELECT user_id FROM guide_user WHERE guide_id = ?
          ))
          ORDER BY a.datetime_start
        `;
        values = [routineId, userId, userId];
      } else {
        query = `
          SELECT 
            r.routine_id, r.user_id, r.name, r.description, r.is_template, 
            r.created_at, r.updated_at, r.start_time, r.end_time, r.daily_routine,
            a.activity_id, a.title AS activity_name, a.description AS activity_description,
            a.day_of_week, a.start_time AS activity_start_time, a.end_time AS activity_end_time,
            a.location, a.datetime_start, a.datetime_end, a.icon,
            c.name AS category_name, c.color AS category_color
          FROM routines r
          LEFT JOIN activities a ON r.routine_id = a.routine_id
          LEFT JOIN categories c ON a.category_id = c.category_id
          WHERE r.routine_id = ? AND r.user_id = ?
          ORDER BY a.datetime_start
        `;
        values = [routineId, userId];
      }

      const [rows] = await pool.query(query, values);

      if (rows.length === 0) {
        throw new Error('Rutina no encontrada o no autorizada');
      }

      const routine = {
        routine_id: rows[0].routine_id,
        user_id: rows[0].user_id,
        name: rows[0].name,
        description: rows[0].description,
        is_template: Boolean(rows[0].is_template),
        created_at: rows[0].created_at,
        updated_at: rows[0].updated_at,
        start_time: rows[0].start_time,
        end_time: rows[0].end_time,
        daily_routine: rows[0].daily_routine,
        activities: [],
      };

      rows.forEach(row => {
        if (row.activity_id) {
          routine.activities.push({
            activity_id: row.activity_id,
            activity_name: row.activity_name,
            description: row.activity_description,
            day_of_week: row.day_of_week,
            start_time: row.activity_start_time,
            end_time: row.activity_end_time,
            location: row.location,
            datetime_start: row.datetime_start,
            datetime_end: row.datetime_end,
            icon: row.icon,
            category: row.category_name ? {
              name: row.category_name,
              color: row.category_color,
            } : null,
          });
        }
      });

      return routine;
    } catch (error) {
      throw new Error(`Error al obtener la rutina: ${error.message}`);
    }
  },

  async createRoutine({ userId, targetUserId, name, description, is_template, start_time, end_time, daily_routine }) {
    try {
      // Validar campos obligatorios
      if (!name) {
        throw new Error('El nombre de la rutina es obligatorio');
      }
      if (!targetUserId) {
        throw new Error('El ID del usuario objetivo es obligatorio');
      }

      // Normalizar daily_routine a minúsculas para coincidir con el ENUM de MySQL
      const normalizedDailyRoutine = daily_routine ? daily_routine.toLowerCase() : 'daily';
      if (!['daily', 'weekly', 'monthly'].includes(normalizedDailyRoutine)) {
        throw new Error('El tipo de rutina debe ser daily, weekly o monthly');
      }

      // Verificar que el usuario objetivo existe
      const [userRows] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [targetUserId]);
      if (!userRows[0]) {
        throw new Error('Usuario objetivo no encontrado');
      }

      // Formatear fechas para MySQL
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error(`Formato de fecha inválido: ${dateStr}`);
        }
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const formattedStartTime = formatDate(start_time);
      const formattedEndTime = formatDate(end_time);

      const [result] = await pool.query(
        'INSERT INTO routines (user_id, name, description, is_template, start_time, end_time, daily_routine) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [targetUserId, name, description || null, is_template ? 1 : 0, formattedStartTime, formattedEndTime, normalizedDailyRoutine]
      );

      return {
        routine_id: result.insertId,
        user_id: targetUserId,
        name,
        description: description || null,
        is_template: Boolean(is_template),
        created_at: new Date(),
        updated_at: new Date(),
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        daily_routine: normalizedDailyRoutine,
        activities: [],
      };
    } catch (error) {
      throw new Error(`No se pudo crear la rutina: ${error.message}`);
    }
  },

  async updateRoutine(routineId, userId, role, { name, description, is_template, start_time, end_time, daily_routine }) {
    try {
      // Validar campos
      if (!name) {
        throw new Error('El nombre de la rutina es obligatorio');
      }

      // Normalizar daily_routine a minúsculas
      const normalizedDailyRoutine = daily_routine ? daily_routine.toLowerCase() : null;
      if (normalizedDailyRoutine && !['daily', 'weekly', 'monthly'].includes(normalizedDailyRoutine)) {
        throw new Error('El tipo de rutina debe ser daily, weekly o monthly');
      }

      // Verificar autorización
      let query;
      let values;
      if (role === 'guide') {
        query = `
          SELECT r.routine_id
          FROM routines r
          WHERE r.routine_id = ? AND (r.user_id = ? OR r.user_id IN (
            SELECT user_id FROM guide_user WHERE guide_id = ?
          ))
        `;
        values = [routineId, userId, userId];
      } else {
        query = 'SELECT routine_id FROM routines WHERE routine_id = ? AND user_id = ?';
        values = [routineId, userId];
      }
      const [authRows] = await pool.query(query, values);
      if (!authRows[0]) {
        throw new Error('Rutina no encontrada o no autorizada');
      }

      // Formatear fechas para MySQL
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error(`Formato de fecha inválido: ${dateStr}`);
        }
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const formattedStartTime = formatDate(start_time);
      const formattedEndTime = formatDate(end_time);

      const updateFields = [];
      const updateValues = [];
      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description || null);
      }
      if (is_template !== undefined) {
        updateFields.push('is_template = ?');
        updateValues.push(is_template ? 1 : 0);
      }
      if (start_time !== undefined) {
        updateFields.push('start_time = ?');
        updateValues.push(formattedStartTime);
      }
      if (end_time !== undefined) {
        updateFields.push('end_time = ?');
        updateValues.push(formattedEndTime);
      }
      if (normalizedDailyRoutine) {
        updateFields.push('daily_routine = ?');
        updateValues.push(normalizedDailyRoutine);
      }
      updateFields.push('updated_at = ?');
      updateValues.push(new Date());
      updateValues.push(routineId);

      if (updateFields.length === 1) {
        throw new Error('No se proporcionaron campos para actualizar');
      }

      await pool.query(
        `UPDATE routines SET ${updateFields.join(', ')} WHERE routine_id = ?`,
        updateValues
      );

      return await this.getRoutineById(routineId, userId, role);
    } catch (error) {
      throw new Error(`No se pudo actualizar la rutina: ${error.message}`);
    }
  },

  async deleteRoutine(routineId, userId, role) {
    try {
      // Verificar autorización
      let query;
      let values;
      if (role === 'guide') {
        query = `
          SELECT r.routine_id
          FROM routines r
          WHERE r.routine_id = ? AND (r.user_id = ? OR r.user_id IN (
            SELECT user_id FROM guide_user WHERE guide_id = ?
          ))
        `;
        values = [routineId, userId, userId];
      } else {
        query = 'SELECT routine_id FROM routines WHERE routine_id = ? AND user_id = ?';
        values = [routineId, userId];
      }
      const [authRows] = await pool.query(query, values);
      if (!authRows[0]) {
        throw new Error('Rutina no encontrada o no autorizada');
      }

      // Eliminar rutina (las actividades asociadas se eliminan por ON DELETE CASCADE)
      await pool.query('DELETE FROM routines WHERE routine_id = ?', [routineId]);
      return { routine_id: routineId };
    } catch (error) {
      throw new Error(`No se pudo eliminar la rutina: ${error.message}`);
    }
  },

  async getPublicRoutines() {
    try {
      const query = `
        SELECT 
          r.routine_id, r.user_id, r.name, r.description, r.is_template, 
          r.created_at, r.updated_at, r.start_time, r.end_time, r.daily_routine,
          u.first_name, u.last_name, u.username,
          a.activity_id, a.title AS activity_name, a.description AS activity_description,
          a.day_of_week, a.start_time AS activity_start_time, a.end_time AS activity_end_time,
          a.location, a.datetime_start, a.datetime_end, a.icon,
          c.name AS category_name, c.color AS category_color
        FROM routines r
        INNER JOIN users u ON r.user_id = u.user_id
        LEFT JOIN activities a ON r.routine_id = a.routine_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        WHERE r.is_template = 1
        ORDER BY r.created_at DESC, a.datetime_start
      `;

      const [rows] = await pool.query(query);

      const routines = [];
      const routineMap = new Map();

      rows.forEach(row => {
        const routineId = row.routine_id;
        if (!routineMap.has(routineId)) {
          routineMap.set(routineId, {
            routine_id: row.routine_id,
            user_id: row.user_id,
            name: row.name,
            description: row.description,
            is_template: Boolean(row.is_template),
            created_at: row.created_at,
            updated_at: row.updated_at,
            start_time: row.start_time,
            end_time: row.end_time,
            daily_routine: row.daily_routine,
            shared_by: {
              first_name: row.first_name,
              last_name: row.last_name,
              username: row.username
            },
            activities: [],
          });
        }

        if (row.activity_id) {
          routineMap.get(routineId).activities.push({
            activity_id: row.activity_id,
            activity_name: row.activity_name,
            description: row.activity_description,
            day_of_week: row.day_of_week,
            start_time: row.activity_start_time,
            end_time: row.activity_end_time,
            location: row.location,
            datetime_start: row.datetime_start,
            datetime_end: row.datetime_end,
            icon: row.icon,
            category: row.category_name ? {
              name: row.category_name,
              color: row.category_color,
            } : null,
          });
        }
      });

      routineMap.forEach(routine => routines.push(routine));
      return routines;
    } catch (error) {
      throw new Error(`Error al obtener rutinas públicas: ${error.message}`);
    }
  },

  /**
   * Crea una rutina basada en una plantilla pública
   */
  async createRoutineFromTemplate(templateId, userId, { name, description, start_time, end_time, daily_routine }) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Verificar que la rutina template existe y es pública
      const [templateRows] = await connection.query(
        'SELECT * FROM routines WHERE routine_id = ? AND is_template = 1',
        [templateId]
      );

      if (!templateRows[0]) {
        throw new Error('Plantilla de rutina no encontrada o no es pública');
      }

      const template = templateRows[0];

      // Formatear fechas para MySQL
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error(`Formato de fecha inválido: ${dateStr}`);
        }
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const formattedStartTime = formatDate(start_time);
      const formattedEndTime = formatDate(end_time);

      // Normalizar daily_routine
      const normalizedDailyRoutine = daily_routine ? daily_routine.toLowerCase() : template.daily_routine;
      if (!['daily', 'weekly', 'monthly'].includes(normalizedDailyRoutine)) {
        throw new Error('El tipo de rutina debe ser daily, weekly o monthly');
      }

      // Crear la nueva rutina
      const [routineResult] = await connection.query(
        'INSERT INTO routines (user_id, name, description, is_template, start_time, end_time, daily_routine) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          userId,
          name || template.name,
          description || template.description,
          0, // La rutina copiada no es template por defecto
          formattedStartTime,
          formattedEndTime,
          normalizedDailyRoutine
        ]
      );

      const newRoutineId = routineResult.insertId;

      // ===== SECCIÓN RESTAURADA: COPIAR ACTIVIDADES =====
      // Copiar las actividades de la plantilla
      const [activities] = await connection.query(
        'SELECT * FROM activities WHERE routine_id = ?',
        [templateId]
      );

      if (activities.length > 0) {
        const activityValues = activities.map(activity => [
          newRoutineId,
          activity.title,
          activity.description,
          activity.day_of_week,
          activity.start_time,
          activity.end_time,
          activity.location,
          activity.datetime_start,
          activity.datetime_end,
          activity.icon,
          activity.category_id
        ]);

        await connection.query(
          'INSERT INTO activities (routine_id, title, description, day_of_week, start_time, end_time, location, datetime_start, datetime_end, icon, category_id) VALUES ?',
          [activityValues]
        );
      }
      // ===== FIN DE SECCIÓN RESTAURADA =====

      // Registrar el compartir en routine_shares
      await connection.query(
        'INSERT INTO routine_shares (routine_id, shared_by_user_id, shared_with_user_id, routine_id_shared) VALUES (?, ?, ?, ?)',
        [templateId, template.user_id, userId, newRoutineId]
      );

      await connection.commit();

      // Retornar la rutina creada con sus actividades
      return await this.getRoutineById(newRoutineId, userId, 'user');

    } catch (error) {
      await connection.rollback();
      throw new Error(`Error al crear rutina desde plantilla: ${error.message}`);
    } finally {
      connection.release();
    }
  },

  /**
   * Obtiene el historial de rutinas compartidas por un usuario
   */
  async getSharedRoutinesByUser(userId) {
    try {
      const query = `
        SELECT 
          rs.share_id, rs.routine_id, rs.shared_by_user_id, rs.shared_with_user_id, 
          rs.shared_at, rs.routine_id_shared,
          r.name as template_name, r.description as template_description,
          u_shared_with.first_name, u_shared_with.last_name, u_shared_with.username,
          r_new.name as new_routine_name
        FROM routine_shares rs
        INNER JOIN routines r ON rs.routine_id = r.routine_id
        INNER JOIN users u_shared_with ON rs.shared_with_user_id = u_shared_with.user_id
        LEFT JOIN routines r_new ON rs.routine_id_shared = r_new.routine_id
        WHERE rs.shared_by_user_id = ?
        ORDER BY rs.shared_at DESC
      `;

      const [rows] = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener rutinas compartidas: ${error.message}`);
    }
  },

  /**
   * Obtiene las rutinas que un usuario ha obtenido de plantillas
   */
  async getReceivedRoutinesByUser(userId) {
    try {
      const query = `
        SELECT 
          rs.share_id, rs.routine_id, rs.shared_by_user_id, rs.shared_with_user_id, 
          rs.shared_at, rs.routine_id_shared,
          r.name as template_name, r.description as template_description,
          u_shared_by.first_name, u_shared_by.last_name, u_shared_by.username,
          r_new.name as new_routine_name, r_new.routine_id as new_routine_id
        FROM routine_shares rs
        INNER JOIN routines r ON rs.routine_id = r.routine_id
        INNER JOIN users u_shared_by ON rs.shared_by_user_id = u_shared_by.user_id
        LEFT JOIN routines r_new ON rs.routine_id_shared = r_new.routine_id
        WHERE rs.shared_with_user_id = ?
        ORDER BY rs.shared_at DESC
      `;

      const [rows] = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener rutinas recibidas: ${error.message}`);
    }
  }

};

module.exports = Routine;