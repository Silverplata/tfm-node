const router = require('express').Router();
const { checkToken } = require('../../middlewares/auth.middleware');
const { getRoutines } = require('../../controllers/routines.controller');

router.get('/', checkToken, getRoutines);

module.exports = router;