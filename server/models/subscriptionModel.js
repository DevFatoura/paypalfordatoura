import mongoose from 'mongoose';
import validator from 'validator';
const ObjectId = mongoose.Types.ObjectId;


let subscriptionSchema = new mongoose.Schema({
    planName: { type: String, default: ''},
    planPrice: { type: Number, default: ''},
    planDuration:{type:String,default:''},
    description:{type:String,default:''},
    isActive:{type:Boolean,default:true},
    stripeData:{
        productId:{type:String,default:''},
        priceId:{type:String,default:''},
        planId:{type:String,default:''}
    },
    features:{type:Array}

},{timestamps: true})

module.exports = mongoose.model('Subscription', subscriptionSchema)

