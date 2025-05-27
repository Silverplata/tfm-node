const router = require('express').Router();
const { register } = require('../../controllers/auth.controller');
// const { checkToken } = require('../../middlewares/auth.middlewares');

router.post('/register', register);
// router.post('/login', login);
// router.get('/perfil', checkToken, perfil);

module.exports = router;