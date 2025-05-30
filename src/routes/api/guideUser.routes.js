const router = require('express').Router();
const { createGuideUser } = require('../../controllers/guideUser.controller');
const { checkToken, checkGuideRole } = require('../../middlewares/auth.middleware');

router.post('/', checkToken, checkGuideRole, createGuideUser);

module.exports = router;