const express = require("express")
const userrouter = require("./router/userrouter.js")
const taskrouter = require("./router/taskrouter.js")

const app = express()
app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(" server is listening on "+port)
})

