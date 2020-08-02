const validator = require("validator")
const mongoose = require("mongoose")
const connectionURL="mongodb://localhost:27017/task-manager-api"
mongoose.connect(connectionURL,
    {
        useNewUrlParser:true,
        useCreateIndex:true
    })
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }},
    {
        timestamps:true
    })
const Task = mongoose.model('Task',taskSchema)
    module.exports=Task
    