const express = require('express');

const {registerUser, login} = require('../service/auth.service')


const authController = express.Router();

authController.post(`/register`,registerUser)
authController.post(`/login`,login)

module.exports = authController;