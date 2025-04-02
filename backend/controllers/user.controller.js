const express = require('express');
const {hasRoles} = require('../authorization')
const {getAllUsers,getUserDashboard,getUserHistory,getAllBeneficiries} = require('../service/user.service')


const userController = express.Router();

userController.get(`/`,hasRoles(1),getAllUsers)
userController.get(`/dashboard`,getUserDashboard)
userController.get(`/history`,getUserHistory)
userController.get(`/beneficiries`,getAllBeneficiries)

module.exports = userController;