const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    piece:{
        type:Number,
        required:true
    }
})

const serviceModel = new mongoose.model("item",serviceSchema)

module.exports = serviceModel