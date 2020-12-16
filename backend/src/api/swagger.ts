import { notesPath } from './open_api/notes.swagger';

export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'MarkdownNotes API',
    contact: {
      name: 'Geison Biazus',
      email: 'geisonbiazus@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000/',
      description: 'Local',
    },
    {
      url: 'https://api.notes.geisonbiazus.com/',
      description: 'Production',
    },
  ],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: { ...notesPath },
};
