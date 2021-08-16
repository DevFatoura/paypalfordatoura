import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'; 
const Schema = mongoose.Schema;
const { ObjectId } = Schema;

let inviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
          return validator.isEmail(value)
        }
      },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    days:{type:Number},
    planName:{type:String},
    subscription:{
        subscriptionId: { type:ObjectId, default:null},
     },
    
    

},{timestamps: true});
module.exports = mongoose.model('Invites', inviteSchema)
