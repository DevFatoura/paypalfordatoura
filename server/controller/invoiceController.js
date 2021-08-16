import mongoose from 'mongoose';
import invoices from '../models/invoiceModel'
import items from '../models/itemModel'
import taxs from '../models/taxModel'
import users from "../models/userModel";
const userModel = mongoose.model("Users");
const taxModel = mongoose.model('Taxs')
const itemModel = mongoose.model('Items')
const invoiceModel = mongoose.model("Invoice");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const multer = require("multer");
const storage = require("../services/multer/multerConfig");
const mail = require("../services/mailer/mail");
const invoiceMail = require("../services/mailer/invoiceMail");
import paypalController  from './paypalController'



var multipleUpload = multer({ storage: storage.storage }).array('file'); // for single file upload

class invoiceController{
    async creatInvoice(req){
        try{
            return new Promise(async (resolve, reject) => {
                let invoice = await invoiceModel.findOne({userId:ObjectId(req.userId),invoiceNumber:req.body.invoiceNumber})
                if(invoice == null){
                    if(req.body.invoiceNumber && req.body.from && req.body.to){
                        let invoiceData={}
                        invoiceData=req.body;
                        invoiceData.userId=req.userId;
                        if(req.body.type=="Bill")  invoiceData.status ='unpaid';
                        if(req.body.type=="Invoice")  invoiceData.status ='unpaid';
    
                        let invoice = new invoiceModel(invoiceData);
                        invoice.save().then(resp=>{
                            return resolve({
                                status:"200",
                                success:true,
                                data:resp,
                            })
                        }).catch(error=>{
                            return reject ({
                                status:"400",
                                success:false,
                                data:error,
                            })
                        })
                    }else{
                        return reject ({
                            status:"400",
                            success:false,
                            message:"variables are empty"
                        })
                    }
                }else{
                    // console.log("already exsisit")
                    return reject ({
                        status:409,
                        success:false,
                        message:"invoice number is duplicate"
                    })
                }
                                
            }) 
        }catch(error){
            return error;

        }
    }

    async updateInvoice(req){
        try{
            let invoice= await invoiceModel.updateOne({_id:req.params.id},{$set:req.body})
        // invoice=req.body;
            if(invoice.nModified > 0){
                return{
                    status:"200",
                    success:true,
                    message:"Document update successfully"
                }
            }else{
                return{
                    status:"400",
                    success:false,
                    message:"Something went wrong"
                } 
            }
            
    
            }catch(error){
                return error;
            }
        

    }
    async generateInvoiceNumberForReport(req,type){
        try{
             let year = new Date().getFullYear();
            //  type=="Invoice"?"Automated Receipt":"Payment Voucher"
             let firstChar;
             if(type=="Receipt")  firstChar = 'RC';
             if(type=="Payment Voucher")  firstChar = 'PV';
            
             let invoiceData = await invoiceModel.find({userId:req.userId,type:type});
             if(invoiceData.length){

                invoiceData=invoiceData[invoiceData.length-1]
                 if(new Date(invoiceData.createdAt).getFullYear()==year){
                    var lastFive = invoiceData.invoiceNumber.substr(invoiceData.invoiceNumber.length - 5);
                    let count =(parseInt(lastFive)+1)
                    let number= firstChar + year +'-0000'+ count
                     return {
                        status:200,
                        success:true,
                        data:number
                    } 
                 }else{
                    let number= firstChar + year +'-00001'
                    return {
                        status:200,
                        success:true,
                        data:number
                    }  
                 }                 
             }else{
                let number= firstChar + year +'-00001'
                return {
                    status:200,
                    success:true,
                    data:number
                } 
             }
             

        }catch(error){
            return error;
        }
    }

