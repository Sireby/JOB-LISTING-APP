const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const { JWT_SECRET, JWT_EXPIRY } = process.env;






//Token generator
exports.createToken = (id) => {
    return jwt.sign(
        {id}, 
        JWT_SECRET, 
        { expiresIn : JWT_EXPIRY }
    )
};

//Authorize users
exports.auth = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return res.status(403).json({
            message: "Not logged In",
        });
    }
    const userJWTData = await jwt.verify(token, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
      });
      const user = await User.findById(userJWTData.id);
    
      req.user = user;
      next();
};


exports.checkUser = (...roles) => {
    return async (req, res, next) => {
    if (!req.user.role.includes(...roles)) {
        return res.status(401).json({
        message: "You are not authorized to do this",
        });
    }
    next();
    };
};

