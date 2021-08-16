import mongoose from 'mongoose';
import validator from 'validator';
const ObjectId = mongoose.Types.ObjectId;

let itemsSchema = new mongoose.Schema({
    userId: { type: ObjectId,required: [true, "can't be blank"],ref: 'Users'},
    name:{type:String},
    quantity:{type:Number},
    price:{type:Number},
    total:{type:Number},
    tax:{type:Number,default:null},
    description:{type:String},

})

module.exports = mongoose.model('Items', itemsSchema)

