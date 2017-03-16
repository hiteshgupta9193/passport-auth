const express = require('express');
const router = express.Router();
const authRoutes = require('./modules/auth/auth.routes');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use('/api', router);

  router.use('/auth', authRoutes);
};