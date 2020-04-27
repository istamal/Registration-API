const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const signUpRoutes = require('./api/routes/sign-up');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Controll-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use('/sign-up', signUpRoutes);

module.exports = app;
