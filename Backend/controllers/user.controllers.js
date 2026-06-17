const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");


module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    const { fullName, fullname, email, password } = req.body;
    const name = fullName || fullname;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: name?.firstName || name?.firstname,
        lastname: name?.lastName || name?.lastname,
        email: email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });

}