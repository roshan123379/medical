const registerModel = require("../models/register")
const mongoose = require("mongoose");
const adminUsers = async(req,res)=>{
   try {
    const users = await registerModel.find({},{password:0})
    if(!users || users.length===0){
        return res.status(400).json({msg:"user not found"})
    }
    return res.status(200).send({users})
    
   } catch (error) {
    console.log("adminUser",error)
   }
}
const deleteUserById = async(req,res)=>{
    try {
        const id = req.params.id;
        console.log("id",id)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        await registerModel.deleteOne({ _id: id });
        return res.status(200).json({msg:"user deleted successfully"})
    } catch (error) {
        console.log("delete errr",error)
    }
}
const getUserById = async(req,res)=>{
    try {
        const id = req.params.id;
        console.log("id",id)
       
        const editUserData = await registerModel.findOne({ _id: id },{password:0});
        return res.status(200).json(editUserData)
    } catch (error) {
        console.log("delete errr",error)
    }
}
const updateUserById = async(req,res)=>{
    try {
        const id = req.params.id
        const updatedUserData = req.body
        const updatedUser = await registerModel.updateOne({_id:id},{$set:updatedUserData})
        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log("update user",error)
    }
}

module.exports = {adminUsers,deleteUserById,getUserById,updateUserById}