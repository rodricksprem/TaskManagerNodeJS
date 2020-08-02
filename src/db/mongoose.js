const validator = require("validator")
const mongoose = require("mongoose")
const User = require("../model/user.js")
const Task = require("../model/task.js")



 const me = new User({
    name:"Rodricks",
    age: 43,
    email: "rodricks.premkumar@gmail.com",
    password: 'rodricks@123'
})
me.save().then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log("error ",error)
})  
/* const devtask = new Task({
    description:"ETMDeployment",
    completed: false,
    password: 'rodricks@123'
}) */
const testtask = new Task({
    description:"ETMTesting",
    completed: false
})
testtask.save().then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log("error ",error)
})
 