import mongoose from 'mongoose'; 
import subscription from "../models/subscriptionModel";
const subscriptionModel = mongoose.model("Subscription");
import subscriptionHistory from '../models/subscriptionHistoryModel';
const subscriptionHistoryModel = mongoose.model("SubscriptionHistory");
import users from "../models/userModel";
const userModel = mongoose.model("Users");
import stripeProduct from "../services/stripeManagement/stripe-create-product";
import customerOperation from "../services/stripeManagement/stripe-create-customer"
import deleteSubscription from "../services/stripeManagement/stripe-cancel-subscription"
const ObjectId = mongoose.Types.ObjectId;
const template = require("../services/mailer/mailtamplates");
import moment from 'moment';


// const SubscriptionHistoryModel = require("../models/subscriptionHistoryModel");
class subscriptionController {
  async createPlan(req) {
      try{
        let subscriptionData = req.body;
        if(subscriptionData && subscriptionData.planName ){
            let subscription = new subscriptionModel({
                planName: subscriptionData.planName,
                planPrice: subscriptionData.planPrice,
                planDuration: subscriptionData.planDuration||'year',
                description: subscriptionData.description,
                features:subscriptionData.features
            });
            let product = await stripeProduct.createProduct(req.body);
            let stripeData = {
                productId: product.productId,
                priceId: product.priceId,
                planId: product.stripePlanId,
            };
            subscription.stripeData = stripeData;
            const result = await subscription.save();
            return result
        }else{
        }
      }catch(error){
          console.log(error)
      }
    
 }

 async getSubscriptionPlan(req){
     try{
        let plans = await subscriptionModel.find()
        if(plans.length){
            return {
                status:200,
                success:true,
                data:plans
            }
        }
     }catch(error){
        return error;
     }
 }

 async freeSubscription(userData){
    try{
        let user =await userModel.findOne({ _id: userData._id })
        let freePlan = await subscriptionModel.findOne({planName:"Basic"})
        user.subscription = {
            subscriptionId: freePlan._id,
            subId: null,
            priceId:null,
            customerid:null,
            date: null,
            expiryDate: null,
            isActive: true,
          }
          return user.save().then((resp)=>{
            return resp ;            
          })

    }catch(error){
        return error
    }
 }
 async subscribePlan(req){
    try{
        let planData = req.body;
        let user =await userModel.findOne({ _id: req.userId })
        if(user.subscription.subId){
            console.log("enter i cancel")
           this.cancelPlan(req)
        }
        planData.fullName = planData.personalDetails.firstName + " " + planData.personalDetails.lastName;
        planData.email = user.email;
        planData.userId=req.userId;
        // console.log('plan data', planData);
        const customer = await customerOperation.createCustomer(planData);
        console.log("planData",planData)
        if(customer){
            console.log("subscribe plan")
            const result = await this.purchansePlan(planData,customer);
            return result
        }
        else{
            return {
                status: 400,
                message: "Something went wrong",
                success: false,
                data: "",
            };
        }
    }catch(error){
        console.log("error",error)
        return error ;
    }


 }

