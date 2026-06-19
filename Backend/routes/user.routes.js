const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controllers");

router.post('/register', [
    body('email').isEmail().withMessage('invalid Email'),
    body().custom(value => {
        const name = value.fullName || value.fullname;
        const firstName = name?.firstName || name?.firstname;

        if (!firstName || firstName.length < 2) {
            throw new Error('First name must be at least 2 characters long');
        }
        return true;
    }),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    userController.registerUser
])

router.post('/login', [
    body('email').isEmail().withMessage('invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    userController.loginUser
])

module.exports = router;