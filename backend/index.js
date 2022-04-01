const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const authrouter=require("./routes/auth.js");
const userrouter=require("./routes/users.js")
const movierouter=require("./routes/movies.js")
const listrouter=require("./routes/lists.js")
const app=express();
app.use(express.json());
app.use(cors());
dotenv.config();
//connectting database
mongoose.connect("mongodb+srv://kalu:siykal8892@nodejs.py4ld.mongodb.net/moviedb?retryWrites=true&w=majority",{
useNewUrlParser:true,
useUnifiedTopology:true,
}).then(()=>console.log("database connected successfully")).catch((err)=>console.log(err))

app.use('/api/auth',authrouter)
app.use('/api/user',userrouter)
app.use('/api/movie',movierouter)
app.use('/api/list',listrouter)

//listining to the server
app.listen(8000,()=>{
    console.log("app listening on Port 8000");
})