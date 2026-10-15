const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  try {
    const headers = req.headers.authorization;
    
    if (headers) {
      if (!headers.startsWith("Bearer")) {
        return res.status(403).json({
          message: "forbidden",
        });
      }
    }
    if(!headers){
      return res.status(401).json({
        message:"unauthorized"
      })
    }

    const token = headers.split(" ")[1];
    

    const isToken = jwt.verify(token, process.env.JWT_SECRET);

   
  
    req.user ={userId: isToken.userId};
    next();
  } catch (err) {
   return res.status(401).json({
        message:"unauthorized"
      })
  }
}
module.exports = authMiddleware;
