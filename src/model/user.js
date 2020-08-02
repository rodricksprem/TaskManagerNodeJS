const validator = require("validator")
const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")

const connectionURL="mongodb://localhost:27017/task-manager-api"
mongoose.connect(connectionURL,
    {
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false
    })
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    age: {
        type: Number,
        default:0,
        validate(value){
            if(value<0){
                console.log(value)
                throw new Error("age should be +ve Integer")
            }
        }
      
    },
    email:{
        type: String,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not Valid Email")
          
            }
        },
        lowercase:true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw "password should not be 'password' itself"
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

},{
    timestamps:true
})
userSchema.virtual(
    'tasks',{
        ref: 'Task',
        localField: '_id',
        foreignField: 'owner'
    }
)
userSchema.methods.toJSON=  function() { // override toJSON method
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    
    return userObject
}
userSchema.methods.generateToken= async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'nodehandson')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials= async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Unable to login")
    }
    const isValid=await bcryptjs.compare(password,user.password)
    if(!isValid){
        throw new Error("Unable to login")
    }
    return user
}
// to hash the password
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcryptjs.hash(user.password,8)
    }
    next()
})

// to delete the cascade tasks
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})

    next()
})
const User = mongoose.model('User',userSchema)

module.exports=User
