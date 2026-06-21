const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");


module.exports.authUser = async (req, res, next) => {
   const token = req.cookies.token || req.headers.authorization?.split(' ')[1] ;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Unauthorized.' });
    }
    //
    try {
        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }
    } catch (err) {
        console.error('[auth] blacklist check failed:', err && err.message);
        // continue - blacklist check failure shouldn't block valid tokens by default
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
    
        req.user = user;
         
        return next();
    }
    catch(error) {
    
        return res.status(401).json({ message: 'Unauthorized.' });
    }
}