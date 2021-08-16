import mongoose from 'mongoose';
import validator from 'validator';
const ObjectId = mongoose.Types.ObjectId;

let invoiceSchema = new mongoose.Schema({
    userId: { type: ObjectId,required: [true, "can't be blank"],ref: 'Users'},
    invoiceNumber:{type:String},
    type:{type:String},
    from:{type:String},
    to:{type:String},
    billTo:{type:String},
    shipTo:{type:String},
    companyLogo:{type:String,default:null},
    companyAddress:{type:String},
    invoiceDate:{type:String},
    purchaseOrder:{type:String},
    description:{type:String},
    taxNumber:{type:String},
    documentNumber:{type:String},
    entityID:{type:String},
    dueDate: {type:Date},
    currency:{type:String},
    termsCondition:{type:String},
    status:{type:String,default:null},
    paymentHistory:{type:[
        {
        paymentDate : {type:Date},
        amount:{type:Number},
        paymentType:{type:String},
        recieptId:{type:ObjectId,default:null},
        memo:{type:String,default:null}
        }
    ],default: []},
    paymentType:{type:String},
    items:[{
        itemsId:{type:ObjectId},
        name:{type:String},
        quantity:{type:Number},
        price:{type:Number},
        total:{type:Number},
        tax:{type:Number,default:null},
        taxName:{type:String},
        description:{type:String}
    }],
    totalAmount:{type:Number},
    recieptAmount:{type:Number,default:null},
    isDeleted:{type:Boolean,default:false},
    currencySymbol:{type:String},
    subTotal:{type:Number},
    totalTax:{type:Number},
    autoMemo:{type:String,defult:null},
    secondaryInvoiceNumber:{type:String,defualt:null},
    paypalInvoiceId:{type:String},
    paymentLink:{type:String},
    dueAmount:{type:Number,defualt:null},
    convertedAmount:{type:Number},
    currencyValue:{type:Number},
    apiCount:{type:Number}

    

},{timestamps: true})

module.exports = mongoose.model('Invoice', invoiceSchema)

