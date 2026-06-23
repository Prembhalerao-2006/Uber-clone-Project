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

module.exports = router; 