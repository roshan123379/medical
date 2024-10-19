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
    img:[
        {
            img:{
                type:String
            }
        }
        

    ],
    price:{
        type:String,
        required:true
    },
    piece:{
        type:Number,
        required:true
    },
    category:{
        type:String
    }

})

const serviceModel = new mongoose.model("item",serviceSchema)

module.exports = serviceModel