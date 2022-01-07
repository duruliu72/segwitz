const express = require('express');
var cors = require('cors');
const sales = require('../routes/sales');
const error = require('../middleware/error');
module.exports = function(app) {
    app.use(cors())
    app.use(express.json());
    app.use('/api/sales', sales);
    app.use(error);
  }