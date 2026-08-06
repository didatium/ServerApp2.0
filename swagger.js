require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CMM Backend API',
    description: 'API Contract'
  },
  host: 'localhost:' + process.env.PORT,
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const routesFiles = ['./index.js']; // Điền file đầu vào chứa toàn bộ router của bạn
swaggerAutogen(outputFile, routesFiles, doc);
