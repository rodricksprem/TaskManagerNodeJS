const jwt = require("jsonwebtoken")
const User = require("../model/user.js")

const auth = async (req,res,next)=> {
    try{
        const token = req.header("Authorization").replace("Bearer ","")
        const decoded=jwt.verify(token,'nodehandson')
        const user = await User.findOne({_id:decoded._id.toString(),'tokens.token':token})
        if(!user){
             throw new Error()
        }
    
        req.user = user
        req.token = token
       
        next()
    }catch(e){
        res.status(401).send({error:"Please authentication"})
    }
}

module.exports=auth