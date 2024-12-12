var express = require('express');
var product=require('../models/product');
const { response } = require('../app');
var router = express.Router();


router.get("/products",(req,res)=>{
   product.find({})
   .then((docs)=>res.send(docs))
   .catch((err)=>console.log(err))
})
router.get("/getmaxproducts",(req,res)=>{
  const{price}=req.query;
  product.find({productPrice:{$gt:price}})
  .then((docs)=>res.send(docs))
  .catch((err)=>console.log(err))
})
router.get("/getproducts",(req,res)=>{
  const{minprice,maxprice}=req.query;
  product.find({productPrice:{$gt:maxprice,$lt:minprice}})
  .then((docs)=>res.send(docs))
  .catch((err)=>console.log(err))
})
//pagination
router.get("/pagination",(req,res)=>{
   const{page,limitnum}=req.query;
   const skipnum=(page-1)*limitnum;
   product.find({}).skip(skipnum).limit(limitnum)
   .then((docs)=>res.send(docs))
   .catch((err)=>console.log(err))
})
router.post("/add",(req,res)=>{
  var newproduct=new product(req.body);
  newproduct.save()
  .then(()=>{res.send({status:'success',response:newproduct})})
  .catch((err)=>{console.log(err)})
})
router.get("/addmany",(req,res)=>{
  product.insertMany(req.body)
  .then((result)=>res.send({status:"added successfully",response:result}))
  .catch((err)=>console.log(err))
})
router.get("/products/:id",(req,res)=>{
  product.findOne({productId:req.params.id})
  .then((docs)=>res.send(docs))
   .catch((err)=>console.log(err))
})
router.get("/search",(req,res)=>{
  const{name}=req.query;
  product.find({productName:new RegExp(name,'i')})
  .then((docs)=>res.send(docs))
  .catch((err)=>console.log(err))
})
router.delete("/delete/:id",(req,res)=>{
  product.findByIdAndDelete(req.params.id)
  .then(()=>res.send("deleted successfully"))
   .catch((err)=>console.log(err))

})
router.put('/update/:id',(req,res)=>{
  product.findByIdAndUpdate(req.params.id,req.body)
  .then(()=>{res.send("updated successfully")})
  .catch((err)=>{console.log(err)})
})

module.exports = router;
