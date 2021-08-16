const mongoose = require("mongoose");
const Admin = require("../models/adminModel");
const adminModel = mongoose.model("Admin");
const auth = require("../services/auth/jwt");
import users from "../models/userModel";
const userModel = mongoose.model("Users");
import invites from "../models/inviteUserModel";
const inviteModel = mongoose.model("Invites");


const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;
const SubscriptionHistory =require('../models/subscriptionHistoryModel')
const subscriptionHistoryModel = mongoose.model("SubscriptionHistory");
import moment from "moment";
const template = require("../services/mailer/mailtamplates");
import invoiceController from './../controller/invoiceController';



class adminController{
    async createAdmin(req) {
        try{
            return new Promise(function (resolve, reject) {
                const registerData = req.body;
                if (registerData.email !== undefined && registerData.email !== "") {
                  let admin = new adminModel();
                  return adminModel.find({ email: registerData.email }).then((resp) => {
                    if (resp.length > 0) {
                      return resolve({
                        message: "Email already exsist",
                        success: false,
                        data: {},
                      });
                    } else {
                      admin.email = registerData.email;
                      admin.firstName = registerData.firstName;
                      admin.lastName = registerData.lastName;
                      admin.setPassword(registerData.password);
                      admin.save(async (err, resp) => {
                        let token = await auth.signJWT({ uid: resp._id, t: "ADMIN" });
                        admin.token = token;
                        return admin.save().then((adminSaved) => {
                          return resolve({
                            status: 200,
                            success: true,
                            data: adminSaved,
                            token: token,
                          });
                        });
                      });
                    }
                  });
                } else {
                  return reject({
                      status:400,
                      success:false,
                      message:"Invalid email"
                  })
              }
              });
        }catch(error){
            console.log(error)
        }
        
    }

    async adminLogin(req) {
        let loginData = req.body;
        if (
          loginData.email !== undefined &&
          loginData.email !== "" &&
          loginData.password !== undefined &&
          loginData.password !== ""
        ) {
          let admin = await adminModel.findOne({ email: loginData.email });
          // console.log(loginData.email, admin);
          if (admin) {
              let validPassword = await admin.validatePassword(
                loginData.password,
                admin.hash
              );
              console.log(validPassword);
              if (validPassword) {
                let token = await auth.signJWT({ uid: admin._id, t: "ADMIN" });
                admin.token = token;
                return admin.save().then((adminSaved) => {
                  return {
                    status: 200,
                    success: true,
                    data: adminSaved,
                    token: token,
                  };
                });
              } else {
                return {
                  status: 400,
                  message: "Invalid Password",
                  success: false,
                  data: {},
                };
              }
            
          } else {
            return {
              status: 400,
              message: "Invalid Email",
              success: false,
              data: {},
            };
          }
        } else {
          return { status: 400, message: "not valid" };
        }
    }

    async forgetPassword(req){
      try{
        if (req.body.email) {
            let admin =  await adminModel.findOne({ email: req.body.email });
            if(admin){
                let resetLink = `https://admin.fatoura.work/resetPassword/${admin._id}`;
                let data = {
                    email: req.body.email,
                    url: resetLink,
                    subject:'reset password'
                };
                return template.sendForgetMail(data).then((resp) => {
                    return { status: 200, success: true, message: "Email sent successfully" };
                })
                .catch((errr) => {
                  return error
                });

            }else{
                return { status: 400, success: false, message: "Email not exsist" };

            }

        }else{
            return { status: 400, success: false, message: "Email not exsist" };

        }
    }catch(error){
      return error;
    }

    }

    async resetPassword(req) {
      const resetData = req.body;
      // validating user req
      if (resetData.password !== undefined && resetData.password !== "") {
  
        let adminId = resetData._id ? resetData._id : null;
        let admin = await adminModel.findOne({ _id: adminId });
        if (admin) {
          admin.setPassword(resetData.password);
          return admin
            .save()
            .then((resp) => {
              // console.log(resp);
              return {
                status: 200,
                success: true,
                messag: "password changed successfully",
              };
            })
            .catch((err) => {
              return err;
            });
        } else {
          return {
            status: 400,
            message: "Invalid Admin",
            success: false,
            data: {},
          };
        }
      }
    }


