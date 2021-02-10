const express = require('express')
const { signup } = require('../controllers/userAuthController')

const authRouter = express.Router()

authRouter.route('/signup').post(signup)

module.exports = authRouter