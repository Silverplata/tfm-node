const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalsByUserId,
} = require('../../controllers/profileGoals.controller');

router.get('/', checkToken, getAllGoals);
router.get('/:iduser', checkToken, getGoalsByUserId);
router.get('/:id', checkToken, getGoalById);

router.post('/', checkToken, createGoal);

router.put('/:id', checkToken, updateGoal);

router.delete('/:id', checkToken, deleteGoal);

module.exports = router;