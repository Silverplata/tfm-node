// src/controllers/guideUser.controller.js
const GuideUser = require('../models/guideUser.model');

const guideUserController = {
  async createGuideUser(req, res, next) {
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
          userId: newRelation.userId
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = guideUserController;