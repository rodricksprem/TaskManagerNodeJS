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
app.post("/users",(request,response)=>{
    const user = new User(request.body)
    console.log(user.name);
    user.save().then((result)=>{
        console.log(result)
        response.status(201).send(user)
    }).catch((error)=>{
        console.log("error ",error)
        response.status(400).send(error)
    }) 
})

app.get("/users",(request,response)=>{
    User.find({}).then((result)=>{
       
        response.status(200).send(result)
    }).catch((error)=>{
        console.log("error ",error)
        response.status(500).send()
    }) 
})

app.get("/users/:id",(request,response)=>{
    const _id = request.params.id; // mongoose cast to ObjectID automatically
    User.findById(_id).then((user)=>{
       if(!user){
        return response.status(404).send()
       }
        response.status(200).send(user)
    }).catch((error)=>{
        console.log("error ",error)
        response.status(500).send()
    }) 
})

app.post("/tasks",(request,response)=>{
    const task = new Task(request.body)
    task.save().then((result)=>{
        console.log(result)
        response.send(task)
    }).catch((error)=>{
        console.log("error ",error)
        response.status(201).send(error)
    }) 
})


app.get("/tasks",(request,response)=>{
    Task.find({}).then((result)=>{
       
        response.status(200).send(result)
    }).catch((error)=>{
        console.log("error ",error)
        response.status(500).send()
    }) 
})

app.get("/tasks/:id",(request,response)=>{
    const _id = request.params.id;
    Task.findById(_id).then((task)=>{
       if(!task){
        return response.status(404).send()
       }
        response.status(200).send(task)
    }).catch((error)=>{
        console.log("error ",error)
        response.status(500).send()
    }) 
})
