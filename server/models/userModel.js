import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'; 
const Schema = mongoose.Schema;
const { ObjectId } = Schema;

let usersSchema = new mongoose.Schema({
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
    phoneNumber:{type:Number},
    hash: String,
    profileImageName:{type:String},
    taxNumber:{type:String},
    currencyType:{type:String},
    subscription:{
        subscriptionId: { type:ObjectId, default:null},  
        subId: {type: String},
        tempSubId: {type: String},
        priceId:{type:String, default:null},
        date: { type: Date },
        expiryDate: { type: Date },
        isActive: Boolean,
      },
    companyDetails:{
        companyLogo:{type:String},
        companyName:{type:String},
        companyAddress:{type:String},
        entityID:{type:String},
        decimalSize:{type:Number}
    },
    token: { type: String, default: null },
    clientId:{type: String},
    secretCode:{type : String},
    paypalEmail: {type: String},
    paypalConnected: {type: Boolean, default: false},
    lastLogin:{type:Date},
    referallCode:{type:String},
    isVerified:{type:Boolean},
    invitedUser:{type:Boolean, default: false}

},{timestamps: true});
usersSchema.methods.setPassword = function (password) {
    this.hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
usersSchema.methods.validatePassword = function (password, hash) {
    return bcrypt.compareSync(password, hash); // true
};
module.exports = mongoose.model('Users', usersSchema)
