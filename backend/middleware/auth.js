const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    // Get Token From Header
    const token = req.header('x-auth-token');

    // Check if there is a token or not
    if(!token){
        res.status(400).json({ msg: 'No Token. Authorization Failed!' });
    }
    
    try {
        const decode = jwt.verify(token, config.get("jwtSecret"));

        req.user = decode.user;
        next();
    } catch (err) {
        res.status(400).json({ msg: 'No Token. Authorization Failed!', errors: err });
    }
}