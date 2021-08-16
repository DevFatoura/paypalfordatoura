const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const SubscriptionHistorySchema = new Schema({
    userId: { type: ObjectId, ref: 'User'},
    subscriptionId:{type:ObjectId},
    subId: {type: String},
    planName:{type:String},
    planPrice:{type:Number},
    email:{type:String},
    firstName:{type:String},
    lastName:{type:String},
    date: { type: Date },
    expiryDate: { type: Date },
    isActive:{type:Boolean},
    invoice_pdf:{type:String}


},
{timestamps: true}); 

module.exports = mongoose.model('SubscriptionHistory', SubscriptionHistorySchema);
