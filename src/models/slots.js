const mongoose=require('mongoose');
const moment=require('moment');
const venueSchema=mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    bookingDate:{
        type:Date,
        min:[moment(new Date()).add(1,"days"),"please enter valid date"],
        index:{ background:true}
    },
    slot:{
        type:String,
        enum:["Morning","Afternoon","Evening"],
        required:true
    },

    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    request:{
        type:Boolean,
        default:true
    },
    confirmation:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
})

const venuedata= new mongoose.model('slotSchema',venueSchema)

module.exports=venuedata;