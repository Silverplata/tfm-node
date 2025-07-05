const Routine = require('../models/routine.model');
const pool = require('../config/db');

/**
 * @swagger
 * /api/routines:
 *   get:
 *     summary: Obtiene todas las rutinas asociadas al usuario autenticado
 *     description: Devuelve una lista de rutinas para el usuario autenticado. Para usuarios con rol 'user', devuelve sus propias rutinas. Para guías, devuelve sus propias rutinas y las de usuarios asignados (relación guide_user). Incluye actividades asociadas.
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rutinas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutinas obtenidas correctamente
 *                 routines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       routine_id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       is_template:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       start_time:
 *                         type: string
 *                         format: date-time
 *                       end_time:
 *                         type: string
 *                         format: date-time
 *                       daily_routine:
 *                         type: string
 *                         enum: [Daily, Weekly, Monthly]
 *                       activities:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             activity_id:
 *                               type: integer
 *                             activity_name:
 *                               type: string
 *                             description:
 *                               type: string
 *                               nullable: true
 *                             day_of_week:
 *                               type: string
 *                               nullable: true
 *                             start_time:
 *                               type: string
 *                               format: time
 *                               nullable: true
 *                             end_time:
 *                               type: string
 *                               format: time
 *                               nullable: true
 *                             location:
 *                               type: string
 *                               nullable: true
 *                             datetime_start:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                             datetime_end:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                             icon:
 *                               type: string
 *                               nullable: true
 *                             category:
 *                               type: object
 *                               nullable: true
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 color:
 *                                   type: string
 *       401:
 *         description: No autorizado, token inválido
 *       500:
 *         description: Error interno del servidor
 */
