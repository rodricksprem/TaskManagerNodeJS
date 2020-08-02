const express = require("express")
const User = require("./model/user.js")
const Task = require("./model/task.js")
const { ObjectID } = require("mongodb")


const app = express()
app.use(express.json())
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(" server is listening on "+port)
})
app.post("/users", async (request,response)=>{
    const user = new User(request.body)
   try{
        await user.save()
        response.status(201).send(user)
    }catch(error){
        console.log("error ",error)
        response.status(400).send(error)
    }
})

app.get("/users", async (request,response)=>{
    try{
        const result =await User.find({})
        response.status(200).send(result)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})
app.get("/users/:id", async (request,response)=>{
    const _id = request.params.id; // mongoose cast to ObjectID automatically
    try{
        const user =await User.findById(_id)
        response.status(200).send(user)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})

app.patch("/users/:id", async (request,response)=>{
    const updateKeys = Object.keys(request.body)
    const allowedUpdate = ['name','age','email','password']
    const isValidUpdate = updateKeys.every((updateKey)=> allowedUpdate.includes(updateKey))
    if(!isValidUpdate){
        return response.status(500).send({error:"invalid columns"})
        
    }
    try{
        const user =await User.findByIdAndUpdate(request.params.id,request.body,{new:true,runValidators:true})
        if(!user){
            return response.status(404).send()
        }
        response.send(user)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})

app.post("/tasks", async (request,response)=>{
    const task = new Task(request.body)
   try{
        await task.save()
        response.status(201).send(task)
    }catch(error){
        console.log("error ",error)
        response.status(400).send(error)
    }
})

app.delete("/users/:id", async (request,response)=>{
    
    try{
        const user =await User.findByIdAndDelete(request.params.id)
        if(!user){
            return response.status(404).send()
        }
        response.send(user)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})

app.get("/tasks", async (request,response)=>{
    try{
        const result =await Task.find({})
        response.status(200).send(result)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})
app.get("/tasks/:id", async (request,response)=>{
    const _id = request.params.id; // mongoose cast to ObjectID automatically
    try{
        const task =await Task.findById(_id)
        response.status(200).send(task)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})



app.patch("/tasks/:id", async (request,response)=>{
    const updateKeys = Object.keys(request.body)
    const allowedUpdate = ['description','completed']
    const isValidUpdate = updateKeys.every((updateKey)=> allowedUpdate.includes(updateKey))
    if(!isValidUpdate){
        return response.status(500).send({error:"invalid columns"})
        
    }
    
    try{
        const task =await Task.findByIdAndUpdate(request.params.id,request.body,{new:true,runValidators:true})
        if(!task){
            return response.status(404).send()
        }
        response.send(task)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})


app.delete("/tasks/:id", async (request,response)=>{
    
    try{
        const task =await Task.findByIdAndDelete(request.params.id)
        if(!task){
            return response.status(404).send()
        }
        response.send(task)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})