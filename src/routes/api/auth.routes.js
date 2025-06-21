const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { upload } = require('../../config/multer');

router.post('/register', upload.single('image'), authController.register);
router.post('/login', authController.login);

module.exports = router;