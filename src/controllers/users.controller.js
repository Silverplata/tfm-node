const User = require('../models/user.model');

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     numTel:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       enum: [Hombre, Mujer, Otro]
 *                     image:
 *                       type: string
 *                       nullable: true
 *                     availability:
 *                       type: string
 *                       nullable: true
 *                     role:
 *                       type: string
 *                       enum: [user, guide]
 *                     colorPalette:
 *                       type: object
 *                       nullable: true
 *       401:
 *         description: No autorizado, token inválido
 *       404:
 *         description: Usuario no encontrado
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await User.getProfile(userId);
    res.status(200).json({
      message: 'Perfil obtenido correctamente',
      profile: {
        userId: profile.user_id,
        username: profile.username,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        age: profile.age,
        numTel: profile.num_tel,
        gender: profile.gender,
        image: profile.image,
        availability: profile.availability,
        role: profile.role,
        colorPalette: profile.color_palette,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Actualiza el perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: María
 *               last_name:
 *                 type: string
 *                 example: Quesadas
 *               num_tel:
 *                 type: string
 *                 pattern: '^\d{9}$'
 *                 example: 611223344
 *               gender:
 *                 type: string
 *                 enum: [Hombre, Mujer, Otro]
 *                 example: Mujer
 *               color_palette:
 *                 type: string
 *                 description: A JSON string with primary and secondary hex color codes
 *                 example: '{"primary": "#FF6F61", "secondary": "#4682B4"}'
 *               image:
 *                 type: string
 *                 format: binary
 *               remove_image:
 *                 type: boolean
 *                 example: false
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: María
 *               last_name:
 *                 type: string
 *                 example: Quesadas
 *               num_tel:
 *                 type: string
 *                 pattern: '^\d{9}$'
 *                 example: 611223344
 *               gender:
 *                 type: string
 *                 enum: [Hombre, Mujer, Otro]
 *                 example: Mujer
 *               color_palette:
 *                 type: object
 *                 example: { primary: "#FF6F61", secondary: "#4682B4" }
 *               remove_image:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     numTel:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     image:
 *                       type: string
 *                     availability:
 *                       type: string
 *                     role:
 *                       type: string
 *                     colorPalette:
 *                       type: object
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    let { first_name, last_name, num_tel, gender, color_palette, remove_image } = req.body;
    let image = null;

    // Parsear color_palette según Content-Type
    if (color_palette) {
      if (req.is('multipart/form-data')) {
        try {
          color_palette = JSON.parse(color_palette);
        } catch {
          return res.status(400).json({ message: 'Formato de paleta de colores inválido' });
        }
      }
      // Validar que color_palette sea un objeto con primary y secondary
      if (typeof color_palette !== 'object' || !color_palette.primary || !color_palette.secondary) {
        return res.status(400).json({ message: 'Paleta de colores inválida, debe incluir primary y secondary' });
      }
      // Validar códigos de color hexadecimales
      const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
      if (!hexColorRegex.test(color_palette.primary) || !hexColorRegex.test(color_palette.secondary)) {
        return res.status(400).json({ message: 'Los colores deben ser códigos hexadecimales válidos (#RRGGBB o #RGB)' });
      }
    }

    // Validaciones
    if (!first_name && !last_name && !num_tel && !gender && !color_palette && !req.file && remove_image === undefined) {
      return res.status(400).json({ message: 'Al menos un campo debe proporcionarse para actualizar' });
    }
    if (num_tel && !/^\d{9}$/.test(num_tel)) {
      return res.status(400).json({ message: 'Número de teléfono inválido' });
    }
    if (gender && !['Hombre', 'Mujer', 'Otro'].includes(gender)) {
      return res.status(400).json({ message: 'Género inválido' });
    }

    // Manejar imagen
    if (req.file) {
      image = process.env.NODE_ENV === 'production' ? req.file.path : `/uploads/${req.file.filename}`;
    } else if (remove_image === 'true') {
      image = null;
    }
    
    const updateData = { first_name, last_name, num_tel, gender, color_palette };

    // Solo actualizar el campo de imagen si se proporciona una imagen o se solicita eliminarla
    if (req.file || remove_image === 'true') {
      updateData.image = image;
    }

    const updatedProfile = await User.updateProfile(userId, updateData);
    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      profile: {
        userId: updatedProfile.user_id,
        username: updatedProfile.username,
        email: updatedProfile.email,
        firstName: updatedProfile.first_name,
        lastName: updatedProfile.last_name,
        age: updatedProfile.age,
        numTel: updatedProfile.num_tel,
        gender: updatedProfile.gender,
        image: updatedProfile.image,
        availability: updatedProfile.availability,
        role: updatedProfile.role,
        colorPalette: updatedProfile.color_palette,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/interests:
 *   get:
 *     summary: Obtiene los intereses del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Intereses obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 interests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       interest_id:
 *                         type: integer
 *                       interest_name:
 *                         type: string
 *                       priority:
 *                         type: string
 *                         enum: [low, medium, high]
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: No autorizado
 */
const getInterests = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const interests = await User.getInterests(userId);
    res.status(200).json({
      message: 'Intereses obtenidos correctamente',
      interests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/interests/{iduser}:
 *   get:
 *     summary: Obtiene los intereses de un usuario específico
 *     description: Permite obtener los intereses de un usuario por su ID. Accesible solo si el usuario autenticado es el propio usuario o un guía con una relación en guide_user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: iduser
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario cuyos intereses se desean obtener
 *     responses:
 *       200:
 *         description: Intereses obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Intereses obtenidos correctamente
 *                 interests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       interest_id:
 *                         type: integer
 *                       interest_name:
 *                         type: string
 *                       priority:
 *                         type: string
 *                         enum: [low, medium, high]
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: ID de usuario inválido
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para acceder a los intereses de este usuario
 *       404:
 *         description: Usuario no encontrado
 */
const getInterestsByUserId = async (req, res, next) => {
  try {
    const { iduser } = req.params;
    const { userId, role } = req.user;

    // Validar que iduser sea un número entero
    if (!/^\d+$/.test(iduser)) {
      return res.status(400).json({ message: 'El ID de usuario debe ser un número entero' });
    }

    const interests = await User.getInterestsByUserId(parseInt(iduser), userId, role);
    res.status(200).json({
      message: 'Intereses obtenidos correctamente',
      interests,
    });
  } catch (error) {
    if (error.message.includes('Usuario no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('No autorizado')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/users/interests:
 *   post:
 *     summary: Añade un nuevo interés al usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interest_name
 *             properties:
 *               interest_name:
 *                 type: string
 *                 example: Yoga
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *     responses:
 *       201:
 *         description: Interés añadido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 interest:
 *                   type: object
 *                   properties:
 *                     interest_id:
 *                       type: integer
 *                     profile_id:
 *                       type: integer
 *                     interest_name:
 *                       type: string
 *                     priority:
 *                       type: string
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El interés ya está asociado
 *       401:
 *         description: No autorizado
 */
const addInterest = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { interest_name, priority } = req.body;

    // Validaciones
    if (!interest_name) {
      return res.status(400).json({ message: 'El nombre del interés es requerido' });
    }
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Prioridad inválida' });
    }

    const newInterest = await User.addInterest(userId, { interest_name, priority });
    res.status(201).json({
      message: 'Interés añadido correctamente',
      interest: newInterest,
    });
  } catch (error) {
    next(error);
  }

  
};

const getGuide = async (req, res, next) => {
  try {
    const { userid } = req.params;
  
    if (!/^\d+$/.test(userid)) {
        return res.status(400).json({ message: 'El ID de usuario debe ser un número entero' });
      }
    
    const guides = await User.getUserGuide(userid);

    res.status(200).json({
      message: 'Guias obtenidos correctamente',
      guides
    })
  } catch (error) {
    if (error.message.includes('Usuario no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('No autorizado')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/users/availability:
 *   put:
 *     summary: Actualiza la disponibilidad del guía autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - availability
 *             properties:
 *               availability:
 *                 type: string
 *                 example: Lunes a Viernes, 10:00-14:00
 *     responses:
 *       200:
 *         description: Disponibilidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 availability:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     availability:
 *                       type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo guías pueden actualizar disponibilidad
 */
const updateAvailability = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { availability } = req.body;

    // Validación
    if (!availability) {
      return res.status(400).json({ message: 'La disponibilidad es requerida' });
    }

    const updatedAvailability = await User.updateAvailability(userId, availability);
    res.status(200).json({
      message: 'Disponibilidad actualizada correctamente',
      availability: updatedAvailability,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getInterests,
  addInterest,
  updateAvailability,
  getInterestsByUserId,
  getGuide
};