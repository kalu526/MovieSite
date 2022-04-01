const express=require("express");
const router=express.Router();
const CryptoJS=require("crypto-js");
const User=require("../model/user.js");
const verify=require("../verifyToken.js");

//Update
router.put('/:id',verify ,async(req,res)=>{
    if(req.user.id ===req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
        }
        try{
     const updatedUser=await User.findOneAndUpdate(req.params.id,{$set:req.body,},{new:true});
     res.status(200).json(updatedUser);
        }catch(err){
      res.status(500).json(err);
        }
    }else {
        res.status(403).json("you can only update your account");
      
    }

})
//Delete
router.delete('/:id',verify ,async(req,res)=>{
    if(req.user.id ===req.params.id || req.user.isAdmin){
        
        try{
    await User.findByIdAndDelete(req.params.id);
     res.status(200).json("Deleted Succefully");
        }catch(err){
      res.status(500).json(err);
        }
    }else {
        res.status(403).json("you can only Delete your account");
      
    }

})
//Get 
router.get('/find/:id',async(req,res)=>{
   
        
        try{
    const user=await User.findById(req.params.id);
    const {password,...info}=user._doc;
     res.status(200).json(info);
        }catch(err){
      res.status(500).json(err);
        }
})
//Get All
router.get('/',verify ,async(req,res)=>{
    const query=req.query.new;
    if( req.user.isAdmin){
        try{
    const user=query ? await User.find().sort({ _id:-1}).limit(2):await User.find();
     res.status(200).json(user);
        }catch(err){
      res.status(500).json(err);
        }
    }else {
        res.status(403).json("you have no access to get all user");
      
    }

})
//Get user statistics
router.get('/stats',async(req,res)=>{
    const today=new Date();
    const lastyear=today.setFullYear(today.setFullYear()-1);

    const monthArray=[
        "January",
        "February",
        "March",
        "Aprill",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    try{
  const data=await User.aggregate([
      {
         $project:{
             month:{$month:"$createdAt"},
         } 
      },{
          $group:{
              _id:"$month",
              total:{$sum:1}
          }
      }
    ])
    res.status(200).json(data);
    }catch(err){
        res.status(500).json(err)
    }
})
module.exports=router;