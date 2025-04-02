const express = require('express');
const {hasRoles} = require('../authorization')
const transactionController = express.Router();

const {fundTransfer} = require('../service/transaction.service')

transactionController.post(`/fund-transfer`, hasRoles(2), fundTransfer);

module.exports = transactionController;