const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const secret = "ROSHANYOUAREAWESOME"

const registerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    addressLine1:{
        type:String,
        default:"Please Add the Address"
        
    },
    addressLine2:{
        type:String,
        default:""
    },
    addressLine3:{
        type:String,
        default:""
    },

    addressLine4:{
        type:String,
        default:""
    },

    addressLine5:{
        type:Number,
        default:""
    },

    addressLine6:{
        type:String,
        default:""
    },

    addressLine7:{
        type:Number,
        default:""
    }

    
})

registerSchema.methods.generateToken=async function(){
    try {
        return jwt.sign({
            userId:this._id.toString(),
            email:this.email,
            isAdmin:this.isAdmin
            
        },secret,{
            expiresIn:"30d"
        })
    } catch (error) {
        console.log("token error",error)
    }
}
const registerModel = new mongoose.model("register",registerSchema)

module.exports = registerModel