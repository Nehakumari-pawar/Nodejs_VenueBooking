const express= require('express');
const router=express.Router();
const usersdata=require('../models/users');
const auth=require('../middleware/auth');


//for registering the user

router.post('/users',async (req,res)=>{
    try{
        const user= await new usersdata(req.body);
        console.log(user);
        const token= await user.generateAuthToken()
        user.save();
        res.status(201).send({user,token});
    }catch(e) 
    {
      res.status(400).send(e);
    }
    
})

//router for login purpose
router.post('/users/login', async (req, res) => {
    try {
        const user = await usersdata.findByCredentials(req.body.email, req.body.password)
        console.log(req.body.email,req.body.passworrd)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e);
        res.status(400).send()
    }
})


// for logout purpose
router.get('/users/logout', auth, async(req,res) =>{
    try{
      req.usersdata.tokens=req.usersdata.tokens.filter((token) =>
      {
          return token.token !== req.token
      })
      await req.usersdata.save()
      res.send()
    }
    catch(e){
        res.status(500).send()    
    }
})









module.exports=router;
