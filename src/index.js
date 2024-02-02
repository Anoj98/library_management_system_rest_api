require('./configs/db');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const accessControl = require('./middlewares/access-control');
const errorMiddleware = require('./middlewares/errors');

const app = express();

// parse application/json
app.use(bodyParser.json());

// configuring for cors error
app.use(accessControl);

app.use(routes);
app.use(errorMiddleware);

module.exports = app;