    async generateInvoiceNumber(req){
        try{
             let year = new Date().getFullYear();
             let firstChar;
             if(req.body.type=="Invoice")  firstChar = 'INV';
             if(req.body.type=="Purchase Order")  firstChar = 'PO';
             if(req.body.type=="Quote")  firstChar = 'QT';
             if(req.body.type=="Bill")  firstChar ='BL'


             let invoiceData = await invoiceModel.find({userId:req.userId,type:req.body.type});

             if(invoiceData.length){

                invoiceData=invoiceData[invoiceData.length-1]
                 if(new Date(invoiceData.createdAt).getFullYear()==year){
                    var lastFive = invoiceData.invoiceNumber.substr(invoiceData.invoiceNumber.length - 5);
                    let count =(parseInt(lastFive)+1)
                    let number= firstChar + year +'-0000'+ count
                     return {
                        status:200,
                        success:true,
                        data:number
                    } 
                 }else{
                    let number= firstChar + year +'-00001'
                    return {
                        status:200,
                        success:true,
                        data:number
                    }  
                 }                 
             }else{
                let number= firstChar + year +'-00001'
                return {
                    status:200,
                    success:true,
                    data:number
                } 
             }
             

        }catch(error){
            return error;
        }
    }

    async saveTax(req){
        try{
            let taxs = new taxModel();
            taxs.userId=req.userId;
            taxs.name=req.body.name;
            taxs.tax=req.body.tax;
            return taxs.save().then(resp=>{
                return{
                    status:"200",
                    success:true,
                    message:'tax save successfully',
                    data:resp
                }
            }).catch(error=>{
                return{
                    status:"400",
                    success:false,
                    message:'some thing goes wrong',
                    data:error
                }
            })


        }catch(error){
            return error;
        }
    }

    async getTaxs(req){
        try{
            let taxs = await taxModel.find({userId:req.userId})
            if(taxs && taxs.length){
                return{
                    status:'200',
                    success:true,
                    data:taxs,
                    message:""
                }
            }else{
                return{
                    status:'400',
                    success:true,
                    data:[],
                    message:"taxs not found"
                }
            }
        }catch(error){
            return error;
        }
    }

    async saveItem(req){
        try{
            let items = new itemModel();
            items.userId = req.userId;
            items.name=req.body.name;
            items.quantity=req.body.quantity;
            items.price=req.body.price;
            items.total=req.body.total;
            items.tax= req.body.tax;
            items.description = req.body.description;

            return items.save().then(resp=>{
                return{
                    status:"200",
                    success:true,
                    message:'item save successfully',
                    data:resp
                }
            }).catch(error=>{
                return{
                    status:"400",
                    success:false,
                    message:'some thing goes wrong',
                    data:error
                }
            })

        }catch(error){
            return error
        }

    }

    async getItem(req){
        let items = await itemModel.find({userId:req.userId})
        if(items && items.length){
            return{
                status:'200',
                success:true,
                data:items,
                message:""
            }
        }else{
            return{
                status:'400',
                success:true,
                data:[],
                message:"items not found"
            }
        }
    }

    async getInvoices(req){
        try{
            let invoiceData = await invoiceModel.find({userId:req.userId,isDeleted:false}).select({ companyLogo: 0 }).sort({_id:-1}).exec();
            if(invoiceData && invoiceData.length){
                return {
                    status:200,
                    success:true,
                    data:invoiceData,
                    message:''
                }
            }else{
                return {
                    status:400,
                    success:false,
                    data:[],
                    message:'not found'
                } 
            }
        }catch(error){
            return error;
        }
    }

    async getInvoiceById(req){
        try{
            let id =req.params.id;
            let invoiceData = await invoiceModel.findOne({_id:id});
            if(invoiceData){
                return {
                    status:"200",
                    success:true,
                    data:invoiceData
                }
            }else{
                return {
                    status:"200",
                    success:true,
                    data:'',
                    message:"data not found"
                } 
            }
        }catch(error){
            return error;
        } 
    }

    async deleteInvoiece(req){
        try{
            let id =req.params.id;
            let invoiceData = await invoiceModel.findOne({_id:id});
            if(invoiceData){
                invoiceData.isDeleted=true;
                return invoiceData.save().then((resp)=>{
                    return{
                        status:"200",
                        success:true,
                        message:"document deleted successfully"
                    }
                })

            }else{
                return{
                    status:"400",
                    success:false,
                    message:"Invoice not found"
                } 
            }

        }catch(error){
            return error;
        }
    }