const getRoutines = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const routines = await Routine.getUserRoutines(userId, role);
    res.status(200).json({
      message: 'Rutinas obtenidas correctamente',
      routines,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/user/{userId}:
 *   get:
 *     summary: Obtiene las rutinas de un usuario específico
 *     description: Devuelve las rutinas asociadas a un userId específico. Solo accesible para el propio usuario o su guía (si está asignado en guide_user). Incluye actividades asociadas.
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario cuyas rutinas se desean obtener
 *     responses:
 *       200:
 *         description: Rutinas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutinas obtenidas correctamente
 *                 routines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       routine_id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       is_template:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       start_time:
 *                         type: string
 *                         format: date-time
 *                       end_time:
 *                         type: string
 *                         format: date-time
 *                       daily_routine:
 *                         type: string
 *                         enum: [Daily, Weekly, Monthly]
 *                       activities:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             activity_id:
 *                               type: integer
 *                             activity_name:
 *                               type: string
 *                             description:
 *                               type: string
 *                               nullable: true
 *                             day_of_week:
 *                               type: string
 *                               nullable: true
 *                             start_time:
 *                               type: string
 *                               format: time
 *                               nullable: true
 *                             end_time:
 *                               type: string
 *                               format: time
 *                               nullable: true
 *                             location:
 *                               type: string
 *                               nullable: true
 *                             datetime_start:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                             datetime_end:
 *                               type: string
 *                               format: date-time
 *                               nullable: true
 *                             icon:
 *                               type: string
 *                               nullable: true
 *                             category:
 *                               type: object
 *                               nullable: true
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 color:
 *                                   type: string
 *       400:
 *         description: ID de usuario inválido
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para acceder a las rutinas de este usuario
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const getRoutinesByUserId = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const { userId: targetUserId } = req.params;

    if (!/^\d+$/.test(targetUserId)) {
      return res.status(400).json({ message: 'El ID del usuario debe ser un número entero' });
    }

    // Validar autorización
    if (userId !== parseInt(targetUserId)) {
      if (role !== 'guide') {
        return res.status(403).json({ message: 'Solo los guías pueden acceder a las rutinas de otros usuarios' });
      }
      const [guideUserRows] = await pool.query(
        'SELECT user_id FROM guide_user WHERE guide_id = ? AND user_id = ?',
        [userId, targetUserId]
      );
      if (!guideUserRows[0]) {
        return res.status(403).json({ message: 'No autorizado para acceder a las rutinas de este usuario' });
      }
    }

    // Verificar que el usuario objetivo existe
    const [userRows] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [targetUserId]);
    if (!userRows[0]) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const routines = await Routine.getRoutinesByUserId(parseInt(targetUserId));
    res.status(200).json({
      message: 'Rutinas obtenidas correctamente',
      routines,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/routines:
 *   post:
 *     summary: Crea una nueva rutina para un usuario
 *     description: Permite a un usuario crear una rutina para sí mismo o a un guía crear una rutina para sí mismo o para un usuario asignado (relación guide_user). Inserta en la tabla routines.
 *     tags: [Routines]
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
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 example: 1
 *                 description: ID del usuario para quien se crea la rutina
 *               name:
 *                 type: string
 *                 example: Rutina matutina
 *               description:
 *                 type: string
 *                 example: Actividades para empezar el día
 *               is_template:
 *                 type: boolean
 *                 example: false
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-05T08:00:00Z
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-05T09:00:00Z
 *               daily_routine:
 *                 type: string
 *                 enum: [Daily, Weekly, Monthly]
 *                 example: Daily
 *     responses:
 *       201:
 *         description: Rutina creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutina creada correctamente
 *                 routine:
 *                   type: object
 *                   properties:
 *                     routine_id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_template:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                     end_time:
 *                       type: string
 *                       format: date-time
 *                     daily_routine:
 *                       type: string
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para crear rutinas para este usuario
 *       404:
 *         description: Usuario objetivo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const createRoutine = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const { targetUserId, name, description, is_template, start_time, end_time, daily_routine } = req.body;

    // Validar que el targetUserId sea un número entero
    if (!/^\d+$/.test(targetUserId)) {
      return res.status(400).json({ message: 'El ID del usuario objetivo debe ser un número entero' });
    }

    // Validar que el usuario puede crear la rutina
    if (userId !== parseInt(targetUserId)) {
      // Solo los guías pueden crear rutinas para otros usuarios
      if (role !== 'guide') {
        return res.status(403).json({ message: 'Solo los guías pueden crear rutinas para otros usuarios' });
      }
      // Verificar que el guía tiene una relación con el targetUserId
      const [guideUserRows] = await pool.query(
        'SELECT user_id FROM guide_user WHERE guide_id = ? AND user_id = ?',
        [userId, targetUserId]
      );
      if (!guideUserRows[0]) {
        return res.status(403).json({ message: 'No autorizado para crear rutinas para este usuario' });
      }
    }

    const newRoutine = await Routine.createRoutine({
      userId,
      targetUserId,
      name,
      description,
      is_template,
      start_time,
      end_time,
      daily_routine,
    });

    res.status(201).json({
      message: 'Rutina creada correctamente',
      routine: newRoutine,
    });
  } catch (error) {
    if (error.message.includes('El nombre de la rutina es obligatorio') ||
        error.message.includes('El ID del usuario objetivo es obligatorio') ||
        error.message.includes('El tipo de rutina debe ser')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('Usuario objetivo no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/{id}:
 *   put:
 *     summary: Actualiza una rutina existente
 *     description: Permite actualizar los campos de una rutina específica, como nombre, descripción o actividades asociadas. Solo accesible para el usuario propietario o su guía (si está asignado en guide_user).
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rutina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rutina matutina actualizada
 *               description:
 *                 type: string
 *                 example: Nuevas actividades para el día
 *               is_template:
 *                 type: boolean
 *                 example: false
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-05T08:30:00Z
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-05T09:30:00Z
 *               daily_routine:
 *                 type: string
 *                 enum: [Daily, Weekly, Monthly]
 *                 example: Weekly
 *     responses:
 *       200:
 *         description: Rutina actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutina actualizada correctamente
 *                 routine:
 *                   type: object
 *                   properties:
 *                     routine_id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_template:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                     end_time:
 *                       type: string
 *                       format: date-time
 *                     daily_routine:
 *                       type: string
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para actualizar esta rutina
 *       404:
 *         description: Rutina no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const updateRoutine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    const { name, description, is_template, start_time, end_time, daily_routine } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'El ID de la rutina debe ser un número entero' });
    }

    const updatedRoutine = await Routine.updateRoutine(parseInt(id), userId, role, {
      name,
      description,
      is_template,
      start_time,
      end_time,
      daily_routine,
    });

    res.status(200).json({
      message: 'Rutina actualizada correctamente',
      routine: updatedRoutine,
    });
  } catch (error) {
    if (error.message.includes('El nombre de la rutina es obligatorio') ||
        error.message.includes('El tipo de rutina debe ser') ||
        error.message.includes('No se proporcionaron campos para actualizar')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('Rutina no encontrada o no autorizada')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/{id}:
 *   delete:
 *     summary: Elimina una rutina específica
 *     description: Elimina una rutina por su ID, junto con sus actividades asociadas (en cascada). Solo accesible para el usuario propietario o su guía (si está asignado en guide_user).
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rutina
 *     responses:
 *       200:
 *         description: Rutina eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutina eliminada correctamente
 *                 routine_id:
 *                   type: integer
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para eliminar esta rutina
 *       404:
 *         description: Rutina no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const deleteRoutine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'El ID de la rutina debe ser un número entero' });
    }

    const deletedRoutine = await Routine.deleteRoutine(parseInt(id), userId, role);
    res.status(200).json({
      message: 'Rutina eliminada correctamente',
      routine_id: deletedRoutine.routine_id,
    });
  } catch (error) {
    if (error.message.includes('Rutina no encontrada o no autorizada')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/{id}:
 *   get:
 *     summary: Obtiene los detalles de una rutina específica por su ID
 *     description: Devuelve los detalles de una rutina específica, incluyendo sus actividades asociadas. Solo accesible para el usuario propietario o su guía (si está asignado en guide_user).
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rutina
 *     responses:
 *       200:
 *         description: Rutina obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutina obtenida correctamente
 *                 routine:
 *                   type: object
 *                   properties:
 *                     routine_id:
 *                       type: integer
 *                     user_id:
 *                         type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_template:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                     end_time:
 *                       type: string
 *                       format: date-time
 *                     daily_routine:
 *                       type: string
 *                       enum: [Daily, Weekly, Monthly]
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           activity_id:
 *                             type: integer
 *                           activity_name:
 *                             type: string
 *                           description:
 *                             type: string
 *                             nullable: true
 *                           day_of_week:
 *                             type: string
 *                             nullable: true
 *                           start_time:
 *                             type: string
 *                             format: time
 *                             nullable: true
 *                           end_time:
 *                             type: string
 *                             format: time
 *                             nullable: true
 *                           location:
 *                             type: string
 *                             nullable: true
 *                           datetime_start:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           datetime_end:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                           icon:
 *                             type: string
 *                             nullable: true
 *                           category:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               name:
 *                                 type: string
 *                               color:
 *                                 type: string
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para acceder a esta rutina
 *       404:
 *         description: Rutina no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const getRoutineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'El ID de la rutina debe ser un número entero' });
    }

    const routine = await Routine.getRoutineById(parseInt(id), userId, role);
    res.status(200).json({
      message: 'Rutina obtenida correctamente',
      routine,
    });
  } catch (error) {
    if (error.message.includes('Rutina no encontrada o no autorizada')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/public:
 *   get:
 *     summary: Obtiene todas las rutinas públicas (plantillas)
 *     description: Devuelve una lista de rutinas marcadas como is_template=1 que pueden ser utilizadas por otros usuarios
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rutinas públicas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutinas públicas obtenidas correctamente
 *                 routines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       routine_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       daily_routine:
 *                         type: string
 *                       shared_by:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           username:
 *                             type: string
 *                       activities:
 *                         type: array
 *                         items:
 *                           type: object
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
const getPublicRoutines = async (req, res, next) => {
  try {
    const routines = await Routine.getPublicRoutines();
    res.status(200).json({
      message: 'Rutinas públicas obtenidas correctamente',
      routines,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/create-from-template:
 *   post:
 *     summary: Crea una rutina basada en una plantilla pública
 *     description: Permite a un usuario crear una rutina personal basada en una plantilla pública (is_template=1)
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateId
 *               - start_time
 *               - end_time
 *             properties:
 *               templateId:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la rutina plantilla
 *               name:
 *                 type: string
 *                 example: Mi rutina personalizada
 *                 description: Nombre personalizado (opcional, usa el de la plantilla si no se proporciona)
 *               description:
 *                 type: string
 *                 example: Rutina adaptada a mis necesidades
 *                 description: Descripción personalizada (opcional)
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-01T08:00:00Z
 *                 description: Fecha y hora de inicio (requerido)
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-31T22:00:00Z
 *                 description: Fecha y hora de fin (requerido)
 *               daily_routine:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *                 example: daily
 *                 description: Frecuencia de la rutina (opcional, usa la de la plantilla si no se proporciona)
 *     responses:
 *       201:
 *         description: Rutina creada exitosamente desde plantilla
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutina creada desde plantilla correctamente
 *                 routine:
 *                   type: object
 *                   properties:
 *                     routine_id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     is_template:
 *                       type: boolean
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                     end_time:
 *                       type: string
 *                       format: date-time
 *                     daily_routine:
 *                       type: string
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const createRoutineFromTemplate = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { templateId, name, description, start_time, end_time, daily_routine } = req.body;

    // Validaciones
    if (!templateId || !/^\d+$/.test(templateId.toString())) {
      return res.status(400).json({ message: 'El ID de la plantilla debe ser un número entero válido' });
    }

    if (!start_time || !end_time) {
      return res.status(400).json({ message: 'Las fechas de inicio y fin son obligatorias' });
    }

    const newRoutine = await Routine.createRoutineFromTemplate(
      parseInt(templateId),
      userId,
      { name, description, start_time, end_time, daily_routine }
    );

    res.status(201).json({
      message: 'Rutina creada desde plantilla correctamente',
      routine: newRoutine,
    });
  } catch (error) {
    if (error.message.includes('Plantilla de rutina no encontrada') ||
        error.message.includes('no es pública')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Formato de fecha inválido') ||
        error.message.includes('El tipo de rutina debe ser')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/shared-by-me:
 *   get:
 *     summary: Obtiene el historial de rutinas que el usuario ha compartido
 *     description: Devuelve una lista de las rutinas que el usuario actual ha marcado como plantilla y que otros usuarios han utilizado
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de rutinas compartidas obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutinas compartidas obtenidas correctamente
 *                 shares:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       share_id:
 *                         type: integer
 *                       routine_id:
 *                         type: integer
 *                       template_name:
 *                         type: string
 *                       template_description:
 *                         type: string
 *                       shared_at:
 *                         type: string
 *                         format: date-time
 *                       shared_with:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           username:
 *                             type: string
 *                       new_routine_name:
 *                         type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
const getSharedRoutinesByUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const shares = await Routine.getSharedRoutinesByUser(userId);
    
    // Formatear la respuesta
    const formattedShares = shares.map(share => ({
      share_id: share.share_id,
      routine_id: share.routine_id,
      template_name: share.template_name,
      template_description: share.template_description,
      shared_at: share.shared_at,
      shared_with: {
        first_name: share.first_name,
        last_name: share.last_name,
        username: share.username
      },
      new_routine_name: share.new_routine_name
    }));

    res.status(200).json({
      message: 'Rutinas compartidas obtenidas correctamente',
      shares: formattedShares,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/routines/received-by-me:
 *   get:
 *     summary: Obtiene las rutinas que el usuario ha creado desde plantillas
 *     description: Devuelve una lista de las rutinas que el usuario actual ha creado basándose en plantillas de otros usuarios
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rutinas recibidas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rutinas recibidas obtenidas correctamente
 *                 received:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       share_id:
 *                         type: integer
 *                       routine_id:
 *                         type: integer
 *                       template_name:
 *                         type: string
 *                       template_description:
 *                         type: string
 *                       shared_at:
 *                         type: string
 *                         format: date-time
 *                       shared_by:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           username:
 *                             type: string
 *                       new_routine:
 *                         type: object
 *                         properties:
 *                           routine_id:
 *                             type: integer
 *                           name:
 *                             type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
const getReceivedRoutinesByUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const received = await Routine.getReceivedRoutinesByUser(userId);
    
    // Formatear la respuesta
    const formattedReceived = received.map(item => ({
      share_id: item.share_id,
      routine_id: item.routine_id,
      template_name: item.template_name,
      template_description: item.template_description,
      shared_at: item.shared_at,
      shared_by: {
        first_name: item.first_name,
        last_name: item.last_name,
        username: item.username
      },
      new_routine: {
        routine_id: item.new_routine_id,
        name: item.new_routine_name
      }
    }));

    res.status(200).json({
      message: 'Rutinas recibidas obtenidas correctamente',
      received: formattedReceived,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar la exportación para incluir los nuevos controladores
module.exports = { 
  getRoutines, 
  getRoutinesByUserId, 
  getRoutineById, 
  createRoutine, 
  updateRoutine, 
  deleteRoutine,
  getPublicRoutines,
  createRoutineFromTemplate,
  getSharedRoutinesByUser,
  getReceivedRoutinesByUser
};