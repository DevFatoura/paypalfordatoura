import mongoose from 'mongoose';
import validator from 'validator';
const ObjectId = mongoose.Types.ObjectId;

let taxSchema = new mongoose.Schema({
    userId: { type: ObjectId,required: [true, "can't be blank"],ref: 'Users'},
    name:{type:String},
    tax:{type:Number,default:null},

})

module.exports = mongoose.model('Taxs', taxSchema)

