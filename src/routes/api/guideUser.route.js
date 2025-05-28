const router = require('express').Router();
const { createGuideUser } = require('../../controllers/guideUser.controller');
// const { checkToken } = require('../../middlewares/auth.middlewares');

router.post('/', createGuideUser);

module.exports = router;