import mongoose from 'mongoose'; 
import paypalSubscription from "../models/payPalSubscriptionModel";
const paypalSubscriptionModel = mongoose.model("paypalSubscription");
const ObjectId = mongoose.Types.ObjectId;
import paypalsServices from "../services/paypalsServices";
import users from "../models/userModel";
const userModel = mongoose.model("Users");
import subscriptionHistoryModel from '../models/subscriptionHistoryModel';

class paypalSubscriptionController {
    async createSubscription(req) {
        try{
            console.log("..........",req.body)
            let subscriptionData = req.body;
            if(subscriptionData && subscriptionData.productName){
               let product = await paypalsServices.createProduct(req.body.productName);
               if(product){
                   console.log("product",product)
                       var planDetails = {
                        productId:product.id,
                        name:subscriptionData.planName,
                        description:subscriptionData.description,
                        price:subscriptionData.price
                       }
                       let subscription = new paypalSubscriptionModel({
                        planName: subscriptionData.planName,
                        planPrice: subscriptionData.price,
                        planDuration:'year',
                        description: subscriptionData.description,
                        features:subscriptionData.features
                    });
                    return await paypalsServices.createplan(planDetails).then(async(plan)=>{
                        console.log("plan",plan.id,plan.product_id)
                        let resFromPaypal = {
                            planId: plan.id,
                            productId: plan.product_id,
                        };
                        subscription.paypalData = resFromPaypal;
                        subscription.isHidden = true;
                        const result = await subscription.save();
                        return result
            
                    });                   
               }


            }
        }catch(error){
            console.log(error)
        }
    }

    async getPlans(){
        try{
            let plans = await paypalSubscriptionModel.find();
            if(plans.length){
                return{
                    success:true,
                    status:200,
                    data:plans
                }
            }
            return{
                success:false,
                status:400,
                data:[],
                message:"Data not found"
            }
        }catch(error){
            return error
        }
    }

    async subscribePlan(req){
        try{
            if(req.body.planId){
                let user = await userModel.findById({_id:req.userId})
                if(user){
                    return paypalsServices.createSubscription(req.body)
                    .then(async(resp)=>{
                        console.log(resp);
                        user.subscription.tempSubId = resp.id;
                        let result = await user.save()
                        if(result){
                            return {
                                status:200,
                                success:true,
                                data:resp
                            }
                        }
                    })
                    .catch((error) => {
                        console.log("Error", JSON.stringify(error));
                        return error;
                    })
                }
            }
        }catch(error){
            return error;
        }
    }

    async verifyStatus(req){
        try{
            if(req.body.subId){
                let user = await userModel.findOne({_id:req.userId});
                if(user?.subscription?.tempSubId === req.body.subId) {
                    return paypalsServices.checkStatus(req.body).then(async(result)=>{
                        if(result){
                            console.log(JSON.stringify(result))
                            if(result.status == "ACTIVE"){
                                let body ={
                                    userId:req.userId,
                                    subscriptionId:req.body.subscriptionId,
                                    subId:req.body.subId,
                                    date:new Date(result.start_time),
                                    expiryDate:new Date(result.billing_info.next_billing_time),
                                    isActive:true,
                                    planName:req.body.planName,
                                    planPrice:req.body.planPrice
                                }
                                let finalResult = this.injectSubscription(body)
                                return finalResult
                            }
                        }else{
    
                        }
                    })
                } else {
                    return {
                        status: 400,
                        success: false,
                        message: 'Wrong Subscription ID'
                    };
                }
            }
        }catch(error){

        }
    }

    async injectSubscription(req){
        try{
            let user = await userModel.findOne({_id:req.userId});
            if(user){
                if(user.subscription.subId) {
                    console.log('[PaypalCont] Cancel Subscription start')
                    paypalsServices.cancelSubscription({subId: user.subscription.subId})
                    .then((resp) => {
                        console.log('[PaypalCont] Cancel Subscription finished', resp);
                    })
                    .catch((error) => {
                        return {
                            status: 400,
                            success: false,
                            message: 'Canceling current plan failed',
                            data: error
                        };
                    })
                }
                console.log('[PaypalCont] Inject subscription start')
                user.subscription.subscriptionId = req.subscriptionId;
                user.subscription.subId = req.subId;
                user.subscription.date = req.date;
                user.subscription.expiryDate = req.expiryDate;
                user.subscription.isActive = req.isActive;
                user.subscription.tempSubId = null;
            }
            return user.save().then(async(result) =>{
                if(result){                    
                    let subscriptionHistory = new subscriptionHistoryModel({
                        subscriptionId: ObjectId(req.subscriptionId),
                        subId:result.subscription.subId,
                        userId: req.userId,
                        planName:req.planName,
                        planPrice:req.planPrice,
                        email:result.email,
                        firstName:result.firstName,
                        lastName:result.lastName,
                        date:new Date(result.subscription.date),
                        expiryDate: new Date(result.subscription.expiryDate),
                        isActive: true,
                    });
                    return subscriptionHistory.save().then(resp=>{
                        return {
                            status: 200,
                            message: "subscribe successfully",
                            success: true,
                        };
                    });
                }
            })
        }catch(error){

        }
    }

    async cancelCurrentSubscription(req) {
        try {
            return paypalsServices.cancelSubscription({subId: req.body.subId})
            .then(async (cancelResult) => {
                console.log('[PaypalCont] Cancel Current Subscription', cancelResult);  
                if(cancelResult.success) {
                    let user = await userModel.findOne({_id:req.userId});
                    if (user) {
                        user.subscription.subId = null;
                        user.clientId = '';
                        user.secretCode = '';
                        user.paypalEmail = '';
                        user.paypalConnected = false;
                    }
                    return user.save()
                    .then(() => {
                        return {
                            status: 200,
                            success: true,
                            message: "Plan cancelled"
                        }
                    })
                    .catch((error) => error);
                }
            })
            .catch((error) => error);
        } catch (error) {
            return error;
        }
    }

}
module.exports = new paypalSubscriptionController();
