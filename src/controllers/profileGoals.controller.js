const ProfileGoal = require('../models/profileGoals.model');

/**
 * @swagger
 * /api/profile-goals:
 *   get:
 *     summary: Obtiene todos los objetivos del usuario autenticado
 *     tags: [ProfileGoals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Objetivos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 goals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       goalId:
 *                         type: integer
 *                       profileId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       goalType:
 *                         type: string
 *                       description:
 *                         type: string
 *                       targetHoursWeekly:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [active, completed, paused, cancelled]
 *                       progress:
 *                         type: integer
 *                       deadline:
 *                         type: string
 *                         format: date
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: No autorizado, token inválido
 */
const getAllGoals = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const goals = await ProfileGoal.getAllByUserId(userId);
    res.status(200).json({
      message: 'Objetivos obtenidos correctamente',
      goals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/profile-goals/{iduser}:
 *   get:
 *     summary: Obtiene todos los objetivos de un usuario específico
 *     description: Permite obtener los objetivos de un usuario por su ID. Accesible solo si el usuario autenticado es el propio usuario o un guía con una relación en guide_user.
 *     tags: [ProfileGoals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: iduser
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario cuyos objetivos se desean obtener
 *     responses:
 *       200:
 *         description: Objetivos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Objetivos obtenidos correctamente
 *                 goals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       goalId:
 *                         type: integer
 *                       profileId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       goalType:
 *                         type: string
 *                       description:
 *                         type: string
 *                       targetHoursWeekly:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [active, completed, paused, cancelled]
 *                       progress:
 *                         type: integer
 *                       deadline:
 *                         type: string
 *                         format: date
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: ID de usuario inválido
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para acceder a los objetivos de este usuario
 *       404:
 *         description: Usuario no encontrado
 */
const getGoalsByUserId = async (req, res, next) => {
  try {
    const { iduser } = req.params;
    const { userId, role } = req.user;

    // Validar que iduser sea un número entero
    if (!/^\d+$/.test(iduser)) {
      return res.status(400).json({ message: 'El ID de usuario debe ser un número entero' });
    }

    const goals = await ProfileGoal.getAllByUserIdWithAuthorization(parseInt(iduser), userId, role);
    res.status(200).json({
      message: 'Objetivos obtenidos correctamente',
      goals,
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
 * /api/profile-goals/{id}:
 *   get:
 *     summary: Obtiene un objetivo específico por ID
 *     tags: [ProfileGoals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del objetivo
 *     responses:
 *       200:
 *         description: Objetivo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 goal:
 *                   type: object
 *                   properties:
 *                     goalId:
 *                       type: integer
 *                     profileId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     goalType:
 *                       type: string
 *                     description:
 *                       type: string
 *                     targetHoursWeekly:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     progress:
 *                       type: integer
 *                     deadline:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Objetivo no encontrado
 */
const getGoalById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const goalId = parseInt(req.params.id);
    const goal = await ProfileGoal.getById(goalId, userId);
    res.status(200).json({
      message: 'Objetivo obtenido correctamente',
      goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/profile-goals:
 *   post:
 *     summary: Crea un nuevo objetivo para el usuario autenticado
 *     tags: [ProfileGoals]
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
 *                 example: Mejorar organización
 *               goal_type:
 *                 type: string
 *                 example: Productividad
 *               description:
 *                 type: string
 *                 example: Crear listas de tareas diarias
 *               target_hours_weekly:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused, cancelled]
 *                 example: active
 *               progress:
 *                 type: integer
 *                 example: 0
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: 2025-07-15
 *     responses:
 *       201:
 *         description: Objetivo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 goal:
 *                   type: object
 *                   properties:
 *                     goalId:
 *                       type: integer
 *                     profileId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     goalType:
 *                       type: string
 *                     description:
 *                       type: string
 *                     targetHoursWeekly:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     progress:
 *                       type: integer
 *                     deadline:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
const createGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, goal_type, description, target_hours_weekly, status, progress, deadline } = req.body;

    // Validaciones
    if (!name) {
      return res.status(400).json({ message: 'El nombre del objetivo es requerido' });
    }
    if (target_hours_weekly && (isNaN(target_hours_weekly) || target_hours_weekly < 0)) {
      return res.status(400).json({ message: 'Horas semanales objetivo inválidas' });
    }
    if (status && !['active', 'completed', 'paused', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }
    if (progress && (isNaN(progress) || progress < 0 || progress > 100)) {
      return res.status(400).json({ message: 'Progreso inválido, debe estar entre 0 y 100' });
    }
    if (deadline && isNaN(Date.parse(deadline))) {
      return res.status(400).json({ message: 'Fecha límite inválida' });
    }

    const newGoal = await ProfileGoal.create(userId, {
      name,
      goal_type,
      description,
      target_hours_weekly,
      status,
      progress,
      deadline,
    });
    res.status(201).json({
      message: 'Objetivo creado correctamente',
      goal: {
        goalId: newGoal.goal_id,
        profileId: newGoal.profile_id,
        name: newGoal.name,
        goalType: newGoal.goal_type,
        description: newGoal.description,
        targetHoursWeekly: newGoal.target_hours_weekly,
        status: newGoal.status,
        progress: newGoal.progress,
        deadline: newGoal.deadline,
        createdAt: newGoal.created_at,
        updatedAt: newGoal.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/profile-goals/{id}:
 *   put:
 *     summary: Actualiza un objetivo existente
 *     tags: [ProfileGoals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del objetivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               goal_type:
 *                 type: string
 *               description:
 *                 type: string
 *               target_hours_weekly:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused, cancelled]
 *               progress:
 *                 type: integer
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Objetivo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 goal:
 *                   type: object
 *                   properties:
 *                     goalId:
 *                       type: integer
 *                     profileId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     goalType:
 *                       type: string
 *                     description:
 *                       type: string
 *                     targetHoursWeekly:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     progress:
 *                       type: integer
 *                     deadline:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Objetivo no encontrado
 */
const updateGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const goalId = parseInt(req.params.id);
    const { name, goal_type, description, target_hours_weekly, status, progress, deadline } = req.body;

    // Validaciones
    if (!name && !goal_type && !description && target_hours_weekly === undefined && !status && progress === undefined && !deadline) {
      return res.status(400).json({ message: 'Al menos un campo debe proporcionarse para actualizar' });
    }
    if (target_hours_weekly && (isNaN(target_hours_weekly) || target_hours_weekly < 0)) {
      return res.status(400).json({ message: 'Horas semanales objetivo inválidas' });
    }
    if (status && !['active', 'completed', 'paused', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }
    if (progress && (isNaN(progress) || progress < 0 || progress > 100)) {
      return res.status(400).json({ message: 'Progreso inválido, debe estar entre 0 y 100' });
    }
    if (deadline && isNaN(Date.parse(deadline))) {
      return res.status(400).json({ message: 'Fecha límite inválida' });
    }

    const updatedGoal = await ProfileGoal.update(goalId, userId, {
      name,
      goal_type,
      description,
      target_hours_weekly,
      status,
      progress,
      deadline,
    });
    res.status(200).json({
      message: 'Objetivo actualizado correctamente',
      goal: {
        goalId: updatedGoal.goal_id,
        profileId: updatedGoal.profile_id,
        name: updatedGoal.name,
        goalType: updatedGoal.goal_type,
        description: updatedGoal.description,
        targetHoursWeekly: updatedGoal.target_hours_weekly,
        status: updatedGoal.status,
        progress: updatedGoal.progress,
        deadline: updatedGoal.deadline,
        createdAt: updatedGoal.created_at,
        updatedAt: updatedGoal.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/profile-goals/{id}:
 *   delete:
 *     summary: Elimina un objetivo existente
 *     tags: [ProfileGoals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del objetivo
 *     responses:
 *       200:
 *         description: Objetivo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Objetivo no encontrado
 */
const deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const goalId = parseInt(req.params.id);
    await ProfileGoal.delete(goalId, userId);
    res.status(200).json({
      message: 'Objetivo eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalsByUserId,
};