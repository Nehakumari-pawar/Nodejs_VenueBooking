const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true
}).then(()=>{
    console.log("connection successfull")
}).catch((error)=>{
    console.log("Something went wrong!!!",error)
})
