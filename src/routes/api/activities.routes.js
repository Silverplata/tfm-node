const { getAll, getById, create, edit, remove } = require('../../controllers/activities.controller');

const router = require('express').Router();

// Define your routes here
router.get('/', getAll);
router.get('/:activityId', getById);

router.post('/', create)
router.put('/:activityId', edit);
router.delete('/:activityId', remove);

module.exports = router;