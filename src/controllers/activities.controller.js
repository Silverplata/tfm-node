const Activity = require('../models/activities.model');

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Obtiene todas las actividades asociadas al usuario autenticado
 *     description: Devuelve una lista de actividades para el usuario autenticado, ya sea como usuario (sus propias actividades) o como guía (actividades de usuarios asignados). Incluye información de rutinas y categorías asociadas.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actividades obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Actividades obtenidas correctamente
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       activity_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       day_of_week:
 *                         type: string
 *                         nullable: true
 *                       start_time:
 *                         type: string
 *                         format: time
 *                         nullable: true
 *                       end_time:
 *                         type: string
 *                         format: time
 *                         nullable: true
 *                       location:
 *                         type: string
 *                         nullable: true
 *                       datetime_start:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       datetime_end:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       icon:
 *                         type: string
 *                         nullable: true
 *                       routine_name:
 *                         type: string
 *                         nullable: true
 *                       category_name:
 *                         type: string
 *                         nullable: true
 *                       category_color:
 *                         type: string
 *                         nullable: true
 *       401:
 *         description: No autorizado, token inválido
 *       500:
 *         description: Error interno del servidor
 */
const getAll = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const activities = await Activity.selectAll(userId, role);
    res.status(200).json({
      message: 'Actividades obtenidas correctamente',
      activities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/activities/{activityId}:
 *   get:
 *     summary: Obtiene una actividad específica por su ID
 *     description: Devuelve los detalles de una actividad específica, incluyendo información de la rutina y categoría asociadas. Solo accesible para el usuario propietario o su guía.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Actividad obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Actividad obtenida correctamente
 *                 activity:
 *                   type: object
 *                   properties:
 *                     activity_id:
 *                       type: integer
 *                     routine_id:
 *                       type: integer
 *                     category_id:
 *                       type: integer
 *                       nullable: true
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                       nullable: true
 *                     day_of_week:
 *                       type: string
 *                       nullable: true
 *                     start_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                     end_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                     location:
 *                       type: string
 *                       nullable: true
 *                     datetime_start:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     datetime_end:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     icon:
 *                       type: string
 *                       nullable: true
 *                     routine_name:
 *                       type: string
 *                       nullable: true
 *                     category_name:
 *                       type: string
 *                       nullable: true
 *                     category_color:
 *                       type: string
 *                       nullable: true
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para acceder a esta actividad
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const getById = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { userId, role } = req.user;

    if (!/^\d+$/.test(activityId)) {
      return res.status(400).json({ message: 'El ID de la actividad debe ser un número entero' });
    }

    const activity = await Activity.selectById(parseInt(activityId), userId, role);
    if (!activity) {
      return res.status(404).json({ message: 'Actividad no encontrada o no autorizada' });
    }
    res.status(200).json({
      message: 'Actividad obtenida correctamente',
      activity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Crea una nueva actividad
 *     description: Permite crear una actividad asociada a una rutina. Solo accesible para el usuario propietario de la rutina o su guía.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routine_id
 *               - title
 *             properties:
 *               routine_id:
 *                 type: integer
 *                 example: 1
 *               category_id:
 *                 type: integer
 *                 example: 3
 *                 nullable: true
 *               title:
 *                 type: string
 *                 example: Yoga matutino
 *               description:
 *                 type: string
 *                 example: Sesión de yoga para relajación
 *               day_of_week:
 *                 type: string
 *                 example: Lunes
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: 08:00:00
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: 09:00:00
 *               location:
 *                 type: string
 *                 example: Sala de yoga
 *               datetime_start:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-05T08:00:00Z
 *               datetime_end:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-05T09:00:00Z
 *               icon:
 *                 type: string
 *                 example: yoga
 *     responses:
 *       201:
 *         description: Actividad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Actividad creada correctamente
 *                 activity:
 *                   type: object
 *                   properties:
 *                     activity_id:
 *                       type: integer
 *                     routine_id:
 *                       type: integer
 *                     category_id:
 *                       type: integer
 *                       nullable: true
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                       nullable: true
 *                     day_of_week:
 *                       type: string
 *                       nullable: true
 *                     start_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                     end_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                     location:
 *                       type: string
 *                       nullable: true
 *                     datetime_start:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     datetime_end:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     icon:
 *                       type: string
 *                       nullable: true
 *                     routine_name:
 *                       type: string
 *                       nullable: true
 *                     category_name:
 *                       type: string
 *                       nullable: true
 *                     category_color:
 *                       type: string
 *                       nullable: true
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para crear actividades en esta rutina
 *       404:
 *         description: Rutina o categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const create = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const { routine_id, category_id, title, description, day_of_week, start_time, end_time, location, datetime_start, datetime_end, icon } = req.body;

    if (!routine_id || !title) {
      return res.status(400).json({ message: 'El ID de la rutina y el título son obligatorios' });
    }

    const result = await Activity.insert({
      routine_id,
      category_id,
      title,
      description,
      day_of_week,
      start_time,
      end_time,
      location,
      datetime_start,
      datetime_end,
      icon,
    }, userId, role);

    const activity = await Activity.selectById(result.insertId, userId, role);
    res.status(201).json({
      message: 'Actividad creada correctamente',
      activity,
    });
  } catch (error) {
    if (error.message.includes('No autorizado') || error.message.includes('Categoría no encontrada')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/activities/{activityId}:
 *   put:
 *     summary: Actualiza una actividad existente
 *     description: Permite actualizar los campos de una actividad específica. Solo accesible para el usuario propietario de la rutina o su guía.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routine_id
 *               - title
 *             properties:
 *               routine_id:
 *                 type: integer
 *                 example: 1
 *               category_id:
 *                 type: integer
 *                 example: 3
 *                 nullable: true
 *               title:
 *                 type: string
 *                 example: Yoga matutino actualizado
 *               description:
 *                 type: string
 *                 example: Sesión de yoga extendida
 *               day_of_week:
 *                 type: string
 *                 example: Martes
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: 08:30:00
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: 09:30:00
 *               location:
 *                 type: string
 *                 example: Sala de yoga 2
 *               datetime_start:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-06T08:30:00Z
 *               datetime_end:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-06T09:30:00Z
 *               icon:
 *                 type: string
 *                 example: yoga_updated
 *     responses:
 *       200:
 *         description: Actividad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Actividad actualizada correctamente
 *                 activity:
 *                   type: object
 *                   properties:
 *                     activity_id:
 *                       type: integer
 *                     routine_id:
 *                       type: integer
 *                     category_id:
 *                       type: integer
 *                       nullable: true
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                       nullable: true
 *                     day_of_week:
 *                       type: string
 *                       nullable: true
 *                     start_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                     end_time:
 *                       type: string
 *                       format: time
 *                       nullable: true
 *                     location:
 *                       type: string
 *                       nullable: true
 *                     datetime_start:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     datetime_end:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     icon:
 *                       type: string
 *                       nullable: true
 *                     routine_name:
 *                       type: string
 *                       nullable: true
 *                     category_name:
 *                       type: string
 *                       nullable: true
 *                     category_color:
 *                       type: string
 *                       nullable: true
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para actualizar esta actividad
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const edit = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { userId, role } = req.user;
    const { routine_id, category_id, title, description, day_of_week, start_time, end_time, location, datetime_start, datetime_end, icon } = req.body;

    if (!/^\d+$/.test(activityId)) {
      return res.status(400).json({ message: 'El ID de la actividad debe ser un número entero' });
    }
    if (!routine_id || !title) {
      return res.status(400).json({ message: 'El ID de la rutina y el título son obligatorios' });
    }

    await Activity.updateById(parseInt(activityId), {
      routine_id,
      category_id,
      title,
      description,
      day_of_week,
      start_time,
      end_time,
      location,
      datetime_start,
      datetime_end,
      icon,
    }, userId, role);

    const activity = await Activity.selectById(parseInt(activityId), userId, role);
    res.status(200).json({
      message: 'Actividad actualizada correctamente',
      activity,
    });
  } catch (error) {
    if (error.message.includes('No autorizado') || error.message.includes('Categoría no encontrada')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/activities/{activityId}:
 *   delete:
 *     summary: Elimina una actividad específica
 *     description: Elimina una actividad por su ID. Solo accesible para el usuario propietario de la rutina o su guía.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Actividad eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Actividad eliminada correctamente
 *                 activity_id:
 *                   type: integer
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado, token inválido
 *       403:
 *         description: No autorizado para eliminar esta actividad
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const remove = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { userId, role } = req.user;

    if (!/^\d+$/.test(activityId)) {
      return res.status(400).json({ message: 'El ID de la actividad debe ser un número entero' });
    }

    const activity = await Activity.selectById(parseInt(activityId), userId, role);
    if (!activity) {
      return res.status(404).json({ message: 'Actividad no encontrada o no autorizada' });
    }

    await Activity.deleteById(parseInt(activityId), userId, role);
    res.status(200).json({
      message: 'Actividad eliminada correctamente',
      activity_id: parseInt(activityId),
    });
  } catch (error) {
    if (error.message.includes('No autorizado')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = { getAll, getById, create, edit, remove };