 async upgradePlan(req){
  let planData = req.body;
   planData.userId = req.userId
  planData.fullName = planData.personalDetails.firstName + " " + planData.personalDetails.lastName;

  try{
    const subscription = await stripe.subscriptions.retrieve(planData.planDetails.subId);
   
    return stripe.subscriptions.update(planData.planDetails.subId, {
      items: [{
        id: subscription.items.data[0].id,
        price: planData.planDetails.priceId,
      }],
      proration_behavior:'always_invoice',
    }).then(async(result)=>{
      let user =await userModel.findOne({ _id: planData.userId })
      user.subscription = {
          subscriptionId: ObjectId(planData.planDetails.subscriptionId),
          subId: result.id,
          priceId:planData.planDetails.priceId,
          // customerid:customer.customerid,
          date: new Date(result.current_period_start * 1000),
          expiryDate: new Date(result.current_period_end * 1000),
          isActive: true,
        }

        return user.save().then(async(resp)=>{
          
          if(resp){      
              const invoiceData = await customerOperation.getInvoice(result);

              let subscriptionHistory = new subscriptionHistoryModel({
                  subscriptionId: ObjectId(planData.planDetails.subscriptionId),
                  subId: result.id,
                  userId: planData.userId,
                  planName:planData.planDetails.planName,
                  planPrice:planData.planDetails.price,
                  email:planData.email,
                  firstName:planData.personalDetails.firstName,
                  lastName:planData.personalDetails.lastName,
                  date:new Date(result.current_period_start * 1000),
                  expiryDate: new Date(result.current_period_end * 1000),
                  isActive: true,
                  invoice_pdf :invoiceData.invoice_pdf
                });
                return subscriptionHistory.save().then(async(resp) => {
                  let userInfo = {
                      email: planData.personalDetails.email,
                      url: invoiceData.invoice_pdf,
                      subject:"Mail From Fatoura"
                    };
                    template.senSubsctiption(userInfo);

                  return {
                      status: 200,
                      message: "subscribe successfully",
                      success: true,
                      data: resp,
                  };
                })
              .catch((err) => {
              return err;
              });
          }
        })
    })
    

  }catch(error){
    console.log(error)

  }
}
 async purchansePlan(planData,customer){
     console.log("purchansePlan")
    try{
        let user =await userModel.findOne({ _id: planData.userId })
        user.subscription = {
            subscriptionId: ObjectId(planData.planDetails.subscriptionId),
            subId: customer.subId,
            priceId:planData.planDetails.priceId,
            customerid:customer.customerid,
            date: new Date(customer.periodStart * 1000),
            expiryDate: new Date(customer.periodEnd * 1000),
            isActive: true,
          }

          return user.save().then(async(resp)=>{
            
            if(resp){      
                const invoiceData = await customerOperation.getInvoice(customer);

                let subscriptionHistory = new subscriptionHistoryModel({
                    subscriptionId: ObjectId(planData.planDetails.subscriptionId),
                    subId: customer.subId,
                    userId: planData.userId,
                    planName:planData.planDetails.planName,
                    planPrice:planData.planDetails.price,
                    email:planData.email,
                    firstName:planData.personalDetails.firstName,
                    lastName:planData.personalDetails.lastName,
                    date: new Date(customer.periodStart * 1000),
                    expiryDate: new Date(customer.periodEnd * 1000),
                    isActive: true,
                    invoice_pdf :invoiceData.invoice_pdf
                  });
                  return subscriptionHistory.save().then(async(resp) => {
                    let userInfo = {
                        email: planData.email,
                        url: invoiceData.invoice_pdf,
                        subject:"Mail From Fatoura"
                      };
                      template.senSubsctiption(userInfo);

                    return {
                        status: 200,
                        message: "subscribe successfully",
                        success: true,
                        data: resp,
                    };
                  })
                .catch((err) => {
                return err;
                });
            }
          })

    }catch(error){
        return error
    }
    
      

}

async sendInvoices(planData, customer) {
    console.log(customer)
    try {
      const invoiceData = await customerOperation.getInvoice(customer);
      if (invoiceData) {
        var startDate = "";
        const isDate = new Date(invoiceData.period_start * 1000);
        startDate = isDate.toLocaleDateString("en-US");
        
          var html = `<!DOCTYPE html>
                        <html>
                        
                        <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http- equiv="X-UA-Compatible" content="IE=edge" />
                        <link rel="preconnect" href="https://fonts.gstatic.com">
                        <link href="https://fonts.googleapis.com
                        /css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/
                        bootstrap.min.css"> ​ <style>
                        tbody td {
                        padding: 2px;
                        padding-top: 7px;
                        padding-bottom: 7px;
                        }
                        
                        thead td {
                        font-weight: 600;
                        padding: 10px;
                        }
                        
                        p.para_class {
                        width: 180px;
                        }
                        
                        p {
                        margin-bottom: 0 !important;
                        }
                        </style>
                        </head>
                        
                        <body>
                        <div class="container-fluid p-4" style="width: 100%;">
                        <table style="width: 100%">
                        <tr>
                          <td> <img src="https://braininventory.com/images/mvp-logo.png" style="width: 110px;" /></td>
                          <td style="float: right;">
                            <h2>Invoice</h2>
                          </td>
                        </tr>
                        </table>
                        
                        <div class="mt-4 d-flex justify-content-between">
                        <table style="width: 100%">
                          <tr>
                            <td>
                              <table>
                                <tr>
                                  <td>
                                    <p class="para_class"> ${
                                      planData.streetAddress
                                    } ${planData.apartment}</p>
                                    <p class="para_class"> ,${planData.postal} ${planData.city}</p>
                                    <p class="para_class"> ,${planData.country}</p>
                                  </td>
                                </tr>
                        
                                <tr>
                                  <td>Bill to</td>
                                </tr>
                                <tr>
                                  <td>
                                    <p>${planData.fullName}</p>
                                    <p>${planData.email}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td style="float: right;">
                              <table>
                                <tr>
                                  <td>Invoice No : <span style="text-align: right;">${
                                    invoiceData.id
                                  }</span></td>
                                </tr>
                                <tr>
                                  <td>Date : <span style="text-align: right;">${startDate}</span></td>
                                </tr>
                                <tr>
                                  <td>Date due : <span>${startDate}</span></td>
                                </tr>
                              </table>
                            </td>
                        </table>
                        
                        </div>
                        <table>
                        <tr>
                          <td>
                          </td>
                        </tr>
                        </table>
                        <div class="w-100 mt-5">
                        <table class="w-100" style="width:100%; border-radius: 10px !important; border: 1px solid grey;overflow: hidden;padding: 10px;">
                    
                          <thead style="border-bottom: 2px solid grey;padding: 20px;">
                            <td>Description</td>
                            <td>Qty</td>
                            <td>Unit Price</td>
                            <td>Amount</td>
                          </thead>
                          <tbody style="background-color: aliceblue;">
                            <td>${planData.planName}</td>
                            <td>1</td>
                            <td>${invoiceData.subtotal / 100}$</td>
                            <td>${invoiceData.subtotal / 100}$</td>
                          </tbody>
                          <tbody>
                            <td colspan="2"></td>
                        
                            <td style="background-color: aliceblue;">Subtotal</td>
                            <td style="background-color: aliceblue;">${
                              invoiceData.subtotal / 100
                            }$</td>
                          </tbody>
                          <tbody>
                            <td colspan="2"></td>
                            <td style="background-color: aliceblue;">Amount Total</td>
                            <td style="background-color: aliceblue;">${
                              invoiceData.total / 100
                            }$</td>
                          </tbody>
                        </table>
                        </div>
                        </div>
                        </body>
                        </html>`;
        
        var options = {
          format: "A1",
          orientation: "portrait",
          border: "10mm",
          Some: true,
          all: true,
        };
        const date = Date.now();

        var document = {
          html: html,
          path: `public/invoices/output${date}.pdf`,
          type: "",
        };
        pdf
          .create(document, options)
          .then(async (res) => {
            // console.log(res);
            let userInfo = {
              path: document.path,
              email: planData.email,
              filename: `output${date}`,
            };
            const email = await sendEmail.sendEmail(userInfo);
            return true;
          })
          .catch(async (error) => {
            let userInfo = {
              filename: `output${date}.pdf`,
              path: document.path,
              email: planData.email,
            };
            const email = await sendEmail.sendEmail(userInfo);
            // console.log(email, "email");
            return true;
          });
      }
    } catch (error) {}
  }

async renewPlan(planaData){
    try{
        let user =await userModel.findOne({ "subscription.subId": planData.subId })
            user.subscription.date = new Date(planaData.period.start * 1000);
            user.subscription.expiryDate = new Date(planaData.period.end * 1000),
            user.subscription.isActive = true;
            return user.save().then(async(resp)=>{

                let planDetails = await subscriptionModel.findById({_id:user.subscription.subscriptionId})   
                if(resp){
                    let subscriptionHistory = new subscriptionHistoryModel({
                        subscriptionId: ObjectId(planData.planDetails.subscriptionId),
                        subId: customer.subId,
                        userId: resp.userId,
                        planName:planDetails.planName,
                        planPrice:planDetails.price,
                        email:resp.email,
                        firstName:resp.firstName,
                        lastName:resp.lastName,
                        date: new Date(planaData.period.start * 1000),
                        expiryDate: new Date(planaData.period.end * 1000),
                        isActive: true
                      });
                      return subscriptionHistory.save().then((resp) => {
                        return {
                            status: 200,
                            message: "subscribe successfully",
                            success: true,
                            data: resp,
                        };
                      })
                    .catch((err) => {
                        return err;
                    });
                }
            })            

    }catch(error){
        return error;
    }

}

async getCurrentPlan(req){
    let id = ObjectId(req.params.id);
    let data= await subscriptionModel.findOne({_id:id})
    if(data){
        return {
            status:200,
            success:true,
            data:data
        }
    }else{
        return {
            status:400,
            success:false,
            data:{}
        }
    }
}

async cancelPlan(req){
    try{
        let user =await userModel.findOne({ _id: req.userId });
        if(user){
            let subId= user.subscription.subId;
            if(user.subscription.isActive){
                const subscriptionDelete = await deleteSubscription.cancelSubscriptions(user.subscription.subId);
                if (subscriptionDelete.status === "canceled") {
                    // user.subscription={};
                    user.subscription.subId = null;
                    user.clientId = '';
                    user.secretCode = '';
                    user.paypalEmail = '';
                    user.paypalConnected = false;
                    
                    // return  user.save().then(async,(resp)=>{
                    return user.save().then(async (subs) => {
                    //    this.freeSubscription(user)
                       let SubscriptionHistory = await subscriptionHistoryModel.findOne({subId:subId}) 
                       SubscriptionHistory.isActive=false;
                       return SubscriptionHistory.save().then((result)=>{
                        return {
                            status: 200,
                            message: "Plan cancelled successfully",
                            success: true,
                        };
                       })
                      
                    }).catch((error)=>{
                        return error
                    })
                }
            }else{
                return {
                    status: 400,
                    message: "Plan already cancelled",
                    success: true,
                    data: "",
                };
            }
        }
    }catch(error){
        return error;
    }
}

async getSubscriptionHistory(req){
    try{
        let subscriptons = await subscriptionHistoryModel.find({}).sort({_id:-1}).exec();
        if(subscriptons.length > 0){
            return {
              staturs:200,
              success:true,
              data:subscriptons
            }
        }else{
          return {
            staturs:400,
            success:false,
            data:"",
            message:"Data not found"

          }
        }  
    }catch(error){
        return error;
    }
}

async subscribeFreePlan(req){
  try{
       let planData = req.body;
       let user =await userModel.findOne({ _id: req.userId })
       planData.fullName = planData.personalDetails.firstName + " " + planData.personalDetails.lastName;
       planData.email = user.email;
       planData.userId=req.userId;
       // console.log('plan data', planData);
       user.subscription = {
         subscriptionId: ObjectId(planData.planDetails.subscriptionId),
         priceId:planData.planDetails.priceId,
         date: new Date(),
         expiryDate: new Date(moment().add(1, 'y').format('YYYY-MM-DD')),
         isActive: true,
       }
       return user.save().then(async(resp)=>{
         if(resp){      
             let subscriptionHistory = new subscriptionHistoryModel({
                 subscriptionId: ObjectId(planData.planDetails.subscriptionId),
                 userId: planData.userId,
                 planName:planData.planDetails.planName,
                 planPrice:planData.planDetails.price,
                 email:planData.email,
                 firstName:planData.personalDetails.firstName,
                 lastName:planData.personalDetails.lastName,
                 date: new Date(),
                 expiryDate: new Date(moment().add(1, 'y').format('YYYY-MM-DD')),
                 isActive: true,
               });
               return subscriptionHistory.save().then(async(resp) => {
                 return {
                     status: 200,
                     message: "subscribe successfully",
                     success: true,
                     data: resp,
                 };
               })
             .catch((err) => {
               console.log(err)
             return err;
             });
         }
       })
  }catch(error){
    console.log(error)
   return error
  }
}
  
}
module.exports = new subscriptionController();
