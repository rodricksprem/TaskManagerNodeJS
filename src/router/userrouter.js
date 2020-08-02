const express = require("express")
const User = require("../model/user.js")
const auth = require("../middleware/auth.js")

const userrouter = express.Router()


userrouter.post("/users/login",  async (request,response)=>{
    try{
    
        const user = await User.findByCredentials(request.body.email,request.body.password)
        const token = await user.generateToken()
        
        response.send({user,token})
    }catch(error){
        console.log("error ",error)
        response.status(400).send(error)
    }
})
//signin
userrouter.post("/users",  async (request,response)=>{
    const user = new User(request.body)
   try{
        await user.save()
        const token = await user.generateToken()
        
        
        response.status(201).send({user,token})
    }catch(error){
        console.log("error ",error)
        response.status(400).send(error)
    }
})

userrouter.get("/users/me", auth,async (request,response)=>{

        response.status(200).send(request.user)
    
    })
userrouter.get("/users/logout", auth,async (request,response)=>{

        try{
            request.user.tokens = request.user.tokens.filter((token)=> {
                return token.token!==request.token
            } )
            
            await request.user.save()
            response.status(200).send()

        }catch(e){
            console.log(e)
            response.status(500).send(e)
        }
        
    
    })

    userrouter.get("/users/logoutAll", auth,async (request,response)=>{

        try{
            request.user.tokens = []
            
            await request.user.save()
            response.status(200).send()

        }catch(e){
            console.log(e)
            response.status(500).send(e)
        }
        
    
    })

  

userrouter.patch("/users/me", auth , async (request,response)=>{
    const updateKeys = Object.keys(request.body)
    const allowedUpdate = ['name','age','email','password']
    const isValidUpdate = updateKeys.every((updateKey)=> allowedUpdate.includes(updateKey))
    if(!isValidUpdate){
        return response.status(500).send({error:"invalid columns"})
        
    }
    try{
            updateKeys.forEach((updateKey)=>{
                request.user[updateKey]=request.body[updateKey]

            })
            await request.user.save()
        // const user =await User.findByIdAndUpdate(request.params.id,request.body,{new:true,runValidators:true})
        response.send(request.user)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})

userrouter.delete("/users/me", auth , async (request,response)=>{
    try{
        await request.user.remove()
        response.status(200).send(request.user)
    
    }catch(error){
        console.log("error ",error)
        response.status(500).send()
    }
})


module.exports=userrouter