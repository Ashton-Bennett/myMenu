const logger = require("./logger");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Inaccurate endpoint" });
  } else if (error.name === "Mongoose Validation Error") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).redirect("/");
};

const verifyToken = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: "Token missing" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return response
        .status(403)
        .json({ error: "Token invalid, please login" });
    }
    request.user = user;
    next();
  });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  verifyToken,
};