    async permanentDelete(req){
        try{
            let id =req.params.id;
            let result = await invoiceModel.deleteOne({_id:id});
            if(result.n > 0)
                return {
                    success:true,
                    status:200,
                    message:"Deleted successfully"
                }
            else{
                return {
                    success:true,
                    status:200,
                    message:"Deleted successfully"
                } 
            }
        }catch(error){
            return error;
        }
        
    }

    async getDeletedInvoice(req){
        try{
            let invoiceData = await invoiceModel.find({userId:req.userId,isDeleted:true});
            return{
                status:"200",
                success:true,
                data:invoiceData
            } 
           
        }catch(error){
            return error;
        }
    }

    async restoreInvoice(req){
        try{
            let id =req.params.id;
            let invoiceData = await invoiceModel.findOne({_id:id});
            if(invoiceData){
                invoiceData.isDeleted=false;
                return invoiceData.save().then((resp)=>{
                    return{
                        status:"200",
                        success:true,
                        message:"document deleted successfully"
                    }
                })

            }else{
                return{
                    status:"400",
                    success:false,
                    message:"Invoice not found"
                } 
            }

        }catch(error){
            return error;
        }
    }

    async payInvoice(req){
        try{
            let id =req.params.id;
            let invoiceData = await invoiceModel.findOne({_id:id});
            if(invoiceData.type=="Invoice"){
                var recieptId = await this.saveReport(invoiceData,req.body.amount,req.body.paymentType, req.body.memo, req.body.paymentDate)
            }
            if(invoiceData.type=="Bill"){
                var recieptId = await this.saveReport(invoiceData,req.body.amount,req.body.paymentType, req.body.memo, req.body.paymentDate)
            }

            let payment={
                paymentDate: req.body.paymentDate,
                amount:req.body.amount,
                paymentType:req.body.paymentType,
                recieptId:recieptId.recieptId,
                memo:req.body.memo
            }
            
            invoiceData.paymentHistory.push(payment);
            invoiceData.dueAmount =  invoiceData.dueAmount - req.body.amount;
            if (invoiceData.currencyValue) {
                invoiceData.convertedAmount = (invoiceData.dueAmount / invoiceData.currencyValue).toFixed(2);
            }

            return await invoiceData.save().then(async(resp)=>{
                const sum = resp.paymentHistory.map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
                if(resp.paymentLink){
                    let recordPayment = await paypalController.recordPaymentByInvoice(payment,resp)
                    if(sum>=invoiceData.totalAmount){

                        resp.status="paid";
                        return resp.save().then(resp1=>{

                            return{
                                status:"200",
                                success:true,
                                data:resp1,
                                message:"Payment updated successfully"
                            }
                        })
                    }else{

                        return{
                            status:"200",
                            success:true,
                            data:resp,
                            message:"Payment updated successfully"
                        }
                    }
                }else{
                    if(sum>=invoiceData.totalAmount){
                        resp.status="paid";
                        return resp.save().then(resp1=>{
                            return{
                                status:"200",
                                success:true,
                                data:resp1,
                                message:"Payment updated successfully"
                            }
                        })
                    }else{
                        return{
                            status:"200",
                            success:true,
                            data:resp,
                            message:"Payment updated successfully"
                        }
                    }
                }

                
                
            }).catch(error=>{
                return error;
            })
        }catch(error){
            return{
                status:"400",
                success:false,
                data:'',
                message:"Something goes wrong"
            }
        }
    }

