const Category = require('../models/category.model');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtiene todas las categorías de actividades disponibles
 *     description: Devuelve una lista de todas las categorías almacenadas en la base de datos, útil para filtros en la interfaz de usuario.
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categorías obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categorías obtenidas correctamente
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                         nullable: true
 *                       name:
 *                         type: string
 *                       color:
 *                         type: string
 *                         nullable: true
 *                       icon:
 *                         type: string
 *                         nullable: true
 *                       descripction:
 *                         type: string
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: No autorizado, token inválido
 *       500:
 *         description: Error del servidor
 */
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json({
      message: 'Categorías obtenidas correctamente',
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crea una nueva categoría de actividades
 *     description: Permite a un guía crear una nueva categoría para organizar actividades, como "Mindfulness" o "Sensorial".
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mindfulness
 *               color:
 *                 type: string
 *                 example: '#4682B4'
 *               icon:
 *                 type: string
 *                 example: meditation
 *               description:
 *                 type: string
 *                 example: Actividades para reducir el estrés
 *     responses:
 *       201:
 *         description: Categoría creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría creada correctamente
 *                 category:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     color:
 *                       type: string
 *                       nullable: true
 *                     icon:
 *                       type: string
 *                       nullable: true
 *                     descripction:
 *                       type: string
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Solo los guías pueden crear categorías
 *       409:
 *         description: La categoría ya existe
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon, description } = req.body;
    const userId = req.user.userId;

    const newCategory = await Category.createCategory({
      userId,
      name,
      color,
      icon,
      description
    });

    res.status(201).json({
      message: 'Categoría creada correctamente',
      category: newCategory
    });
  } catch (error) {
    if (error.message.includes('El nombre de la categoría es obligatorio') ||
        error.message.includes('El color debe ser un código hexadecimal válido')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('Solo los guías pueden crear categorías')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('La categoría ya existe')) {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = { getAllCategories, createCategory };