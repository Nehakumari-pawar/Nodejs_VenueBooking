const bcrypt = require('bcryptjs');
const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken')
const userSchema=mongoose.Schema({

    username:{
        type:String,
        trim:true
    },

    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowerCase:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Email is Invalid!!!!!')
            }
        }

    },
    password:{
        type:String,
        required:true,
        lowerCase:true,
        trim:true,
       
    },

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    
})


userSchema.methods.generateAuthToken=async function(){
    user=this;
    const token=jwt.sign({ _id:user._id.toString()}, process.env.JWT_SECRET);
    console.log(token)
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await usersdata.findOne({ email })

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

userSchema.methods.toJSON= function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.pre('save', async function(next)
{
    const user=this
    if(user.isModified('password'))
    {
        user.password= await bcrypt.hash(user.password,8)
        console.log(user.password);
    }
    next();
})

const usersdata= new mongoose.model('usersdata',userSchema)

module.exports=usersdata;