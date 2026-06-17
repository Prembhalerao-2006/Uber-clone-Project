const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName: {
        fistName: {
            type: String,
            required: true,
            minlength: [2, "First name should be at least 2 characters long"]
        },
        lastName: {
            type: String,
            required: true,
            minlength: [2, "Last name should be at least 2 characters long"]
        }
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email should be at least 5 characters long"],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
    return token;
}

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.static.hashPassword = async function(password) {
    return await bcrypt.hash(password, salt);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;