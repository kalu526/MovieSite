const express=require("express");
const router=express.Router();
const Movie=require("../model/movie.js");
const verify=require("../verifyToken.js");

//Create Movie
router.post('/',verify ,async(req,res)=>{
    if(req.user.isAdmin){
       const newmovie=new Movie(req.body)
       try{
      const savedmovie=await newmovie.save();
      res.status(200).json(savedmovie);
       } catch(err){
           res.status(200).json(err)
       }
    }else {
        res.status(403).json("you can only update your account");
      
    }

})

//Update Movie
router.put('/:id',verify ,async(req,res)=>{
    if(req.user.isAdmin){
       
       try{
      const updatedmovie=await Movie.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
      res.status(200).json(updatedmovie);
       } catch(err){
           res.status(200).json(err)
       }
    }else {
        res.status(403).json("you can only update your account");
      
    }

})

//Delete Movie
router.delete('/:id',verify ,async(req,res)=>{
    if(req.user.isAdmin){
       
       try{
      await Movie.findByIdAndDelete(req.params.id)
      res.status(200).json("The Movie Have been deleted");
       } catch(err){
           res.status(200).json(err)
       }
    }else {
        res.status(403).json("you can only update your account");
      
    }

})

//Get Specific Movie
router.get('/find/:id',verify ,async(req,res)=>{
   
       try{
      const movie=await Movie.findById(req.params.id)
      res.status(200).json(movie);
       } catch(err){
           res.status(200).json(err)
       }
    })

    //GetRandom Movie
router.get('/random',verify ,async(req,res)=>{
   const type=req.query.type;
   let movie;
    try{
  if(type== "series"){
      movie=await Movie.aggregate([
          {$match:{isSeries:true}},
          {$sample:{size:1}},
      ])
  }
  else{
    movie=await Movie.aggregate([
        {$match:{isSeries:false}},
        {$sample:{size:1}},
    ]) 
  }
  res.status(200).json(movie);
    } catch(err){
        res.status(200).json(err)
    }
 })

 //Get All Movie
router.get('/',verify ,async(req,res)=>{
    if(req.user.isAdmin){
       
       try{
      const movie=await Movie.find()
      res.status(200).json(movie.reverse());
       } catch(err){
           res.status(200).json(err)
       }
    }else {
        res.status(403).json("you can only update your account");
      
    }

})

module.exports=router;