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

//router for showing individual profile
router.get('/users/me',auth, async (req,res)=>
{
    res.send(req.user)
} )

    


// for login purpose
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



//router for getting all the data

router.get('/users',async (req,res) =>{
    try{
        const allUsersRecord=await usersdata.find({})
        res.send(allUsersRecord)
    }
    catch(e){
        res.status(400).send(e)
        
    }
     
})

//router for updating the data
router.patch('/users/:id',auth, async(req,res) =>{
    _id=req.body.id;
    const updates=Object.keys(req.body);
    const allowedUpdate=['name','email','password'];
    const isValidOperation= updates.every((update)=> allowedUpdate.includes(update))

    if(!isValidOperation)
    {
        return res.status(400).send({error: 'Invalid update!!!!' })
    }
    try{
 
        const updateUser= await usersdata.findByIdAndUpadate(_id,req.body,{
            new:true
        })
 if(!user)
 {
     return res.status(404).send()
 }
        res.send(updateUser)
    }
    catch(e){
        res.status(501).send(e)

    }
})

//for deleting data

router.delete('/users/:id',auth, async(req,res)=>{
    _id=req.params.id;
    try{
        const deleteUser= await usersdata.findByIdAndDelete(_id)
        res.send(deleteUser);
    }
    catch(e){
        res.status(401).send(e)
    }
})

module.exports=router;