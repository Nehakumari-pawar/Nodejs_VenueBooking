const mongoose=require('mongoose');
const venue=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    
    slots:{
        type:String,
        required:true,
        
    }    
    ,
    
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usersdata'
    }
},{timestamps: true})

const venueModel=new mongoose.model('venue',venue);

module.exports=venueModel