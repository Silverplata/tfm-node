const router = require('express').Router();

// Rutas de autenticación
router.use('/auth', require('./api/auth.routes'));
router.use('/guide-user', require('./api/guideUser.routes'));

// Otras rutas
router.use('/users', require('./api/users.routes'));
router.use('/profile-goals', require('./api/profileGoals.routes'));
router.use('/routines', require('./api/routines.routes'));

router.use('/activities', require('./api/activities.routes'));
router.use('/categories', require('./api/categories.routes'));

module.exports = router;