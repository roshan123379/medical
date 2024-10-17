const jwt = require("jsonwebtoken")
const registerModel = require("../models/register")
const jwtVarification = async(req,res,next)=>{
    const token = req.header("Authorization")
    if(!token){
        res.status(400).send({msg:"token not found"})
    }
    
    if(token){
        try {
        
            const jwtToken = token.replace("Bearer","").trim()
            const jwtVarify = jwt.verify(jwtToken,process.env.SECRET)
            const userDetails =await registerModel.findOne({email:jwtVarify.email})
          
            req.user = userDetails
            req.id = userDetails._id
    
            next()
            
        } catch (error) {
            res.status(400).send({"jwt varification error":error})
        }

    }
    

    
}

module.exports = jwtVarification