const jwt = require("jsonwebtoken")
const registerModel = require("../models/register")
const jwtVarification = async(req,res,next)=>{
    const token = req.header("Authorization")
    if(!token){
        res.status(400).send({msg:"token not found"})
    }
    const jwtToken = token.replace("Bearer","").trim()
    console.log(jwtToken)

    try {
        const jwtVarify = jwt.verify(jwtToken,process.env.SECRET)
        console.log(jwtVarify)

        const userDetails =await registerModel.findOne({email:jwtVarify.email})
        console.log(userDetails)
        req.user = userDetails
        req.id = userDetails._id

        next()
    } catch (error) {
        console.log("jwt varification error",error)
    }
}

module.exports = jwtVarification