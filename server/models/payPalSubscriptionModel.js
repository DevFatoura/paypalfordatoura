import mongoose from 'mongoose';
import validator from 'validator';
const ObjectId = mongoose.Types.ObjectId;


let paypalSchema = new mongoose.Schema({
    planName: { type: String, default: ''},
    planPrice: { type: Number, default: ''},
    planDuration:{type:String,default:''},
    description:{type:String,default:''},
    isActive:{type:Boolean,default:true},
    paypalData:{
        productId:{type:String,default:''},
        planId:{type:String,default:''}
    },
    features:{type:Array},
    isHidden:{type:Boolean,default:false},
    

},{timestamps: true})

module.exports = mongoose.model('paypalSubscription', paypalSchema)