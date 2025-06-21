const GuideUser = require('../models/guideUser.model');

/**
 * @swagger
 * /api/guide-user:
 *   post:
 *     summary: Asigna un guía a un usuario
 *     tags: [GuideUser]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guideId
 *               - userId
 *             properties:
 *               guideId:
 *                 type: integer
 *                 example: 6
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Relación guía-usuario creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 relation:
 *                   type: object
 *                   properties:
 *                     guideUserId:
 *                       type: integer
 *                     guideId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *       400:
 *         description: Error en los datos proporcionados
 *       403:
 *         description: No autorizado (solo guías pueden crear relaciones)
 *       404:
 *         description: Guía o usuario no encontrado
 *       409:
 *         description: La relación ya existe
 */
const createGuideUser = async (req, res, next) => {
  try {
    const { guideId, userId } = req.body;

    // Validaciones básicas
    if (!guideId || !userId) {
      return res.status(400).json({ message: 'guideId y userId son requeridos' });
    }

    // Verificar que el usuario autenticado es el guía
    if (req.user.userId !== guideId) {
      return res.status(403).json({ message: 'Solo puedes crear relaciones para ti mismo como guía' });
    }

    // Crear relación
    const newRelation = await GuideUser.create({ guideId, userId });

    // Respuesta exitosa
    res.status(201).json({
      message: 'Relación guía-usuario creada correctamente',
      relation: {
        guideUserId: newRelation.guideUserId,
        guideId: newRelation.guideId,
        userId: newRelation.userId,
      },
    });
  } catch (error) {
    if (error.message.includes('Usuario no encontrado') || error.message.includes('Guía no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Esta relación ya existe')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/guide-user:
 *   get:
 *     summary: Obtiene todas las relaciones guía-usuario asociadas al usuario autenticado
 *     tags: [GuideUser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relaciones obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 relations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       guide_user_id:
 *                         type: integer
 *                       guide:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           role:
 *                             type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           role:
 *                             type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: No autorizado, token inválido
 */
const getAllGuideUserRelations = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const relations = await GuideUser.getAllRelations(userId, role);
    res.status(200).json({
      message: 'Relaciones guía-usuario obtenidas correctamente',
      relations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/guide-user/{guideUserId}:
 *   get:
 *     summary: Obtiene los detalles de una relación guía-usuario específica por su ID
 *     tags: [GuideUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guideUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación guía-usuario
 *     responses:
 *       200:
 *         description: Relación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 relation:
 *                   type: object
 *                   properties:
 *                     guide_user_id:
 *                       type: integer
 *                     guide:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         role:
 *                           type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         first_name:
 *                           type: string
 *                         last_name:
 *                           type: string
 *                         role:
 *                           type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: ID inválido
 *       403:
 *         description: No autorizado para acceder a esta relación
 *       404:
 *         description: Relación no encontrada
 */
const getGuideUserRelationById = async (req, res, next) => {
  try {
    const { guideUserId } = req.params;
    const { userId, role } = req.user;

    // Validar que guideUserId sea un número entero
    if (!/^\d+$/.test(guideUserId)) {
      return res.status(400).json({ message: 'El ID de la relación debe ser un número entero' });
    }

    const relation = await GuideUser.getRelationById(parseInt(guideUserId), userId, role);
    res.status(200).json({
      message: 'Relación guía-usuario obtenida correctamente',
      relation,
    });
  } catch (error) {
    if (error.message.includes('Relación no encontrada o no autorizada')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/guide-user/{guideUserId}:
 *   delete:
 *     summary: Elimina una relación guía-usuario específica por su ID
 *     tags: [GuideUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guideUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación guía-usuario
 *     responses:
 *       200:
 *         description: Relación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 guideUserId:
 *                   type: integer
 *       400:
 *         description: ID inválido
 *       403:
 *         description: No autorizado para eliminar esta relación
 *       404:
 *         description: Relación no encontrada
 */
const deleteGuideUserRelation = async (req, res, next) => {
  try {
    const { guideUserId } = req.params;
    const { userId, role } = req.user;

    // Validar que guideUserId sea un número entero
    if (!/^\d+$/.test(guideUserId)) {
      return res.status(400).json({ message: 'El ID de la relación debe ser un número entero' });
    }

    const result = await GuideUser.deleteRelation(parseInt(guideUserId), userId, role);
    res.status(200).json({
      message: 'Relación guía-usuario eliminada correctamente',
      guideUserId: result.guideUserId,
    });
  } catch (error) {
    if (error.message.includes('Relación no encontrada o no autorizada')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createGuideUser,
  getAllGuideUserRelations,
  getGuideUserRelationById,
  deleteGuideUserRelation,
};