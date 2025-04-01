const express = require('express');

const {getAllUsers} = require('../service/user.service')


const userController = express.Router();

userController.get(`/`,getAllUsers)

module.exports = userController;