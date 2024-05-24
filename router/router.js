const express = require("express")
const router = express.Router()

const {home,register,login,service,userData,contact} = require("../controller/route-controller")
const jwtVarification = require("../middleware/jwtVarify")

router.route("/").get(home)
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/service").get(service)
router.route("/userData").get(jwtVarification,userData)
router.route("/contact").post(contact)
module.exports = router