    async getAdminData(req) {
        try {
          if (req && req.userId) {
            return adminModel.findOne({ _id: ObjectId(req.userId) }).then((resp) => {
                if (resp !== null) {
                  return {
                    status: 200,
                    success: true,
                    result: resp,
                  };
                } else {
                  return {
                    status: 200,
                    success: true,
                    msg: "Not found !!",
                  };
                }
              });
          }
        } catch {
          return {
            status: 500,
            message: "server error",
            success: false,
            data: {},
          };
        }
    }

   async uploadImage(req){
        try{
          return new Promise(async (resolve, reject) => {  
            console.log(req.body)              
                  if (req.body) {
                    var adminId = ObjectId(req.userId);
                    var update = {
                      profileImage: req.body.image
                    };
                    return adminModel
                      .updateOne({ _id: adminId }, { $set: update })
                      .then((result) => {
                        if (result.nModified) {
                          return resolve({
                            status: 200,
                            profileImage: update.profileImage,
                            message: "update successfully",
                          });
                        } else {
                          return resolve({
                            status: 400,
                            message: "Unable to update profile pic!",
                          });
                        }
                      })
                      .catch((err) => {
                        return reject({ status: 500, message: "internal error" });
                      });
                  } else {
                    return reject({
                      status: 500,
                      message: "File not found",
                      url: "",
                      success: false,
                    });
                  }
              //   });
          })
      }catch(error){
          console.log(error)
          return error;
      }
  
    }

    async updateAdminProfile(req) {
        try {
          const editData = req.body;
          let admin = await adminModel.findOne({ _id: req.userId });
          if (admin) {
            Object.entries(editData).map((entry) => {
              let key = entry[0];
              let value = entry[1];
              admin[key] = value;
            });
            return admin
              .save()
              .then((resp) => {
                return {
                  status: 200,
                  message: "Update successfully",
                  success: true,
                  data: resp,
                };
              })
              .catch((err) => {
                return err;
              });
          } else {
            return {
              status: 400,
              message: "Invalid User",
              success: false,
              data: {},
            };
          }
        } catch (error) {
          console.log("error", error);
          return {
            status: 500,
            message: "server error",
            success: false,
            data: {},
          };
        }
    }

    async updateAdminPassword(req) {
        const resetData = req.body;
        // validating user req
        try {
          if (resetData.password !== undefined && resetData.password !== "") {
            let userId = req.userId ? req.userId : null;
            let user = await adminModel.findOne({ _id: userId });
            if (user) {
              let validPassword = await bcrypt.compare(
                resetData.oldPassword.toString(),
                user.hash.toString()
              );
              if (validPassword) {
                user.setPassword(resetData.password);
                return user
                  .save()
                  .then((resp) => {
                    return {
                      status: 200,
                      success: "success",
                      message: "password update successfully",
                    };
                  })
                  .catch((err) => {
                    return err;
                  });
              } else {
                return {
                  status: 400,
                  message: "Current Password Not Match !!",
                  success: "error",
                  data: {},
                };
              }
            } else {
              return {
                status: 400,
                message: "Invalid User",
                success: "error",
                data: {},
              };
            }
          }
        } catch {
          return {
            status: 500,
            message: "internal server error",
            success: "error",
            data: {},
          };
        }
    }

