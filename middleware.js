const config = require('./utils/config');
const logger = require('./utils/logger');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const unknownEndpoints = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).send({ error: 'invalid token' });
  }
  request.token = authorization.replace('Bearer ', '');
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);

  const userId = decodedToken.id;

  if (!userId) {
    return response.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(userId);
  request.user = user;
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  unknownEndpoints,
  tokenExtractor,
  userExtractor,
  errorHandler
};

