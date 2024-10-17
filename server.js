
require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cors = require("cors")
const port = process.env.PORT
const corOptions = {
    origin:"http://localhost:5173",
    methods:"GET ,POST ,PUT ,DELETE,PATCH",
    Credential:true


}
app.use(cors(corOptions))
app.use(bodyParser.urlencoded({ extended: false }))

  
app.use(bodyParser.json())
const db = require("./utils/db")
const router = require("./router/router")
const adminRoute = require("./router/adminRoute")
app.use("/api/admin/",adminRoute)
app.use("/api/auth",router)
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("hello bachcho")
})
db().then(()=>{
    app.listen(port)
})
