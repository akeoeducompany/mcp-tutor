import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Coding Tutor API',
      version: '1.0.0',
      description: 'API documentation for the AI Coding Tutor application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
      },
    ],
  },
  apis: ['./src/api/v1/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 