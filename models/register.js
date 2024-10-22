const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")


const registerSchema = new mongoose.Schema({
    sub:{
        type:String,
    },
    picture:{
        type:String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    addressLine1: {
        type: String,
        default: "Please Add the Address"

    },
    addressLine2: {
        type: String,
        default: ""
    },
    addressLine3: {
        type: String,
        default: ""
    },

    addressLine4: {
        type: String,
        default: ""
    },

    addressLine5: {
        type: Number,
        default: null
    },

    addressLine6: {
        type: String,
        default: ""
    },

    addressLine7: {
        type: Number,
        default: null
    },
    orders: [{

        "name": {
            type: String,
            default:""

        },

        "price": {
            type: Number,
            default:0

        },
        "orderDate": {
            type: Date,
            default: Date.now
        },
        "img": {
            type: String,
            default:""
        },
        "piece":{
            type:String
    
        }
    }]

})

registerSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin

        }, process.env.SECRET, {
            expiresIn: "30d"
        })
    } catch (error) {
        console.log("token error", error)
    }
}
const registerModel = new mongoose.model("register", registerSchema)

module.exports = registerModel