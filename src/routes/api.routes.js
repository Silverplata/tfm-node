const router = require('express').Router();

// Rutas de autenticación
router.use('/auth', require('./api/auth.routes'));
router.use('/guide-user', require('./api/guideUser.routes'));

// Otras rutas (por ejemplo, users, routines, etc.)
router.use('/users', require('./api/users.routes'));
router.use('/profile-goals', require('./api/profileGoals.routes'));

module.exports = router;