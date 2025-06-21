const router = require('express').Router();

// Rutas de autenticación
router.use('/auth', require('./api/auth.routes'));
router.use('/guide-user', require('./api/guideUser.routes'));

// Otras rutas
router.use('/users', require('./api/users.routes'));
router.use('/profile-goals', require('./api/profileGoals.routes'));
router.use('/routines', require('./api/routines.routes'));

module.exports = router;