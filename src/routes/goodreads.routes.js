
const goodreadsController = require('../controllers/goodreads.controller');

const express = require('express');
var goodreadsRouter = express.Router(); 

goodreadsRouter.get('/goodreads_auth', goodreadsController.goodreads_auth);
goodreadsRouter.get('/goodreads_callback', goodreadsController.goodreads_callback);

module.exports = goodreadsRouter;