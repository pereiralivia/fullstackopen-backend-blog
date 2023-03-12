const config = require('./utils/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const middleware = require('./middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) =>
    logger.error('error connecting to MongoDB: ', error.message)
  );

const requestHandler = (request, response, next) => {
  console.log('method: ', request.method);
  console.log('authorization: ', request.get('authorization'));
  next();
};

app.use(requestHandler);
app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', middleware.tokenExtractor, blogsRouter);
app.use(middleware.unknownEndpoints);
app.use(middleware.errorHandler);

module.exports = app;

