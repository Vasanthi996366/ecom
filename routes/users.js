var express = require('express');
var User=require('../models/user ');
var bcrypt=require('bcryptjs');
const { response } = require('../app');
var router = express.Router();
var jwt=require('jsonwebtoken')
require('dotenv').config();

router.post('/registration',(req,res)=>{
  User.findOne({username:req.body.username})
  .then( async(dbuser)=>{
    if(dbuser!=null){
      res.send({status:"user already existed"})
    }
    else{
      console.log(dbuser)
      var newuser=new User({
        username:req.body.username,
        password:await bcrypt.hash(req.body.password,10),
        phone:req.body.phone,
        email:req.body.email,
        role:req.body.role
      })
      newuser.save()
      .then((result)=>{res.send({status:"user registered successfully",response:result})})
      .catch((err)=>console.log(err));

    }
  })
  .catch((err)=>console.log(err));
})




router.post("/login",(req,res)=>{
  User.findOne({username:req.body.username })
  .then(async (dbuser)=>{
    if(dbuser!=null){
      if(await bcrypt.compare(req.body.password,dbuser.password))
      {
        const token=jwt.sign({username:dbuser.username},process.env.JWT_Secret,{expiresIn:'1h'})
        res.send({status:"login successful", jwttoken:token,response:dbuser})
      }
      else{
        res.send({status:"inavalid username or password"})
      }
    }
    else{
      res.send({ status:"user not found"})
    }
  })
  .catch((err)=>res.send({status:"something went wrong"}))
})

module.exports = router;
