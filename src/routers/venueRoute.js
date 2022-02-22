const express= require('express');
const router=express.Router();
const venuedata=require('../models/venue');
const auth=require('../middleware/auth');
const User=require('../models/users');
const venueSchema=require('../models/slots')

// route for creating the venue
router.post('/venue/creatingVenue', async (req,res)=>{

    try{
        const data=new venuedata(
            req.body,
           
        )
        console.log(data)
        await data.save()

        res.status(201).send('venue created successfully')
    }
   catch(err){
       res.status(401).send(err)
       console.log("your error:",err)
  
   }


})

//route for finding the slots based on date
router.get('/venue', async (req,res)=>{
    const date=req.body
    try{
        const finddate= await venuedata.find(date)
        console.log(finddate)
        if(finddate.length < 1)
        {
           return res.send('no slots!!!')
        }
        res.send(finddate)
    }
   
   catch(error){
      res.status(401).send(error)
       console.log('this is the error msg',error)
  }


})


//route for booking a slot
router.post('/venue/venueslotbooking', async(req,res) =>
{
    const {bookingDate, name, reqslot} = req.body;
    console.log('bookingdate:',bookingDate)
    try{
        const booking= await venueSchema.find({bookingDate});

        const isBooked=booking.some((booking)=> booking.slot === req.slot);

        if(!isBooked)
        {
            const newBooking= new venueSchema({
                bookingDate,
                name,
                slot:reqslot
            });
            await newBooking.save();
            res.status(201).send(newBooking);

        }
        else{
            res.status(406).send(`${reqslot} is already booked`);
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Error:" +err.message)
    }
});






//route for booking a slot

//router.post('/venue/slotbooking',auth, async (req,res)=>{
    
//    const { date,name,slots}= req.body
//    const bookingDate=new Date(date)
//    console.log(bookingDate,'and ',date,' and', name)
//    try{
//        const booking= await venuedata.findOne({slots})
//    console.log('booking:',booking)

 //   const book= await User.find({})
//    console.log(book)
 //  book.forEach((slot) => 
 //  {
 //    slot.bookedSlot.push(booking)
     
 //     slot.save()
//   })
       
//        console.log(book.bookedSlot);
//        res.status(201).send(book)
        
 //   }
 //  catch(e){
  //       res.status(404).send(e)
  //       console.log(e)
//    }

//})




//route for Modify the slot data

router.patch('/venue/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'date']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const booked = await venuedata.findById({ _id: req.params.id, owner: req.user._id})
      console.log(req.params.id ,'and',req.user._id)
      console.log(booked)
        if (!booked) {
            return res.status(404).send()
        }

        updates.forEach((update) => booked[update] = req.body[update])
        await booked.save()
        res.send(booked)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})





// route for displaying all the slots
router.get('/venue',  async (req, res) => {
   
    try {
        const bookedDetails = await venuedata.find({ })
        console.log(bookedDetails)
        if (!bookedDetails) {
            return res.status(404).send()
        }

        res.send(bookedDetails)
    } catch (e) {
        res.status(500).send()

    }
})

//route for deleting the slot
router.delete('/venue/:id',auth,  async (req, res) => {

    const id = req.params.id

    try {

        const slot = await venuedata.findByIdAndDelete(id);
        await slot.save()
        res.send('slot removed successfully!!!!!!')

    } catch (error) {
        res.status(404).send(error)
    }
})
module.exports=router;