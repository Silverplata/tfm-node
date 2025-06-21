const pool = require('../config/db');

const Routine = {
  async getUserRoutines(userId, role) {
    try {
      let query;
      let values;

      if (role === 'guide') {
        // Para guías, obtener rutinas de los usuarios asignados (a través de guide_user)
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
          JOIN guide_user gu ON r.user_id = gu.user_id
          WHERE gu.guide_id = ?
          ORDER BY r.start_time, a.datetime_start
        `;
        values = [userId];
      } else {
        // Para usuarios, obtener sus propias rutinas
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

      // Agrupar actividades por rutina
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
        // Para guías, verificar que la rutina pertenece a un usuario asignado
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
          JOIN guide_user gu ON r.user_id = gu.user_id
          WHERE r.routine_id = ? AND gu.guide_id = ?
          ORDER BY a.datetime_start
        `;
        values = [routineId, userId];
      } else {
        // Para usuarios, obtener su propia rutina
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

      // Estructurar la rutina
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

      // Añadir actividades
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
};

module.exports = Routine;