    async getSaleReport(){
        try{
         var now = new Date();
        let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let todaysEarning=   await subscriptionHistoryModel.aggregate([{
          $match :  {createdAt: { $gte: startOfToday }  }},
          {
            $group : {
                _id : null,
                total : {
                    $sum : "$planPrice"
                }
            }
  
          }]);
          let yesterdayData=await this.getYesterdayData();
          let weeklyEarning= await this.getWeeklyEarning();
          let monthlyEarning =await this.getMonthlyData();
          let lifeTimeEarning = await this.getTotalEarning();
          return Promise.all([{"todaysEarning":todaysEarning,"yesterdayEarnig":yesterdayData, "weeklyEarning":weeklyEarning, "monthlyEarning":monthlyEarning,"lifeTimeEarning":lifeTimeEarning}]).then((result) => {
            return {
              status:200,
              success:true,
              data:result
            }
          }).catch((error)=>{
            return error;
          })
          
        }catch(error){
          return error;
        }
      }
    
    async getSaleReport(){
        try{
          
            var now = new Date();
            let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let todaysEarning=   await subscriptionHistoryModel.aggregate([{
            $match :  {createdAt: { $gte: startOfToday }  }},
            {
                $group : {
                    _id : null,
                    total : {
                        $sum : "$planPrice"
                    }
            }
  
            }]);
            let yesterdayData=await this.getYesterdayData();
            let weeklyEarning= await this.getWeeklyEarning();
            let monthlyEarning =await this.getMonthlyData();
            let lifeTimeEarning = await this.getTotalEarning();
            return Promise.all([{"todaysEarning":todaysEarning,"yesterdayEarnig":yesterdayData, "weeklyEarning":weeklyEarning, "monthlyEarning":monthlyEarning,"lifeTimeEarning":lifeTimeEarning}]).then((result) => {
                return {
                status:200,
                success:true,
                data:result
                }
            }).catch((error)=>{
                return error;
            })
          
        }catch(error){
          return error;
        }
      }

      async getYesterdayData(){
        var now = new Date();
        let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let yesterDay=moment().subtract(1, "days").format("YYYY-MM-DD");
      
        return await subscriptionHistoryModel.aggregate([
          { $match: { 
            createdAt: {$gte:new Date(yesterDay) , $lt:startOfToday}
          }},{
            $group : {
              _id : null,
              total : {
                  $sum : "$planPrice"
              }
            }
          }]);
      }
  
      async getWeeklyEarning(){
        var weekDate=moment().subtract(7, "days").format("YYYY-MM-DD");
        return await subscriptionHistoryModel.aggregate([{
          $match :  {createdAt: { $gte: new Date(weekDate) }  }},
          {
            $group : {
                _id : null,
                total : {
                    $sum : "$planPrice"
                }
            }
  
          }]);    
      }
      
      async getMonthlyData(){
        let monthDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
        return await subscriptionHistoryModel.aggregate([{
          $match :  {createdAt: { $gte: new Date(monthDate) }  }},
          {
            $group : {
                _id : null,
                total : {
                    $sum : "$planPrice"
                }
            }
  
          }]); 
  
      }
  
