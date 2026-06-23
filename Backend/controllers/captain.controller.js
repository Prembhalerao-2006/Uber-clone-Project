const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
    
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    } 
    const { fullName, email, password, vehicles } = req.body;

    const isCaptainExists = await captainModel.findOne({ email });
    if (isCaptainExists) {
        return res.status(400).json({ message: 'Captain with this email already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstName: fullName?.firstName,
        lastName: fullName?.lastName || fullName?.lastname,
        email: email,
        password: hashedPassword,
        color: vehicles?.color, 
        plate: vehicles?.plate,
        capacity: vehicles?.capacity,
        vehicleType: vehicles?.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}