    async payInvoiceByPaypal(data){
        try{
            let invoiceData = await invoiceModel.findOne({paypalInvoiceId: data.resource.invoice.id});
            let transactionAmount= data.resource.invoice.payments.transactions[data.resource.invoice.payments.transactions.length-1].amount.value;
            if (invoiceData.currencyValue) {
                transactionAmount = (transactionAmount * invoiceData.currencyValue).toFixed(2);
                invoiceData.dueAmount = invoiceData.dueAmount - transactionAmount;
                if(invoiceData.dueAmount < 0.09) { 
                    transactionAmount = Number(transactionAmount) + Number(invoiceData.dueAmount);
                    invoiceData.dueAmount = 0.00;
                }
                invoiceData.convertedAmount = (invoiceData.dueAmount * invoiceData.currencyValue).toFixed(2); 
            }   

            if(invoiceData.type=="Invoice"){
                var recieptId = await this.saveReport(invoiceData, Number(transactionAmount), "paypal", "", data.resource.invoice.detail.metadata.last_update_time)
            }
            
            let payment ={
                paymentDate: data.resource.invoice.detail.metadata.last_update_time,
                amount: Number(transactionAmount),
                paymentType:"paypal",
                recieptId:recieptId.recieptId,
                memo:""
            }
            // invoiceData.dueAmount =  invoiceData.dueAmount - req.body.amount;
            // if (invoiceData.currencyValue) {
            //     invoiceData.convertedAmount = (invoiceData.dueAmount / invoiceData.currencyValue).toFixed(2);
            // }
            invoiceData.paymentHistory.push(payment);
            return await invoiceData.save().then(resp=>{
                const sum = resp.paymentHistory.map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
                if(sum>=invoiceData.totalAmount){
                    resp.status="paid";
                    return resp.save().then(resp1=>{
                        return{
                            status:"200",
                            success:true,
                            data:resp1,
                            message:"Payment updated successfully"
                        }
                    })
                }else{
                    return{
                        status:"200",
                        success:true,
                        data:resp,
                        message:"Payment updated successfully"
                    }
                }
                
            }).catch(error=>{
                return error;
            })
        }catch(error){
            return{
                status:"400",
                success:false,
                data:'',
                message:"Something goes wrong"
            }
        }
    }
    /* function for generate report */
    async saveReport(data,amount,paymentType,memo, paymentDate){
        // let recieptData ={};
        let {_id, ...recieptData} = {...data._doc};
        recieptData.recieptAmount= amount;
        recieptData.invoiceNumber = await this.generateInvoiceNumberForReport(recieptData,data.type=="Invoice"?"Receipt":"Payment Voucher").then(resp=>{return resp.data});
        recieptData.paymentType=paymentType;
        recieptData.invoiceDate=moment(new Date(paymentDate)).format('YYYY-MM-DD');
        recieptData.type=data.type=="Invoice"?"Receipt":"Payment Voucher";
        recieptData.status=null
        recieptData.autoMemo = memo;
        let invoice = new invoiceModel(recieptData);
        return invoice.save().then(resp=>{
            return {
                recieptId:resp._id
            }
        })       

    }

    
    async getMontlyStatics(req){
        try{
            let paidCount=await this.getPaidCount(req,"monthly");
            let unpaidcount= await this.getUnpaidCount(req,"monthly");
            let overDueCount =await this.getOverDueCount(req,"monthly");
            return Promise.all([{"paid":paidCount,"unpaid":unpaidcount, "overdue":overDueCount, }]).then((result) => {
                return {
                    status:200,
                    success:true,
                    data:result
                  }
            })

        }catch(error){
            return error;
        }
    }

    async getQuarterlyStatics(req){
        try{
            let paidCount=await this.getPaidCount(req,"quartely");
            let unpaidcount= await this.getUnpaidCount(req,"quartely");
            let overDueCount =await this.getOverDueCount(req,"quartely");
            return Promise.all([{"paid":paidCount,"unpaid":unpaidcount, "overdue":overDueCount, }]).then((result) => {
                return {
                    status:200,
                    success:true,
                    data:result
                  }
            })

        }catch(error){
            return error;
        }
    }

    async getYearlyStatic(req){
        try{
            let paidCount=await this.getPaidCount(req,"yearly");
            let unpaidcount= await this.getUnpaidCount(req,"yearly");
            let overDueCount =await this.getOverDueCount(req,"yearly");
            return Promise.all([{"paid":paidCount,"unpaid":unpaidcount, "overdue":overDueCount, }]).then((result) => {
                return {
                    status:200,
                    success:true,
                    data:result
                  }
            })

        }catch(error){
            return error;
        }
    }

