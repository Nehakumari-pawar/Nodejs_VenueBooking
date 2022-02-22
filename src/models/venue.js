const mongoose=require('mongoose');
const venue=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        //required:true,
        default:Date.now
    },
    
    slots:{
        type:Array,
        required:true,
        default:["Morning","Afternoon","Evening"]
        
    }    
    ,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'usersdata'
    }
},{timestamps: true})

const venueModel=new mongoose.model('venue',venue);

module.exports=venueModel