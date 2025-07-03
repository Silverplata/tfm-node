const express = require('express');
const cors = require('cors');
const cron = require('node-cron')
const nodemailer = require('nodemailer')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const path = require('path');
const Goal = require('../src/models/profileGoals.model');

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde /uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background-color: #4682B4; }',
  customSiteTitle: 'Planificador API - Documentación',
}));

// Route configuration
app.use('/api', require('./routes/api.routes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

cron.schedule('* * * * *', async () => {
  try {
    const goals = await Goal.getReminders();
    console.log(goals)
    if (!Array.isArray(goals) || goals.length === 0) {
      return;
    }

    for (const goal of goals) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Recordatorio de objetivo',
        text: `Buenos días!
        No olvides tu objetivo: ${goal.name} con fecha límite ${goal.deadline}`
      });
    }

    // Actualizar estado de recordatorio
    await Goal.updateReminders(goals.map(goal => goal.goal_id));
  } catch (error) {
    console.log(error)
  }
});
    
module.exports = app;