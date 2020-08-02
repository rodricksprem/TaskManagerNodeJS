const User = require("../src/model/user.js")
const updateCounts = async (id,age) => {
const user = await User.findByIdAndUpdate(id,{age:age})
const count = await User.countDocuments({age:age})    
return count 

}

updateCounts('5f2636001b97f8af506ecbbd',10).then((count)=> console.log(count)).catch((error)=>console.log(error))