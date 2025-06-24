const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const { getAll, getById, create, edit, remove } = require('../../controllers/activities.controller');

router.get('/', checkToken, getAll);
router.get('/:activityId', checkToken, getById);
router.post('/', checkToken, create);
router.put('/:activityId', checkToken, edit);
router.delete('/:activityId', checkToken, remove);

module.exports = router;