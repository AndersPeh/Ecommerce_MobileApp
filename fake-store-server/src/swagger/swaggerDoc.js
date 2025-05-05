const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fake Store Server API",
      version: "1.0.0",
      description: "This is a sample server for a fake store.",
    },
  },
  // Path to the API docs
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
