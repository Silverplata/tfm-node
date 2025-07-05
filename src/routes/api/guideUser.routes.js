const router = require('express').Router();
const { checkToken, checkGuideRole } = require('../../middlewares/auth.middleware');
const {
  createGuideUser,
  getAllGuideUserRelations,
  getGuideUserRelationById,
  deleteGuideUserRelation,
  getUnassignedUsers
} = require('../../controllers/guideUser.controller');

router.post('/', checkToken, checkGuideRole, createGuideUser);
router.get('/', checkToken, getAllGuideUserRelations);
router.get('/unassigned-users', checkToken, checkGuideRole, getUnassignedUsers);
router.get('/:guideUserId', checkToken, getGuideUserRelationById);
router.delete('/:guideUserId', checkToken, deleteGuideUserRelation);

module.exports = router;