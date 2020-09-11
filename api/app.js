/*
TechDegree project 9: REST API
Author: Gerardo Bilbatua
createdOn: 08/19/2020
*/

'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const UserRoutes = require('./routes/UserRoutes');
const CourseRoutes = require('./routes/CourseRoutes')
const cors = require('cors');
const fetch = require('node-fetch')

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

//CORS middleware
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//Set up JSON middlware
app.use(express.json());

//Welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// TODO setup your api routes here
app.use('/api',UserRoutes);
app.use('/api',CourseRoutes);


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});



// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