    async getPaidCount(req,slot){
        try{
            let monthDate;
            if(slot=="quartely"){
                 monthDate = await moment().subtract(3, 'months').format('YYYY-MM-DD');

            }else if(slot=="yearly"){
                 monthDate = await moment().subtract(1, 'y').format('YYYY-MM-DD');
            }else{
                 monthDate = await moment().subtract(1, 'months').format('YYYY-MM-DD');

            }

            return await invoiceModel.aggregate(
                [
                    {
                    $match: {
                        $or:[{"type": "Invoice"},{type:"Bill"}],
                        isDeleted:false,userId:ObjectId(req.userId),status:'paid',createdAt: { $gte: new Date(monthDate) }
                    }
                    },
                    {
                    $count: "paid"
                    }
                ]
            )               
        }catch(error){
            return error
        }
    }

    async getOverDueCount(req,slot){
        try{
            let monthDate;
            if(slot=="quartely"){
                 monthDate = await moment().subtract(3, 'months').format('YYYY-MM-DD');

            }else if(slot=="yearly"){
                 monthDate = await moment().subtract(1, 'y').format('YYYY-MM-DD');
            }else{
                 monthDate = await moment().subtract(1, 'months').format('YYYY-MM-DD');

            }            
            return await invoiceModel.aggregate(
                [
                    {
                    $match: {
                        $or:[{"type": "Invoice"},{type:"Bill"}],
                        isDeleted:false,userId:ObjectId(req.userId),status:'overdue',createdAt: { $gte: new Date(monthDate) }
                    }
                    },
                    {
                    $count: "overdue"
                    }
                ]
            )               
        }catch(error){
            return error
        }
    }

    async getUnpaidCount(req,slot){
        try{

            let monthDate;
            if(slot=="quartely"){
                 monthDate = await moment().subtract(3, 'months').format('YYYY-MM-DD');

            }else if(slot=="yearly"){
                 monthDate = await moment().subtract(1, 'y').format('YYYY-MM-DD');
            }else{
                 monthDate = await moment().subtract(1, 'months').format('YYYY-MM-DD');

            } 
            return await invoiceModel.aggregate(
                [
                    {
                    $match: {
                        $or:[{"type": "Invoice"},{type:"Bill"}],
                        isDeleted:false,userId:ObjectId(req.userId),status:'unpaid',createdAt: { $gte: new Date(monthDate) }
                    }
                    },
                    {
                    $count: "unpaid"
                    }
                ]
            )               
        }catch(error){
            return error
        }
    }


    async getSalesReport(req){
        try{
            let monthlyEarning =await this.getMonthlyData(req);
            let getQuartelyData = await this.getQuartelyData(req)
            let lifeTimeEarning = await this.getTotalEarning(req);
            return Promise.all([{"monthlyEarning":monthlyEarning,"quaterlyEarning":getQuartelyData,"lifeTimeEarning":lifeTimeEarning}]).then((result) => {
                return {
                status:200,
                success:true,
                data:result[0]
            }
            }).catch((error)=>{
            return error;
            })
        }catch(error){
            return error;

        }

    }

    async getSalesReportByCurrency(req){
        try{
            let monthlyEarning =await this.getMonthlyData(req);
            let getQuartelyData = await this.getQuartelyData(req)
            let lifeTimeEarning = await this.getTotalEarning(req);
            return Promise.all([{"monthlyEarning":monthlyEarning,"quaterlyEarning":getQuartelyData,"lifeTimeEarning":lifeTimeEarning}]).then((result) => {
                return {
                status:200,
                success:true,
                data:result[0]
            }
            }).catch((error)=>{
            return error;
            })
        }catch(error){
            return error;

        }
    }

