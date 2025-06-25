const router = require('express').Router();
const { checkToken, checkGuideRole } = require('../../middlewares/auth.middleware');
const {
  getProfile,
  updateProfile,
  getInterests,
  addInterest,
  updateAvailability,
  getInterestsByUserId,
} = require('../../controllers/users.controller');
const { upload } = require('../../config/multer');

router.get('/profile', checkToken, getProfile);
router.get('/interests', checkToken, getInterests);
router.get('/interests/:iduser', checkToken, getInterestsByUserId);

router.post('/interests', checkToken, addInterest);

router.put('/profile', checkToken, upload.single('image'), updateProfile);
router.put('/availability', checkToken, checkGuideRole, updateAvailability);

module.exports = router;