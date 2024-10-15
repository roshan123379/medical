const registerModel = require("../models/register")
const serviceModel = require("../models/service")
const contactModel = require("../models/contact-model")
const bcrypt = require("bcryptjs")

const home = async (req, res) => {
    res.send("hello api home")
}
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const userExist = await registerModel.findOne({ email })
        if (userExist) {
            res.status(400).send({ msg: "user already exist" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const userCreate = await registerModel.create({ username, email, password: hashPassword })
        if (userCreate) {
            res.status(200).send({ msg: "user created successfully", Token: await userCreate.generateToken(), userId: userCreate._id.toString() })
        }
    } catch (error) {
        console.log("register error", error)
    }

}



const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExists = await registerModel.findOne({ email })
        console.log(userExists)
        if (!userExists) {
            res.status(400).send({ msg: "please register first" })
        }
        if (userExists) {
            const comparePasword = await bcrypt.compare(password, userExists.password)
            if (comparePasword) {
                res.status(200).json({ msg: "you are successfully login into my website", Token: await userExists.generateToken(), userId: userExists._id.toString() })
            }

        }
    } catch (error) {
        console.log("login eror", error)
    }



}

const service = async (req, res) => {
    try {
        const serviceData = await serviceModel.find()
        
        res.status(200).send({ msg: serviceData })
        if (!serviceData) {
            res.status(400).send({ msg: "data not found" })
        }
    } catch (error) {
        console.log("service error", error)
    }

}

const userData = async (req, res) => {
    try {
        const Data = req.user
        console.log(Data._id)
        req.id = Data._id
        res.status(200).send({ Data })

    } catch (error) {
        console.log("user Data error", error)
        res.status(400).send({ msg: "user data error" })
    }

}
const contact = async (req, res) => {
    try {
        const { username, email, message } = req.body

        await contactModel.create({ username, email, message })

        return res.status(200).json({ msg: "contact submitted" })


    } catch (error) {
        return res.status(400).json({ msg: "not contact submitted" })

    }
}
const updatePassById = async (req, res) => {
    try {

        const user = req.user

        const id = user._id
        const { password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const updatedPass = await registerModel.updateOne({ _id: id }, { $set: { password: hashPassword } })

        return res.status(200).json(updatedPass)
    } catch (error) {
        console.log("update pass ", error)
    }
}
const updateAddress = async (req, res) => {
    try {
        const user = req.user
        const id = user._id
        const { addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, addressLine6, addressLine7 } = req.body
        const updateAddress = await registerModel.updateOne({ _id: id }, { $set: { addressLine1: addressLine1, addressLine2: addressLine2, addressLine3: addressLine3, addressLine4: addressLine4, addressLine5: addressLine5, addressLine6: addressLine6, addressLine7: addressLine7 } })


        return res.status(200).json(updateAddress)
    } catch (error) {
        console.log("address update error", error)
    }
}

const order = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const { orders } = req.body;

        const orderData = await registerModel.updateOne(
            { _id: id },
            { $push: { orders: { $each: orders } } }
        );

        if (orderData.modifiedCount > 0 ) {
            res.status(200).json({ msg: "Order updated successfully" });
        
        } else {
            res.status(400).json({ msg: "Failed to find the order to update." });
        }
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const getOrderData = async (req, res) => {
    try {
        const user = req.user; 
        const id = user._id;

        const orderData = await registerModel.findById(id, 'orders'); 

        if (orderData && orderData.orders.length > 0) {
            const reverseOrderDatas = orderData.orders.reverse(); +
            res.status(200).json({ reverseOrderDatas });
        } else {
            res.status(404).json({ msg: "No orders found for this user" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const otpArray = []

const otp = async (req, res) => {
    const { email } = req.body;

    const user = await registerModel.findOne({ email });
  
    if (user) {
        let otp = "";
        for (let i = 0; i < 6; i++) {
            otp += Math.floor(Math.random() * 10);
        }

        otpArray.unshift(otp)
       
        
        
        return res.status(200).json({ msg: "OTP generated successfully", email: email,otp:otp });
    } else {
        return res.status(400).json({ msg: "User not found for password" });
    }
};


const otpVerify = (req, res) => {
    const { otp: userOtp } = req.body; 
    const generatedOtp = otpArray[0];

    if (userOtp === generatedOtp) {
        return res.status(200).json({ msg: "OTP verified successfully" });
    } else {
        return res.status(400).json({ msg: "Invalid OTP" });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const {email,password} = req.body
        
        const hashPassword = await bcrypt.hash(password, 10)
        const updatedPass = await registerModel.updateOne({email: email }, { $set: { password: hashPassword } })

        return res.status(200).json(updatedPass)
    } catch (error) {
        console.log("update pass ", error)
    }
}
module.exports = { home, register, login, service, userData, contact, updatePassById, updateAddress, order, getOrderData  ,otp,otpVerify,forgetPassword}