    async getMonthlyData(req){
        try{
        // let monthDate = moment().subtract(1, 'months').format('YYYY-MM-DD')
        let month =new Date().getMonth();
         let result=await invoiceModel.aggregate([{
            $addFields: {
                "month": {
                  $month: {
                    $toDate: "$createdAt"
                  }
                }
              }
            },   
        {
          $match :  {                        
            $or:[{"type": "Invoice"}],currency:req.body.currency,
            isDeleted:false,userId:ObjectId(req.userId),month:month+1  }},
          {
            $group : {
                _id : null,
                total : {
                    $sum : "$totalAmount"
                }
            }
  
          }]);
          return result.length?result[0].total:0;
        }catch(error){
            console.log(error)
        }
      }

      async getQuartelyData(req){
        let monthDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
        let result = await invoiceModel.aggregate([{
          $match :  {
            $or:[{"type": "Invoice"}],currency:req.body.currency,
            isDeleted:false,userId:ObjectId(req.userId),createdAt: { $gte: new Date(monthDate) }  }},
          {
            $group : {
                _id : null,
                total : {
                    $sum : "$totalAmount"
                }
            }
  
          }]);
          return result.length?result[0].total:0;
  
      }

      async getTotalEarning(req){
        let result = await invoiceModel.aggregate([{
          $match :  {                        
            $or:[{"type": "Invoice"}],currency:req.body.currency,
            isDeleted:false,userId:ObjectId(req.userId)}
        },
          {
            $group : {
                _id : null,
                total : {
                    $sum : "$totalAmount"
                }
            }
  
          }]); 
          return result.length?result[0].total:0;

  
      }

    async getInvoicesForDate(req){
        try{
            let invoiceData = await invoiceModel.find({$or:[{type: "Invoice"},{type:"Bill"}],isDeleted:false,status:"unpaid"});
            if(invoiceData.length){
                invoiceData.map(data=>{
                    if(data.dueDate != null){
                        if(moment(new Date()).format('YYYY-MM-DD') >moment(data.dueDate).format('YYYY-MM-DD')){
                             this.setStatus(data._id);
                        }
                    }
                })
            }
        }catch(error){
            return error;
        }
    }

