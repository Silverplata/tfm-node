const Activity = require('../models/activities.model');

const getAll = async (req, res) => {
    const activities = await Activity.selectAll();
    res.json(activities);
}

const getById = async (req, res) => {
    const { activityId } = req.params;
    const activity = await Activity.selectById(activityId);
    if (!activity) return res.status(404).json({ message: 'Actividad no encontrada' });
    res.json(activity);
}

const create = async (req, res) => {
    const result = await Activity.insert(req.body);
    try {
        const activity = await Activity.selectById(result.insertId);
        res.json(activity);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creando la actividad', error: error.message });
    }

}

const edit = async (req, res) => {
    const { activityId } = req.params;
    const result = await Activity.updateById(activityId, req.body);
    const activity = await Activity.selectById(activityId);
    res.json({ message: 'Actividad actualizada correctamente', activity });
    
}

const remove = async (req, res) => {
    const { activityId } = req.params;
    const activity = await Activity.selectById(activityId);
    const result = await Activity.deleteById(activityId);
    res.json(activity);
}


module.exports = { getAll, getById, create, edit, remove };