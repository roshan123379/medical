const registerModel = require("../models/register")
const serviceModel = require("../models/service")
const contactModel =require("../models/contact-model")
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
        console.log(serviceData)
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
        console.log(Data)
        res.status(200).send({ Data })
    } catch (error) {
        console.log("user Data error", error)
        res.status(400).send({msg:"user data error"})
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

module.exports = { home, register, login, service, userData,contact }