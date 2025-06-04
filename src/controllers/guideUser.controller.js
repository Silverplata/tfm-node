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
 *                 example: 7
 *               userId:
 *                 type: integer
 *                 example: 8
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
    next(error);
  }
};

module.exports = { createGuideUser };