    async getSalesReportByGraph(req){
        try{
                const FIRST_MONTH = 1
                const LAST_MONTH = 12
                var now = new Date();
                let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                let YEAR_BEFORE = new Date();
        
                const monthsArray = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
                let data= await invoiceModel.aggregate([{ 
                  $match: { 
                  $or:[{"type": "Invoice"},{type:"Bill"}],currency:req.body.currency,
                  isDeleted:false,userId:ObjectId(req.userId),createdAt: {$gte:new Date(req.body.fromDate), $lt: new Date(req.body.endDate)}
                }
                },
                  { 
                      $group: {
                          _id: { "year_month": { $substrCP: [ "$createdAt", 0, 7 ] } }, 
                          count: { $sum: 1 },
                          total : {
                            $sum : "$totalAmount"
                        }
                      } 
        
                  },
                  {
                    $sort: { "_id.year_month": 1 }
                },
                { 
                  $project: { 
                      _id: 0, 
                      count: 1, 
                      total:1,
                      month_year: { 
                          $concat: [ 
                            { $arrayElemAt: [ monthsArray, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
                            "-", 
                            { $substrCP: [ "$_id.year_month", 0, 4 ] }
                          ] 
                      }
                  } 
              },
              { 
                $group: { 
                    _id: null, 
                    data: { $push: { k: "$month_year", v: "$total" } }
                } 
              },
              { 
                $addFields: { 
                    start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] }, 
                    end_year: { $substrCP: [ startOfToday, 0, 4 ] },
                    months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
                    months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ startOfToday, 5, 2 ] } }, 1 ] } ] }
                } 
            },
        
            { 
              $addFields: { 
                  template_data: { 
                      $concatArrays: [ 
                          { $map: { 
                               input: "$months1", as: "m1",
                               in: {
                                   count: 0,
                                   month_year: { 
                                       $concat: [ { $arrayElemAt: [ monthsArray, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ] 
                                   }                                            
                               }
                          } }, 
                          { $map: { 
                               input: "$months2", as: "m2",
                               in: {
                                   count: 0,
                                   month_year: { 
                                       $concat: [ { $arrayElemAt: [ monthsArray, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ] 
                                   }                                            
                               }
                          } }
                      ] 
                 }
              }
            },
            { 
              $addFields: { 
                  data: { 
                     $map: { 
                         input: "$template_data", as: "t",
                         in: {   
                             k: "$$t.month_year",
                             v: { 
                                 $reduce: { 
                                     input: "$data", initialValue: 0, 
                                     in: {
                                         $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
                                                      { $add: [ "$$this.v", "$$value" ] },
                                                      { $add: [ 0, "$$value" ] }
                                         ]
                                     }
                                 } 
                             }
                         }
                      }
                  }
              }
          },
              {
                $project: { 
                    data: { $arrayToObject: "$data" }, 
                    _id: 0 
                } 
              }
                ]); 
                  let finalResult=data[0].data
                  return {
                    status:200,
                    success:true,
                    data:finalResult
                  }
        }catch(error){
            return error;
        }
    }

    async getWeekGraphData(req){
        try{
            const weekGraph = await invoiceModel.aggregate([
                {
                    $match:{
                        $or:[{"type": "Invoice"},{type:"Bill"}],
                        isDeleted:false,userId:ObjectId(req.userId),currency:req.body.currency,
                        createdAt:{$gte: new Date(req.body.fromDate),$lte: new Date(req.body.endDate)}
                    }
                },
                {$group:{
                  _id: { $dayOfWeek: { date: "$createdAt" } }, 
      
                   count:{$sum:1},
                   total : {
                    $sum : "$totalAmount"
                }
      
              }}
                
              ])
              
            return {
                status:200,
                success:true,
                data:weekGraph
            }
        }catch(error){
            return error
        }
    }

    async getGraphDataforMonthly(req){
        try{
            const montGraph = await invoiceModel.aggregate([
                {
                    $match:{
                    $or:[{"type": "Invoice"},{type:"Bill"}],
                    isDeleted:false,userId:ObjectId(req.userId),currency:req.body.currency,
                    createdAt:{$gte: new Date(req.body.fromDate),$lte: new Date(req.body.endDate)}
                    }
                  },
                  {$group:{
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
        
                     count:{$sum:1},
                     total : {
                      $sum : "$totalAmount"
                  }
        
                }}
                  
                ])
                return {
                  status:200,
                  success:true,
                  data:montGraph
                }
              
        }catch(error){
            return error
        }
    }

    
    async setStatus(id){
        let invoiceData = await invoiceModel.findOne({_id:id,status:'unpaid'});
        invoiceData.status="overdue"
        invoiceData.save();
    }

    // Upload and sending file 
    async uploadSendFile(req,res){
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({_id : ObjectId(req.userId) });
            return multipleUpload(req,res, function (err) {
                if (err instanceof multer.MulterError) {
                  return resolve({
                    status: 500,
                    message: err,
                    url: "",
                    success: false,
                  });
                } else if (err) {
                  return resolve({
                    status: 500,
                    message: err,
                    url: "",
                    success: false,
                  });
                }
                
                if(req.files.length){
                    invoiceMail.sendAttachmentMail(req.body,req.files,user.email).then((resp) => {
                        return resolve ({
                            status:200,
                            success:true,
                            message:"Mail sent successfully"
                        })
                    })  
                }
                
              });
        })
    }

    async getAllCurrencies(req){
        try{
            return invoiceModel.aggregate(
                [
                    {
                    $match: {
                        $or: [{
                            "type": "Invoice"
                          }, {
                            type: "Bill"
                          }],
                        isDeleted:false,
                        userId:ObjectId(req.userId)
                    }
                    },
                    {
                        $group: {
                            _id: "$currency",
                            root: {
                                $first: "$$ROOT"
                            }
                        }
                    },
                    {
                        $replaceRoot: {
                          newRoot: "$root"
                        }
                    },
                    { "$project": {"_id":0, "currency": 1}},

                ]
            ); 
            
        }catch(error){
            return error;
        }
        
    }

    async getTotalByCurrency(req){
        try{
            let allCurrencies= await this.getAllCurrencies(req);
            // for (const currency of allCurrencies) {
                
            //   }
        let result = await Promise.all ( allCurrencies.map(async(currency)=>{
            return await invoiceModel.aggregate(
               [
                   {
                   $match: {
                    $or:[{"type": "Invoice"},{type:"Bill"}],isDeleted:false,
                     userId:ObjectId(req.userId),currency:currency.currency 
                   }
                   },{
                       $group : {
                           _id : currency.currency,
                           total : {
                               $sum : "$totalAmount"
                           }
                       }
                   }
                   
               ]
           )
        }))
        return{
            status:200,
            success:true,
            data:result
        }

        }catch(error){
            return error;
        }
        


    }

    async getTotalByCurrencyStatus(req){
        try{
            let allCurrencies= await this.getAllCurrencies(req);
                
            let result = await Promise.all ( allCurrencies.map(async(currency)=>{
                return await invoiceModel.aggregate(
                [
                    {
                    $match: {
                        $or:[{"type": "Invoice"},{type:"Bill"}],isDeleted:false,
                        userId:ObjectId(req.userId),status:req.query.status,currency:currency.currency 
                    }
                    },{
                        $group : {
                            _id : currency.currency,
                            total : {
                                $sum : "$totalAmount"
                            }
                        }
                    }
                    
                ])
            }))
            return {
                status:200,
                success:true,
                data:result
            }
        }catch(error){
            return error
        }
        


    }

    async getAllCurrenciesByInvoices(req){
        try{
            let allCurrencies= await this.getAllCurrencies(req);
            return {
                status:200,
                success:true,
                data:allCurrencies
            }
        }catch(error){
            return error
        }


    }

    async getCustomer(req){
        try{
            
            // let result = await invoiceModel.find({userId:req.userId,to: { $regex: req.body.name }}).select({to:1,billTo:1,shipTo:1})
            let result = await invoiceModel.aggregate(
                [
                    {
                    $match: {
                        to: { $regex: req.body.name },
                        isDeleted:false,
                        userId:ObjectId(req.userId)
                    }
                    },
                    {
                        $group: {
                            _id: "$to",
                            root: {
                                $first: "$$ROOT"
                            }
                        }
                    },
                    {
                        $replaceRoot: {
                          newRoot: "$root"
                        }
                    },
                    { "$project": {"_id":0, "to": 1,"billTo":1,"shipTo":1}},

                ]
            ); 
            
            if(result.length>0){
                return {
                    status:200,
                    success:true,
                    data:result
                }
            }else{
                return {
                    status:400,
                    success:true,
                    data:[],
                    message:"Result not found"
                }
            }
        }catch(error){
            return error;
        }
    }

    async getFilteredInvoice(req){
        try{
        let invoiceData = await invoiceModel.find({ $or:[{"type": "Invoice"},{type:"Bill"}],isDeleted:false,userId:req.userId,isDeleted:false}).select({ companyLogo: 0 });
            return {
                status:200,
                success:true,
                data:invoiceData
            }
        }catch(error){
            return error
        }
    }

    async getInvoiceCount(req){
        try{
            let result = await invoiceModel.find(
                { $or:[{"type": "Invoice"},{type:"Bill"},{type:"Purchase Order"},{type:"Quote"}],
                userId:req.userId}).count();
            return {
                status:200,
                success:true,
                data:result
            } 

        }catch(error){
            return error;
        }
    }

    async getInvoiceByNumber(req){
        try{
            let id =req.params.id;
            let invoiceData = await invoiceModel.findOne({paypalInvoiceId:id});
            if(invoiceData){
                return {
                    status:"200",
                    success:true,
                    data:invoiceData
                }
            }else{
                return {
                    status:"200",
                    success:true,
                    data:'',
                    message:"data not found"
                } 
            }
        }catch(error){

        }
    }

    async removeAllInvoiceOfUser(userId){
        try{
            let result = await invoiceModel.remove({userId:userId})
            return result;
        }catch(error){
            return error
        }
    }

}

module.exports = new invoiceController();



