const Routine = require('../models/routine.model');

/**
 * @swagger
 * /api/routines:
 *   get:
 *     summary: Obtiene todas las rutinas asociadas al usuario autenticado
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

/**
 * @swagger
 * /api/routines/{id}:
 *   get:
 *     summary: Obtiene los detalles de una rutina específica por su ID
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
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para acceder a esta rutina
 *       404:
 *         description: Rutina no encontrada
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

const getRoutineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Validar que el ID sea un número entero
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

module.exports = { getRoutines, getRoutineById };