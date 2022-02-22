const mongoose=require('mongoose');
const venuedata = require('./slots');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const validator=require('validator');
const adminSchema=mongoose.Schema({

username:{
    type:String,
    required:true
},

venueName:{
    type:String,
   // required:true
},

email:{
    type:String,
    required:true,
    unique:true,
    validate(value){
        if(!validator.isEmail(value))
        {
            throw new Error('Email is Invalid!!!!!')
        }
    }
},
password:{
    type:String,
    required:true
},

venuedata:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'venue'
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}]


})


adminSchema.methods.generateAuthToken=async function(){
    admin=this;
    const token=jwt.sign({ _id:admin._id.toString()}, process.env.JWT_ADMIN_SECRET);
    console.log(token)
    admin.tokens=admin.tokens.concat({token})
    await admin.save();
    return token
}


adminSchema.statics.findByCredentials = async (email, password) => {
    const user = await admindata.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

adminSchema.methods.toJSON= function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


adminSchema.pre('save', async function(next)
{
    const user=this
    if(user.isModified('password'))
    {
        user.password= await bcrypt.hash(user.password,8)
        console.log(user.password);
    }
    next();
})


const admindata= new mongoose.model('adminSchema',adminSchema)

module.exports=admindata;