const router = require('express').Router();
const { checkToken, checkGuideRole } = require('../../middlewares/auth.middleware');
const {
  createGuideUser,
  getAllGuideUserRelations,
  getGuideUserRelationById,
  deleteGuideUserRelation,
} = require('../../controllers/guideUser.controller');

router.post('/', checkToken, checkGuideRole, createGuideUser);
router.get('/', checkToken, getAllGuideUserRelations);
router.get('/:guideUserId', checkToken, getGuideUserRelationById);
router.delete('/:guideUserId', checkToken, deleteGuideUserRelation);

module.exports = router;