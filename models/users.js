const mongoose=require('mongoose')
const Schema=mongoose.Schema
const bcrypt=require('bcrypt')

//yukardaki mongoose.Schema'yı aşağıda new mongoose.Schema olarak kullanabilirim.
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})

//işlemlerimizi model de yapıyorsak önüne statics yazmamız gerekir.

userSchema.statics.login=async function(username,password){
    const user=await this.findOne({username})
    if(user){
        const auth=await bcrypt.compare(password,user.password)
        if(auth){
            return user
    }else{
            throw Error("parola hatalı")
        }
    }else{
        throw Error("kullanıcı yok")
    }
}

userSchema.pre('save', async function(next){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next();
})

const User=mongoose.model('user',userSchema)
module.exports=User