const express=require("express");
const router=express.Router();
const List=require("../model/list.js");
const verify=require("../verifyToken.js");

//Create Movie
router.post('/',verify ,async(req,res)=>{
    if(req.user.isAdmin){
       const newlist=new List(req.body)
       try{
      const savedlist=await newlist.save();
      res.status(200).json(savedlist);
       } catch(err){
           res.status(200).json(err)
       }
    }else {
        res.status(403).json("you can only update your account");
      
    }

})

//Delete Movie
router.post('/:id',verify ,async(req,res)=>{
    if(req.user.isAdmin){
       
       try{
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("The List Has Been Deleted");
       } catch(err){
           res.status(200).json(err)
       }
    }else {
        res.status(403).json("you can only update your account");
      
    }

})

//Get
router.get('/',verify,async(req,res)=>{
    const typeQuery=req.query.type;
    const generQuery=req.query.gener;
    let list=[];

    try{
   if(typeQuery){
       if(generQuery){
           list=await List.aggregate([
               {$sample:{size:10}},
               {$match:{type:typeQuery,gener:generQuery}},
           ])
       }else{
           list=await List.aggregate([
            {$sample:{size:10}},
            {$match:{type:typeQuery}}, 
           ])
       }
   }else{
       list=await List.aggregate([{$sample:{size:10}}])
   }
   res.status(200).json(list);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router;