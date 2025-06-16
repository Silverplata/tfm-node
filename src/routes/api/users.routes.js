const router = require('express').Router();
const { checkToken, checkGuideRole } = require('../../middlewares/auth.middleware');
const {
  getProfile,
  updateProfile,
  getInterests,
  addInterest,
  updateAvailability,
} = require('../../controllers/users.controller');

router.get('/profile', checkToken, getProfile);
router.get('/interests', checkToken, getInterests);

router.post('/interests', checkToken, addInterest);

router.put('/profile', checkToken, updateProfile);
router.put('/availability', checkToken, checkGuideRole, updateAvailability);




module.exports = router;