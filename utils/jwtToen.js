const jwt = require("jsonwebtoken");

function getToken(data) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    
  
    return jwt.sign(data, jwtSecretKey);
}

function vrifyToken(token, next){
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode)=>{
        if(err){
            return false;
        }
        return decode;
    })
}
  
 module.exports = {
    getToken,
    vrifyToken
};