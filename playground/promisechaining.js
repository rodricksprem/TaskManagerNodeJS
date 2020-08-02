const User = require("../src/model/user.js")
User.findByIdAndUpdate('5f2636001b97f8af506ecbbd',{age:10}).then((user) =>{
    console.log(user)
    return User.countDocuments({age:10})
}).then((count)=>{
    console.log(count)
}).catch((error)=>{
console.log(error)
})
