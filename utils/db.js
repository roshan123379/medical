const mongoose = require("mongoose")
const uri = process.env.URL

const connection = async()=>{
    try {
       const connect =  await mongoose.connect(uri)
       if(connect){
        console.log("sucessfull")
       }
    } catch (error) {
        console.log("connection error",error)
    }
    
    
}

module.exports = connection