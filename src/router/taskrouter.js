const express = require("express")
const Task = require("../model/task.js")
const taskrouter = express.Router()
const auth = require("../middleware/auth.js")
const User = require("../model/user.js")

taskrouter.post("/tasks", auth, async (request,response)=>{
  //  const task = new Task(request.body)
  const task = new Task({
      ...request.body,
      owner: request.user._id
  
  })
   
   try{
        await task.save()
        response.status(201).send(task)
    }catch(error){
        console.log("error ",error)
        response.status(400).send(error)
    }
})

taskrouter.get("/tasks",auth, async (request,response)=>{
    const match ={}
    const sort ={}
    if (request.query.completed){
        match.completed = request.query.completed==='true'
    }    
    if(request.query.sortBy){
       const parts = request.query.sortBy.split(':')
       sort[parts[0]]=parts[1] === 'desc'?-1:1
    }   
    try{
        
        await request.user.populate({
         path:   'tasks',
         match,
         options:{
             limit: parseInt(request.query.limit),
             skip: parseInt(request.query.skip),
             sort
             }
         
        }).execPopulate()
        response.status(200).send(request.user.tasks)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})
taskrouter.get("/tasks/:id", auth,async (request,response)=>{
    const _id = request.params.id; // mongoose cast to ObjectID automatically
    try{
        const task =await Task.findOne({_id,owner:request.user._id})
        if(!task){
             return   response.status(404).send()
        }
        response.status(200).send(task)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})



taskrouter.patch("/tasks/:id",auth, async (request,response)=>{
    const updateKeys = Object.keys(request.body)
    const allowedUpdate = ['description','completed']
    const isValidUpdate = updateKeys.every((updateKey)=> allowedUpdate.includes(updateKey))
    if(!isValidUpdate){
        return response.status(500).send({error:"invalid columns"})
        
    }
    
    try{
        const task =await Task.findOne({_id:request.params.id,owner:request.user._id})
        if(!task){
            return response.status(404).send()
        }
        updateKeys.forEach((updateKey)=>{
            task[updateKey]=request.body[updateKey]

        })
        await task.save()
    //  const task =await Task.findByIdAndUpdate(request.params.id,request.body,{new:true,runValidators:true})
        if(!task){
            return response.status(404).send()
        }
        response.send(task)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})


taskrouter.delete("/tasks/:id", auth,async (request,response)=>{
    
    try{
        const task =await Task.findOneAndDelete({_id:request.params.id,owner:request.user._id})
        
        if(!task){
            return response.status(404).send()
        }
        response.send(task)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})

module.exports=taskrouter