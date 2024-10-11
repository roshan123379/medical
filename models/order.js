const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    "name":{
        type:String,

    },

    "price":{
        type:Number,

    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    img:{
        type:String,
    }
})
const orderSchema = new mongoose.Schema({
    "items":[itemSchema]
})
const orderModel = new mongoose.model("order",orderSchema)

module.exports = orderModel