const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
} = require('../../controllers/profileGoals.controller');

router.get('/', checkToken, getAllGoals);
router.get('/:id', checkToken, getGoalById);

router.post('/', checkToken, createGoal);

router.put('/:id', checkToken, updateGoal);

router.delete('/:id', checkToken, deleteGoal);

module.exports = router;