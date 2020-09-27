import express from 'express';

const apiroutes = express.Router();

apiroutes.use('/user', require('./user.js'));
apiroutes.use('/doc', require('./doc.js'));

module.exports=apiroutes;