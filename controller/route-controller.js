const registerModel = require("../models/register")
const serviceModel = require("../models/service")
const contactModel = require("../models/contact-model")
const bcrypt = require("bcryptjs")
const { OAuth2Client } = require('google-auth-library');
const mongoose = require("mongoose")

const home = async (req, res) => {
    res.send("hello api home")
}
const register = async (req, res) => {

    try {
        const { name, email, password } = req.body
        const userExist = await registerModel.findOne({ email })
        if (userExist) {
            return res.status(400).send({ msg: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const userCreate = await registerModel.create({ name, email, password: hashPassword })
        if (userCreate) {
            res.status(200).send({ msg: "user created successfully", Token: await userCreate.generateToken(), userId: userCreate._id.toString(), name: userCreate.name, email: userCreate.email })
        }
    } catch (error) {
        console.log("register error", error)
    }

}



const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExists = await registerModel.findOne({ email })
        if (!userExists) {
            res.status(400).send({ msg: "please register first" })
        }
        if (userExists) {
            const comparePasword = await bcrypt.compare(password, userExists.password)
            if (comparePasword) {
                res.status(200).json({ msg: "you are successfully login into my website", Token: await userExists.generateToken(), userId: userExists._id.toString(), name: userExists.name, email: userExists.email })
            }

        }
    } catch (error) {
        console.log("login eror", error)
    }



}
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const GoogleLogin = async (req, res) => {
    const { token } = req.body

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        const userExist = await registerModel.findOne({ email })
        if (userExist) {
            res.status(200).send({ msg: "Login successfully", Token: await userExist.generateToken(), userId: userExist._id.toString(), name: userExist.name, email: userExist.email })
        }
        if (!userExist) {
            const userCreate = await registerModel.create({ sub, name, email, picture })
            if (userCreate) {
                res.status(200).send({ msg: "user created successfully", Token: await userCreate.generateToken(), userId: userCreate._id.toString(), name: userCreate.name, email: userCreate.email })
            }


        }
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid Token', error });
    }


}

const clientId = (req, res) => {

    res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID });
}

const service = async (req, res) => {
    try {
        const { categories } = req.body;

        const serviceData = await serviceModel.aggregate([
            {
                $match: {
                    category: { $in: categories.map(cat => new RegExp(cat, 'i')) }
                }
            }
        ]);

        if (serviceData.length === 0) {
            return res.status(404).send({ msg: "No data found" });
        }
        res.status(200).send({
            msg: serviceData,
        });
    } catch (error) {
        console.log("service error", error);
        res.status(500).send({ msg: "Server error" });
    }
};
const service2 = async (req, res) => {
    try {
        const { category, name } = req.body;

        const serviceData = await serviceModel.find({
            $or: [
                { "category": { $regex: category, $options: "i" } },
                { "name": { $regex: name, $options: "i" } }
            ]
        });

        if (serviceData.length === 0) {
            return res.status(404).send({ msg: "No data found" });
        }
        res.status(200).send({
            msg: serviceData,
        });
    } catch (error) {
        console.log("service error", error);
        res.status(500).send({ msg: "Server error" });
    }
};





const userData = async (req, res) => {
    try {
        const Data = req.user
        res.status(200).send({ Data })

    } catch (error) {
        console.log("user Data error", error)
        res.status(400).send({ msg: "user data error" })
    }

}
const contact = async (req, res) => {
    try {
        const { name, email, message } = req.body

        await contactModel.create({ name, email, message })

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

        if (orderData.modifiedCount > 0) {
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
            const reverseOrderDatas = orderData.orders.reverse(); 
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



        return res.status(200).json({ msg: "OTP generated successfully", email: email, otp: otp });
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
        const { email, password } = req.body

        const hashPassword = await bcrypt.hash(password, 10)
        const updatedPass = await registerModel.updateOne({ email: email }, { $set: { password: hashPassword } })

        return res.status(200).json(updatedPass)
    } catch (error) {
        console.log("update pass ", error)
    }
}

const productInfo = async (req, res) => {
    try {
        const id = req.body
        const productInfo = await serviceModel.findOne({ _id: id })
        res.status(200).json({ productInfo })
    } catch (error) {
        console.log("product info error ", error)

    }
}
module.exports = { home, register, login, service,service2, userData, contact, updatePassById, updateAddress, order, getOrderData, otp, otpVerify, forgetPassword, GoogleLogin, clientId, productInfo }