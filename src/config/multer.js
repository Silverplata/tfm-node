const multer = require('multer');
const cloudinary = require('./cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Almacenamiento local
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Almacenamiento en Cloudinary
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'planificador_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);
      return uniqueSuffix;
    },
  },
});

// Configuración de Multer
const uploadLocal = multer({
  storage: localStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/image\/(jpg|jpeg|png)/)) {
      return cb(new Error('Solo se permiten imágenes JPG, JPEG o PNG'));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const uploadCloudinary = multer({
  storage: cloudinaryStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/image\/(jpg|jpeg|png)/)) {
      return cb(new Error('Solo se permiten imágenes JPG, JPEG o PNG'));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Seleccionar almacenamiento según entorno
const upload = process.env.NODE_ENV === 'production' ? uploadCloudinary : uploadLocal;

module.exports = { upload };