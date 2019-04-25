import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { environment } from '../common/environment'
import { validateCPF } from '../common/validators'
export interface User extends mongoose.Document{
  name: String,
  email: String,
  password: String
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  gender: {
    type: String,
    required: false,
    enum: ['male', 'female']
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: '{PATH}: Invalid CPF({VALUE})'
    }
  }
})


const hashPassword = (obj, next) => {
  bcrypt.hash(obj.password, environment.secutiry.saltRounds)
  .then(hash => {
    obj.password = hash
    next()
  }).catch(next)
}

const saveMiddleware = function(next) {
  const user:User = this

  if(!user.isModified('password')){
    next()
  }else{
    hashPassword(user, next)
  }
}

const updateMiddleware = function(next) {
  if(!this.getUpdate().password){
    next()
  }else{
    hashPassword(this.getUpdate(), next)
  }
}


//não pode ser utilizado arrow function porque perderiamos a referencia ao this
userSchema.pre('save', saveMiddleware)

//não pode ser utilizado arrow function porque perderiamos a referencia ao this
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User>('User', userSchema)