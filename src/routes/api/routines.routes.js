const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const { 
  getRoutines, 
  getRoutineById, 
  createRoutine, 
  updateRoutine, 
  deleteRoutine, 
  getRoutinesByUserId,
  getPublicRoutines,
  createRoutineFromTemplate,
  getSharedRoutinesByUser,
  getReceivedRoutinesByUser
} = require('../../controllers/routines.controller');

// Rutas existentes
router.get('/', checkToken, getRoutines);
router.get('/user/:userId', checkToken, getRoutinesByUserId);
router.get('/:id', checkToken, getRoutineById);
router.post('/', checkToken, createRoutine);
router.put('/:id', checkToken, updateRoutine);
router.delete('/:id', checkToken, deleteRoutine);

// Nuevas rutas para rutinas compartidas
router.get('/public/templates', checkToken, getPublicRoutines);
router.post('/create-from-template', checkToken, createRoutineFromTemplate);
router.get('/shared/by-me', checkToken, getSharedRoutinesByUser);
router.get('/shared/received', checkToken, getReceivedRoutinesByUser);

module.exports = router;