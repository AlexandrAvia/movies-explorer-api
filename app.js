require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');

const { PORT = 3001, MONGO = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://api.diploma93.nomoredomains.sbs',
    'https://api.diploma93.nomoredomains.sbs',
  ],
  credentials: true,
};

mongoose.connect(MONGO);

app.use(requestLogger);
app.use('*', cors(options));
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(helmet());
app.use(limiter);
app.use('/', router);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  if (!statusCode) {
    res.status(500).send({ message: 'Внутрення ошибка сервера' });
  }
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
