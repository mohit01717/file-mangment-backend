const userModel = require("../models/user.model");

async function adminMiddleware(req,res,next){
    try{
        const {userId} = req.user;
       
        const user = await userModel.findById(userId);
        if(!user){
           return res.status(401).json({
                message:"user not found"
            })
        }

        if(user.role!=="admin"){
            return res.status(403).json({
                message:"forbidden"
            })
        }
       next()

    }
    catch(err){
       res.status(403).json({
                message:"unauthorized"
            })
    }
}
module.exports =adminMiddleware