const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const { getAll, getById, create, edit, remove, getByRoutineAndCategory } = require('../../controllers/activities.controller');

router.get('/', checkToken, getAll);
router.get('/:activityId', checkToken, getById);
router.get('/routine/:routineId', checkToken, getByRoutineAndCategory);

router.post('/', checkToken, create);

router.put('/:activityId', checkToken, edit);

router.delete('/:activityId', checkToken, remove);

module.exports = router;