const express= require('express');
const router=express.Router();
const admindata=require('../models/admin');
const venuedata=require('../models/venue');
const venueSchema=require('../models/slots')
const adminAuth=require('../middleware/adminAuth')


// for admin registartion purpose
router.post('/admin',async(req,res) =>{

    try{
        const admin= await new admindata(req.body);
        console.log(admin);
        const token= await admin.generateAuthToken()
        admin.save();
        res.status(201).send({admin , token});
    }catch(e) 
    {
      res.status(400).send(e);
      console.log("this error generated:",e)
    }
    
})

// for admin login purpose
router.post('/admin/login', async (req, res) => {
    try {
        const admin = await usersdata.findByCredentials(req.body.email, req.body.password)
        //console.log(req.body.email,req.body.passworrd)
        const token = await admin.generateAuthToken()
        res.send({admin , token})
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
})

//based on the venue name slots data will be shown to the admin
router.get('/admin/bookedslots',adminAuth, async (req,res)=>{
    const name=req.body
    try{
        const findVenueBookedDetails= await venueSchema.find(name)
        console.log(findVenueBookedDetails)
        if(name.length < 1)
        {
           return res.send('no slots booked for this venue!!!')
        }
        res.send(findVenueBookedDetails)
    }
   
   catch(error){
      res.status(401).send(error)
       console.log('this is the error msg',error)
  }


})

// for slot approval by admin

router.patch('/admin/approval/:id',adminAuth, async(req,res) =>{
    
    try{
        const approve= await venueSchema.findByIdAndUpdate(req.params.id ,{confirmation:true},{ new:true})
        await approve.save();
        if(!approve)
        {
            return res.send('something wenr wrong')
        }
       // res.send(approvedRequest)
        res.send(approve)
    }
   
    catch(err){
        res.status(401).send(err)
        console.log("approval error:",err)
    }
})


// for slot rejection by admin
router.patch('/admin/reject/:id',adminAuth, async(req,res) =>{
    
    try{
        const reject= await venueSchema.findByIdAndUpdate(req.params.id ,{request:true},{ new:true})
        await reject.save();
        if(!reject)
        {
            return res.send('something wenr wrong')
        }
    
        res.send(reject)
    }
   
    catch(err){
        res.status(401).send(err)
        console.log("rejection error:",err)
    }
})



module.exports=router