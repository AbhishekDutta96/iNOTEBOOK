const jwt = require("jsonwebtoken");
const JWT_SECRET = "Abhishekisagoodb$oy";

const fetchUser = (req, res, next) => {
    // Get the user from jwt token and add id to the user object
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error: 'Please authenticate using a valid token'})
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }catch(err){
        console.log(err);
        res.status(401).send({error: 'Please authenticate using a valid token'})
    }
}

module.exports = fetchUser;