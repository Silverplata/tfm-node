const router = require('express').Router();
const { checkToken, checkGuideRole } = require('../../middlewares/auth.middleware');
const { getAllCategories, createCategory } = require('../../controllers/category.controller');

router.get('/', checkToken, getAllCategories);
router.post('/', checkToken, checkGuideRole, createCategory);

module.exports = router;