const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstName, lastName, email, password,
    color, plate, capacity, vehicleType
}) => {
    if (!firstName || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('Missing required fields');
    }

    const captain = await captainModel.create({
        fullname: { firstName, lastName },
        email,
        password,
        vehicles: {
            color,
            plate,
            capacity,
            vehicleType
        }
    })
    return captain;
}
