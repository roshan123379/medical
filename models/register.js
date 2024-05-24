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