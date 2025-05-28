const GuideUser = require('../models/guideUser.model');

const guideUserController = {
  async createGuideUser(req, res, next) {
    try {
      const { guideId, userId } = req.body;

      // Validaciones básicas
      if (!guideId || !userId) {
        return res.status(400).json({ message: 'guideId and userId are required' });
      }

      // Crear relación
      const newRelation = await GuideUser.create({ guideId, userId });

      // Respuesta exitosa
      res.status(201).json({
        message: 'Guide-user relationship created successfully',
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