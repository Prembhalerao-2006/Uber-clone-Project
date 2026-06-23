const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Normalize incoming body keys so clients sending misspelled/lowercased keys still work
function normalizeCaptainBody(req, res, next) {
    // fullname -> fullName
    if (req.body.fullname && !req.body.fullName) {
        req.body.fullName = req.body.fullname;
    }

    // vehical -> vehicles
    if (req.body.vehical && !req.body.vehicles) {
        req.body.vehicles = req.body.vehical;
    }

    // inside vehicles: vehicalType -> vehicleType
    if (req.body.vehicles) {
        if (req.body.vehicles.vehicalType && !req.body.vehicles.vehicleType) {
            req.body.vehicles.vehicleType = req.body.vehicles.vehicalType;
        }
        // also accept lowercase 'lastname' inside fullName handled in controller
    }

    // common alternate keys for login/register
    if (!req.body.email) {
        if (req.body.Email) req.body.email = req.body.Email;
        else if (req.body.emailAddress) req.body.email = req.body.emailAddress;
        else if (req.body.username) req.body.email = req.body.username;
    }
    if (!req.body.password) {
        if (req.body.Password) req.body.password = req.body.Password;
        else if (req.body.pass) req.body.password = req.body.pass;
    }

    next();
}

router.post('/register', normalizeCaptainBody, [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicles.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicles.plate').notEmpty().withMessage('Vehicle plate number is required'),
    body('vehicles.capacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicles.vehicleType').isIn(['car', 'motorcycle', 'auto-rickshaw']).withMessage('Vehicle type must be either car, motorcycle, or auto-rickshaw')
], 
       captainController.registerCaptain
);

router.post('/login', normalizeCaptainBody, [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
], 
       captainController.loginCaptain
);

module.exports = router; 