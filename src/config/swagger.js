const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Planificador para Neurodivergentes API',
      version: '1.0.0',
      description: 'API REST para una aplicación planificadora diseñada para personas con TDAH, TEA y otras neurodivergencias, con soporte para usuarios y guías.',
      contact: {
        name: 'Soporte API',
        email: 'soporte@planificador.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/api/*.js', './src/controllers/*.js'], // Ajusta según la ubicación de tus rutas/controladores
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;