    async getTotalEarning(){
        let monthDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
        return await subscriptionHistoryModel.aggregate([{
          $match :  {}
        },
          {
            $group : {
                _id : null,
                total : {
                    $sum : "$planPrice"
                }
            }
  
          }]); 
  
    }
    async weeklyGraph(req){
      try{
        const weekGraph = await subscriptionHistoryModel.aggregate([
          {
              $match:{
              createdAt:{$gt: new Date(req.body.fromDate),$lte: new Date(req.body.endDate)}
            }
          },
          {$group:{
            _id: { $dayOfWeek: { date: "$createdAt" } }, 
             count:{$sum:1},
             total : {
              $sum : "$planPrice"
          }
        }}
        ])
        return {
          status:200,
          success:true,
          data:weekGraph
        }
      }
      catch(error){
        return error;
      }
    }
    async monthGraph(req){
      try{
        const monthGraph = await subscriptionHistoryModel.aggregate([
          {
              $match:{
              createdAt:{$gte: new Date(req.body.fromDate),$lte: new Date(req.body.endDate)}              
              }
          },
          {$group:{
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 

             count:{$sum:1},
             total : {
              $sum : "$planPrice"
          }

        }}
          
        ])
        return {
          status:200,
          success:true,
          data:monthGraph
        }
      }catch(error){
        console.log(error)

      }
    }
    async getChartData(req){
        try{
          const FIRST_MONTH = 1
          const LAST_MONTH = 12
          var now = new Date();

          let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          let YEAR_BEFORE = new Date()

  
          const monthsArray = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
          
          let data= await subscriptionHistoryModel.aggregate([{ 
            $match: { 
            createdAt: {$gte: new Date(req.body.fromDate), 
              $lt: new Date(req.body.endDate)}
          }
          },
            { 
                $group: {
                    _id: { "year_month": { $substrCP: [ "$createdAt", 0, 7 ] } }, 
                    count: { $sum: 1 },
                    total : {
                      $sum : "$planPrice"
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
            let finalResult ;
            if(data.length>0){
               finalResult=data[0].data
  
            }else{
               finalResult=[];
            }
            return {
              status:200,
              success:true,
              data:finalResult
            }
        }catch(error){
          console.log(error)
          return error;
          
        }
    }

    async getAllUsers(req){
        try{
            let usersList= await userModel.find();
            if(usersList.length>0){
                return{
                    status:200,
                    success:true,
                    data:usersList
                }
            }else{
                return {
                    status:400,
                    success:false,
                    data:'',
                    message:"users not found"
                }
            }
        }catch(error){
            return error
        }
            
    }
    
    async inviteUser(req){
      return new Promise(async (resolve, reject) => {
        return userModel.findOne({email: req.body.email }).then(async(user)=>{
          if(user){
            return resolve ({
              status:200,
              success:true,
              message:"User already registered"
            })
          }else{
            console.log("user")

            let invites = new inviteModel();
            var invite = await inviteModel.findOne({email: req.body.email });
            if(invite == null ){
              invites.email = req.body.email;
              invites.firstName = req.body.firstName;
              invites.lastName = req.body.lastName;
              invites.days = req.body.days;
              invites.planName = req.body.planName;
              invites.subscription.subscriptionId = req.body.subscriptionId;
              return invites.save().then(async(resp) => {
                  let data = {
                    email: req.body.email,
                    subject:'Invitation from fatoura',
                    url:`https://fatoura.work/auth/signup/?id=${resp._id}`
                  }; 
                  return template.sendInvitationMail(data).then(async(resp1)=>{
                  return resolve({
                    status:200,
                    success:true,
                    message:"Invitation sent successfully"
                  })
              }).catch((error)=>{
                return reject(error);
              }); 
            })
            }else{
              return resolve({
                status:200,
                success:true,
                message:"Invitation Already Sent"
              })
          }
            }
        })
          
      })
        
    }

    async deleteUser(req){
      try{
        let user = await userModel.remove({_id : req.body.userId});
        console.log(user.n);
        if(user.n > 0){
          return invoiceController.removeAllInvoiceOfUser(req.body.userId).then(resp=>{
            console.log(resp)
            if(resp.n > 0){
              return{
                status:200,
                success:true,
                message:"Delete user successfully"
              } 
            }
            return{
              status:200,
              success:true,
              message:"Delete user successfully"
            } 
          })
        }
      }catch(error){
        return error;
      }
    }

    async getSubscriptionHistory(){
      try{
        let result = await subscriptionHistoryModel.find();
        if(result.length){
          return{
            status:200,
            success:true,
            data:result
          }
        }
      }catch(error){
        return errror
      }
    }
    async sendQuery(req){
      try{
        let data ={
          email:'hello@fatoura.work',
          from:req.body.email,
          query:req.body.query,
          name:req.body.name
        }
        return template.sendQuery(data).then((resp) => {
          return { status: 200, success: true, message: "Email sent successfully" };
      })

      }catch(error){
        console.log(error)
        return error
      }
    }
}
module.exports = new adminController();

