//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const ejs = require("ejs");

console.log(process.env.SECRET);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true ,useFindAndModify:true })

const userSchema = new mongoose.Schema ({
  email:String,
  password: String
})

const secret = process.env.SECRET
userSchema.plugin(encrypt,{secret:secret,encryptedFields: ['password']})

const User = new mongoose.model("User",userSchema)


app.get("/",function(req,res){
  res.render("home")
})

app.get("/register",function(req,res){
  res.render("register")
})


app.get("/login",function(req,res){
  res.render("login")
})

app.post("/register",function(req,res){
  const user = new User({
    email:req.body.username,
    password:req.body.password
  })

  user.save(function(err){
    if(!err){
        res.render("secrets")
    }else{
      console.log(err);
    }
  })
})

app.post("/login",function(req,res){
  const username = req.body.username
  const password = req.body.password

  User.findOne({email:username},function(err,result){
    if(err){
      console.log(err);
    }else{
      if(result.password===password){
        res.render("secrets")
      }
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
