const jwt=require("jsonwebtoken")
const dotenv=require("dotenv");

dotenv.config();

function verify(req,res,next){
      
    const authHeader=req.headers.token;
    if( authHeader){
     const token=authHeader.split(" ")[1];
     jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err)
        res.status(403).json("Token is not Valid");
        req.user=user;
        next();
     });
     }else{
        res.status(401).json("unauthorized user");
    }
}
module.exports=verify;