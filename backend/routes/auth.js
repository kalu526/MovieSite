const express=require("express");
const router=express.Router();
const User=require("../model/user.js");
const CryptoJS=require("crypto-js");
const dotenv=require("dotenv");
const jwt=require("jsonwebtoken");
const user = require("../model/user.js");
dotenv.config();
///register
router.post("/register",async(req,res)=>{
    const newuser=new User({
        username:req.body.username,
        email:req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    })

try{
const user=await newuser.save();
res.json(user);
}catch(err){
    console.log(err);
}
})

///Login
router.post("/login",async(req,res)=>{

    try{
const user=await User.findOne({email:req.body.email});
!user && res.status(404).json("wrong username or password");
var bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
var originalText = bytes.toString(CryptoJS.enc.Utf8);
originalText !== req.body.password && res.status(404).json("wrong username or password");
const {password,...info}=user._doc;
const acessToken=jwt.sign(
    {id:user._id,isAdmin:user.isAdmin},
    process.env.SECRET_KEY,
    {expiresIn:"5d"}
)
  
res.status(200).json({...info,acessToken});
    }catch(err){
        res.status(500).json(err);
    }
})
module.exports=router;