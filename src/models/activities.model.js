const db = require('../config/db');

const selectAll = async () => {
    const [result] = await db.query('SELECT a.activity_id, a.title, a.description, a.day_of_week, a.start_time, a.end_time, a.location, a.datetime_start, a.datetime_end, a.created_at, a.updated_at, a.icon, r.name AS routine_name, c.name AS category_name' + 
        ' FROM activities a' +
        ' LEFT JOIN routines r ON a.routine_id = r.routine_id' +
        ' LEFT JOIN categories c ON a.category_id = c.category_id'
    );
    return result;
}

const selectById = async (activityId) => {
    const [result] = await db.query('select * from activities where activity_id = ?', [activityId]);
    if (result.length === 0) return null;
    return result[0];
}

const insert = async ({ routine_id, category_id, title, description, day_of_week, location, datetime_start, datetime_end, icon}) => {
    const [result] = await db.query('INSERT INTO activities (routine_id, category_id, title, description, day_of_week, location, datetime_start, datetime_end, created_at, updated_at, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [routine_id, category_id, title, description, day_of_week, location, datetime_start, datetime_end, new Date(), new Date(), icon]);
    return result;
}

const updateById = async (activityId, { routine_id, category_id, title, description, day_of_week, location, datetime_start, datetime_end, icon }) => { 
    const [result] = await db.query('UPDATE activities SET routine_id = ?, category_id = ?, title = ?, description = ?, day_of_week = ?, location = ?, datetime_start = ?, datetime_end = ?, updated_at = ?, icon = ? WHERE activity_id = ?', [routine_id, category_id, title, description, day_of_week, location, datetime_start, datetime_end, new Date(), icon, activityId]);
    return result;
}

const deleteById = async (activityId) => {
    const [result] = await db.query('DELETE FROM activities WHERE activity_id = ?', [activityId]);
    return result;
}



module.exports = {
    selectAll, selectById, insert, updateById, deleteById
};