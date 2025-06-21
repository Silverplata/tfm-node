const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const path = require('path');

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

module.exports = app;