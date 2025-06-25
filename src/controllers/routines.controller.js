const Routine = require('../models/routine.model');
const pool = require('../config/db'); // Importar pool

/**
 * @swagger
 * /api/routines:
 *   get:
 *     summary: Obtiene todas las rutinas asociadas al usuario autenticado
 *     description: Devuelve una lista de rutinas para el usuario autenticado, ya sea como usuario (sus propias rutinas) o como guía (rutinas de usuarios asignados). Incluye actividades asociadas.
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
 * /api/routines:
 *   post:
 *     summary: Crea una nueva rutina para un usuario
 *     description: Permite a un usuario crear una rutina para sí mismo o a un guía crear una rutina para un usuario asignado. Inserta en la tabla routines.
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
 *     description: Permite actualizar los campos de una rutina específica, como nombre, descripción o actividades asociadas. Solo accesible para el usuario propietario o su guía.
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
 *     description: Elimina una rutina por su ID, junto con sus actividades asociadas (en cascada). Solo accesible para el usuario propietario o su guía.
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
 *     description: Devuelve los detalles de una rutina específica, incluyendo sus actividades asociadas. Solo accesible para el usuario propietario o su guía.
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

module.exports = { getRoutines, getRoutineById, createRoutine, updateRoutine, deleteRoutine };