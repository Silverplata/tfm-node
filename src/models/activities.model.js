const pool = require('../config/db');

// Función auxiliar para formatear fechas a MySQL
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Formato de fecha inválido: ${dateStr}`);
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const selectAll = async (userId, role) => {
  try {
    let query;
    let values;

    if (role === 'guide') {
      query = `
        SELECT 
          a.activity_id, a.title, a.description, a.day_of_week, a.start_time, a.end_time, 
          a.location, a.datetime_start, a.datetime_end, a.created_at, a.updated_at, a.icon, 
          r.name AS routine_name, c.name AS category_name, c.color AS category_color
        FROM activities a
        LEFT JOIN routines r ON a.routine_id = r.routine_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        JOIN guide_user gu ON r.user_id = gu.user_id
        WHERE gu.guide_id = ?
      `;
      values = [userId];
    } else {
      query = `
        SELECT 
          a.activity_id, a.title, a.description, a.day_of_week, a.start_time, a.end_time, 
          a.location, a.datetime_start, a.datetime_end, a.created_at, a.updated_at, a.icon, 
          r.name AS routine_name, c.name AS category_name, c.color AS category_color
        FROM activities a
        LEFT JOIN routines r ON a.routine_id = r.routine_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        WHERE r.user_id = ?
      `;
      values = [userId];
    }

    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    throw new Error(`Error al obtener actividades: ${error.message}`);
  }
};

const selectById = async (activityId, userId, role) => {
  try {
    let query;
    let values;

    if (role === 'guide') {
      query = `
        SELECT 
          a.activity_id, a.routine_id, a.category_id, a.title, a.description, a.day_of_week, 
          a.start_time, a.end_time, a.location, a.datetime_start, a.datetime_end, 
          a.created_at, a.updated_at, a.icon, 
          r.name AS routine_name, c.name AS category_name, c.color AS category_color
        FROM activities a
        LEFT JOIN routines r ON a.routine_id = r.routine_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        LEFT JOIN guide_user gu ON r.user_id = gu.user_id
        WHERE a.activity_id = ? AND (r.user_id = ? OR gu.guide_id = ?)
      `;
      values = [activityId, userId, userId];
    } else {
      query = `
        SELECT 
          a.activity_id, a.routine_id, a.category_id, a.title, a.description, a.day_of_week, 
          a.start_time, a.end_time, a.location, a.datetime_start, a.datetime_end, 
          a.created_at, a.updated_at, a.icon, 
          r.name AS routine_name, c.name AS category_name, c.color AS category_color
        FROM activities a
        LEFT JOIN routines r ON a.routine_id = r.routine_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        WHERE a.activity_id = ? AND r.user_id = ?
      `;
      values = [activityId, userId];
    }

    const [result] = await pool.query(query, values);
    if (result.length === 0) return null;
    return result[0];
  } catch (error) {
    throw new Error(`Error al obtener actividad: ${error.message}`);
  }
};

const insert = async ({ routine_id, category_id, title, description, day_of_week, start_time, end_time, location, datetime_start, datetime_end, icon }, userId, role) => {
  try {
    // Validar que la rutina pertenece al usuario o a un usuario asignado al guía
    let authQuery;
    let authValues;
    if (role === 'guide') {
      authQuery = `
        SELECT r.routine_id
        FROM routines r
        LEFT JOIN guide_user gu ON r.user_id = gu.user_id
        WHERE r.routine_id = ? AND (r.user_id = ? OR gu.guide_id = ?)
      `;
      authValues = [routine_id, userId, userId];
    } else {
      authQuery = 'SELECT routine_id FROM routines WHERE routine_id = ? AND user_id = ?';
      authValues = [routine_id, userId];
    }
    const [authRows] = await pool.query(authQuery, authValues);
    if (!authRows[0]) {
      throw new Error('No autorizado para añadir actividades a esta rutina');
    }

    // Validar categoría si se proporciona
    if (category_id) {
      const [categoryRows] = await pool.query('SELECT category_id FROM categories WHERE category_id = ?', [category_id]);
      if (!categoryRows[0]) {
        throw new Error('Categoría no encontrada');
      }
    }

    // Formatear fechas
    const formattedDatetimeStart = formatDate(datetime_start);
    const formattedDatetimeEnd = formatDate(datetime_end);

    const [result] = await pool.query(
      'INSERT INTO activities (routine_id, category_id, title, description, day_of_week, start_time, end_time, location, datetime_start, datetime_end, created_at, updated_at, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [routine_id, category_id || null, title, description || null, day_of_week || null, start_time || null, end_time || null, location || null, formattedDatetimeStart, formattedDatetimeEnd, new Date(), new Date(), icon || null]
    );
    return result;
  } catch (error) {
    throw new Error(`Error al crear actividad: ${error.message}`);
  }
};

const updateById = async (activityId, { routine_id, category_id, title, description, day_of_week, start_time, end_time, location, datetime_start, datetime_end, icon }, userId, role) => {
  try {
    // Validar autorización
    let authQuery;
    let authValues;
    if (role === 'guide') {
      authQuery = `
        SELECT a.activity_id
        FROM activities a
        JOIN routines r ON a.routine_id = r.routine_id
        LEFT JOIN guide_user gu ON r.user_id = gu.user_id
        WHERE a.activity_id = ? AND (r.user_id = ? OR gu.guide_id = ?)
      `;
      authValues = [activityId, userId, userId];
    } else {
      authQuery = `
        SELECT a.activity_id
        FROM activities a
        JOIN routines r ON a.routine_id = r.routine_id
        WHERE a.activity_id = ? AND r.user_id = ?
      `;
      authValues = [activityId, userId];
    }
    const [authRows] = await pool.query(authQuery, authValues);
    if (!authRows[0]) {
      throw new Error('No autorizado para actualizar esta actividad');
    }

    // Validar categoría si se proporciona
    if (category_id) {
      const [categoryRows] = await pool.query('SELECT category_id FROM categories WHERE category_id = ?', [category_id]);
      if (!categoryRows[0]) {
        throw new Error('Categoría no encontrada');
      }
    }

    // Formatear fechas
    const formattedDatetimeStart = formatDate(datetime_start);
    const formattedDatetimeEnd = formatDate(datetime_end);

    const [result] = await pool.query(
      'UPDATE activities SET routine_id = ?, category_id = ?, title = ?, description = ?, day_of_week = ?, start_time = ?, end_time = ?, location = ?, datetime_start = ?, datetime_end = ?, updated_at = ?, icon = ? WHERE activity_id = ?',
      [routine_id, category_id || null, title, description || null, day_of_week || null, start_time || null, end_time || null, location || null, formattedDatetimeStart, formattedDatetimeEnd, new Date(), icon || null, activityId]
    );
    return result;
  } catch (error) {
    throw new Error(`Error al actualizar actividad: ${error.message}`);
  }
};

const deleteById = async (activityId, userId, role) => {
  try {
    // Validar autorización
    let authQuery;
    let authValues;
    if (role === 'guide') {
      authQuery = `
        SELECT a.activity_id
        FROM activities a
        JOIN routines r ON a.routine_id = r.routine_id
        LEFT JOIN guide_user gu ON r.user_id = gu.user_id
        WHERE a.activity_id = ? AND (r.user_id = ? OR gu.guide_id = ?)
      `;
      authValues = [activityId, userId, userId];
    } else {
      authQuery = `
        SELECT a.activity_id
        FROM activities a
        JOIN routines r ON a.routine_id = r.routine_id
        WHERE a.activity_id = ? AND r.user_id = ?
      `;
      authValues = [activityId, userId];
    }
    const [authRows] = await pool.query(authQuery, authValues);
    if (!authRows[0]) {
      throw new Error('No autorizado para eliminar esta actividad');
    }

    const [result] = await pool.query('DELETE FROM activities WHERE activity_id = ?', [activityId]);
    return result;
  } catch (error) {
    throw new Error(`Error al eliminar actividad: ${error.message}`);
  }
};

const selectByRoutineAndCategory = async (routineId, categoryId, userId, role) => {
  try {
    // Validar autorización para la rutina
    let authQuery;
    let authValues;
    
    if (role === 'guide') {
      authQuery = `
        SELECT r.routine_id
        FROM routines r
        LEFT JOIN guide_user gu ON r.user_id = gu.user_id
        WHERE r.routine_id = ? AND (r.user_id = ? OR gu.guide_id = ?)
      `;
      authValues = [routineId, userId, userId];
    } else {
      authQuery = 'SELECT routine_id FROM routines WHERE routine_id = ? AND user_id = ?';
      authValues = [routineId, userId];
    }
    
    const [authRows] = await pool.query(authQuery, authValues);
    if (authRows.length === 0) {
      throw new Error('No autorizado para ver las actividades de esta rutina');
    }

    // Construir la consulta principal
    let query = `
      SELECT 
        a.activity_id, a.title, a.description, a.day_of_week, 
        TIME_FORMAT(a.start_time, '%H:%i') AS start_time, 
        TIME_FORMAT(a.end_time, '%H:%i') AS end_time,
        a.location, a.datetime_start, a.datetime_end, a.icon,
        c.name AS category_name,
        c.color AS category_color
      FROM activities a
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.routine_id = ?
    `;
    
    const values = [routineId];
    
    // Agregar filtro por categoría si se proporciona
    if (categoryId) {
      query += ' AND a.category_id = ?';
      values.push(categoryId);
    }
    
    // Ordenar por hora de inicio
    query += ' ORDER BY a.start_time ASC';
    
    const [result] = await pool.query(query, values);
    return result;
  } catch (error) {
    throw new Error(`Error al obtener actividades por rutina y categoría: ${error.message}`);
  }
};

module.exports = { selectAll, selectById, insert, updateById, deleteById, selectByRoutineAndCategory };