const express = require("express")
const router = express.Router()

const {home,register,login,service,userData,contact, updatePassById,updateAddress,order,getOrderData ,otp, otpVerify,forgetPassword, GoogleLogin,clientId} = require("../controller/route-controller")
const jwtVarification = require("../middleware/jwtVarify")

router.route("/").get(home)
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/service").get(service)
router.route("/userData").get(jwtVarification,userData)
router.route("/contact").post(contact)
router.route("/profile/password").patch(jwtVarification,updatePassById)
router.route("/profile/address").patch(jwtVarification,updateAddress)
router.route("/order").patch(jwtVarification,order)
router.route("/orderData").get(jwtVarification,getOrderData)

router.route("/otp").post(otp)
router.route("/otpverify").post(otpVerify)
router.route("/forgetpassword").patch(forgetPassword)
router.route("/googlelogin").post(GoogleLogin)
router.route("/client").get(clientId)

module.exports = router