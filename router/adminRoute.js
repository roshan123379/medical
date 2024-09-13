const express = require("express")
const adminRoute = express.Router()
const {adminUsers,deleteUserById,getUserById,updateUserById,adminProducts,deleteProductById} = require("../controller/admin-controller")


adminRoute.route("/users").get(adminUsers)
adminRoute.route("/users/:id").get(getUserById)
adminRoute.route("/users/delete/:id").delete(deleteUserById)
adminRoute.route("/users/update/:id").patch(updateUserById)


adminRoute.route("/products").get(adminProducts)
adminRoute.route("/products/delete/:id").delete(deleteProductById)


module.exports = adminRoute