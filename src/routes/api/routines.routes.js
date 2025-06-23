const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const { getRoutines, getRoutineById, createRoutine, updateRoutine, deleteRoutine } = require('../../controllers/routines.controller');

router.get('/', checkToken, getRoutines);
router.get('/:id', checkToken, getRoutineById);
router.post('/', checkToken, createRoutine);
router.put('/:id', checkToken, updateRoutine);
router.delete('/:id', checkToken, deleteRoutine);

module.exports = router;