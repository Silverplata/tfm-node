const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const { getRoutines, getRoutineById } = require('../../controllers/routines.controller');

router.get('/', checkToken, getRoutines);
router.get('/:id', checkToken, getRoutineById);

module.exports = router;