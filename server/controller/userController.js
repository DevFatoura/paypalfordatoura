import mongoose from 'mongoose'; 
import users from "../models/userModel";
const userModel = mongoose.model("Users");
import invites from "../models/inviteUserModel";
const inviteModel = mongoose.model("Invites");
import auth from "../services/auth/jwt";
const ObjectId = mongoose.Types.ObjectId;
import multer  from "multer";
import storage  from "../services/multer/multerConfig";
import bcrypt from "bcrypt";
import subscriptionController from './../controller/subscriptionController'
import subscriptionHistory from '../models/subscriptionHistoryModel';
const subscriptionHistoryModel = mongoose.model("SubscriptionHistory");
const template = require("../services/mailer/mailtamplates");
var singleUpload = multer({ storage: storage.storage }).single("file"); // for single file upload
var base64ToImage = require("base64-to-image");
const moment = require("moment");
import invoiceController from './../controller/invoiceController'



class userController{
 
  async socialLogin(req){
    try{
        return new Promise(async (resolve, reject) => {
            let socialData = req.body
            if ( socialData.email && socialData.firstName) {
                let user = await userModel.findOne({ email: socialData.email });
                if(user){
                    return user.save().then(async (userSaved) => {
                        return resolve ({
                            status: 200,
                            success: true,
                            data: userSaved,
                            token: userSaved.token,
                          });
                    })
 
                }else{
                  
                 inviteModel.findOne({email: socialData.email }).then(async(respEmail)=>{
                  if(respEmail !== null){
                   users.invitedUser = true ; 
                   users.subscription = {
                     subscriptionId: ObjectId(respEmail.subscription.subscriptionId),
                     date: new Date(),
                     expiryDate: new Date(moment().add(respEmail.days, 'days')),                      
                     isActive: true,
                   }
                  }
                  let users = new userModel();
                    users.email = socialData.email;
                    users.firstName = socialData.firstName;
                    users.lastName = socialData.lastName; 
                    users.isVerified=true;

                    let userData = await users.save();
                    if (userData) {
                        users.token = await auth.signJWT({ uid: userData._id, t: "USER" });
                        return users.save().then(async (userSaved) => { 
                            return resolve ({
                              status: 200,
                              success: true,
                              data: userSaved,
                              token: userSaved.token,
                            });
                          })
                          .catch((err) => {
                            return reject (error);
                          });
                      }
                    
                    else {
                      return resolve ({ status: 400, message: "not valid" });
                    }
                })
                   
                    


                }

            }else{
                return resolve ({ status: 400, message: "empty data" });

            }
            
        })


    }catch(error){
        return error 
    }
  }
  async saveUser(req){
      try{
          return new Promise(async (resolve, reject) => {
              let users = new userModel();
              let userData=req.body;
              var user = await userModel.findOne({email: userData.email });
              if(user == null){

                 inviteModel.findOne({email: userData.email }).then(async(respEmail)=>{
                   if(respEmail !== null){
                    users.invitedUser = true ; 
                    users.subscription = {
                      subscriptionId: ObjectId(respEmail.subscription.subscriptionId),
                      date: new Date(),
                      expiryDate: new Date(moment().add(respEmail.days, 'days')),                      
                      isActive: true,
                    }
                   }
                  users.email = userData.email;
                  users.firstName = userData.firstName;
                  users.lastName = userData.lastName;
                  users.phoneNumber = userData.phoneNumber;
                  if(userData.referallCode){
                    users.referallCode = userData.referallCode
                  }

                  console.log(users, 'users');
                  users.setPassword(userData.password);
                  console.log("users",users)
                  users.save(async (err, resp) => {
                    let verifyLink = `https://fatoura.work/auth/verifyEmail/${resp._id}`;
                        let data = {
                            email: req.body.email,
                            url: verifyLink,
                            subject:'Verification Message'
                        };
                        //  template.sendUserVerification(data);
                      let token = await auth.signJWT({ uid: resp._id, t: "USER" });
                      users.token=token;
                      users.save().then(async(userSaved)=>{
                        if(respEmail !== null){
                          this.addSubscriptionHistory(respEmail,userSaved)
                        }

                          return resolve({
                              status: 200,
                              success: true,
                              message:"Register succesfully",
                              token:token
                            }); 
                      })
                  })

                 })
                  
              }else{
                  return resolve({
                      status: 409,
                      success: false,
                      message:"Email Id already exists" ,
                    }); 
              }

          }).catch((error)=>{
              return reject (error)
          })

      }
      catch(error){
        console.log(error)
        return error;
      }
  }

  async addSubscriptionHistory(respEmail,user){
    let subscriptionHistory = new subscriptionHistoryModel({
      subscriptionId: ObjectId(respEmail.subscriptionId),
      userId: user._id,
      planName:respEmail.planName,
      planPrice:0,
      email:respEmail.email,
      firstName:respEmail.firstName,
      lastName:respEmail.lastName,
      date: new Date(),
      expiryDate: new Date(moment().add(respEmail.days, 'days').format("YYYY-MM-DD")),
      isActive: true,
    });
    return subscriptionHistory.save()
  }


  async checkUser(req){
      try{
          let loginData = req.body;
          let user = await userModel.findOne({ email: loginData.email })
          if(user){
              let validPassword = await bcrypt.compare(
                  loginData.password.toString(),
                  user.hash.toString()
              );
              if(validPassword){
                  let token = await auth.signJWT({ uid: user._id, t: "USER" });
                  user.token = token;    
                  return user.save().then(async(userSaved) => {
                    return {
                      status: 200,
                      success: true,
                      token: token,
                      message:"login successfully"
                    };
                    // if(userSaved.subscription.subscriptionId ==null){
                    //   let data =await subscriptionController.freeSubscription(userSaved);
                    //   return {
                    //     status: 200,
                    //     success: true,
                    //     token: token,
                    //     message:"login successfully"
                    //   };
                    // }else{
                    //     return {
                    //       status: 200,
                    //       success: true,
                    //       token: token,
                    //       message:"login successfully"
                    //     };
                    // }
                      
                  }) 
              }
              else{
                  return {
                      status: 400,
                      success: true,
                      data:'',
                      message:'Invalid password'
                  };
              }          
          }else{
            return {
              status: 400,
              success: false,
              message:"Email not foumd"
            };
          }
      }catch(error){
          return error;
      }
      
  }

  async forgetPassword(req){
    try{
      if (req.body.email) {
          let user =  await userModel.findOne({ email: req.body.email });
          if(user){
              let resetLink = `https://fatoura.work/auth/reset-password/${user._id}`;
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

  async resetPassword(req){
    try{
      const resetData = req.body;
      // validating user req
      if (resetData.password !== undefined && resetData.password !== "") {
  
        let userId = resetData._id ? resetData._id : null;
        let user = await userModel.findOne({ _id: adminId });
        if (admin) {
          user.setPassword(resetData.password);
          return user
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
    }catch(error){
      return error;
    }
  } 
  async getUserData(req) {
    
        var fullUrl = 'https://api.fatoura.work';
        
        try{
           if (req && req.userId) {
            let user = await userModel.findOne({ _id: ObjectId(req.userId)})
            if(user){
                user.profileImageName=user.profileImageName? fullUrl+'/uploads/' + user.profileImageName:null;
                user.companyDetails.companyLogo =user.companyDetails.companyLogo ? fullUrl+'/uploads/' + user.companyDetails.companyLogo:null;
                return {
                    status: 200,
                    message: "user data",
                    success: true,
                    data: user,
                  };
            }else{
                return {
                    status: 400,
                    message: "user data not found",
                    success: true,
                    data: "",
                  }; 
            }
           }
        }catch(error){
            return error;
        }
  }

    async updateUser(req){
        try{
            if(req && req.userId){
                const editData = req.body;
                let user = await userModel.findOne({ _id: ObjectId(req.userId) })
                if(user){
                    Object.entries(editData).map((entry) => {
                        let key = entry[0];
                        let value = entry[1];
                        user[key] = value;
                    });
                    console.log(user.phoneNumber)
                    return user.save().then((resp) => {
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
                }else{
                    return {
                        status: 400,
                        message: "Invalid User",
                        success: false,
                        data: {},
                      }
                }
            }
            else{
                return {
                    status: 400,
                    message: "variables are empty",
                    success: false,
                    data: {},
                  }
            }
        }catch(error){
            return error;
        }
    }

    async updateCompanyDetails(req){
        try{
            if(req && req.userId){
                const companyData = req.body;
                console.log(req.body);
                let user = await userModel.findOne({ _id: ObjectId(req.userId) })
                if(user){
                  user.companyDetails.companyName = companyData.companyName;
                  user.companyDetails.companyAddress = companyData.companyAddress;
                  user.companyDetails.entityID = companyData.entityID;
                  user.companyDetails.decimalSize = companyData.decimalSize || null;
                  return user.save().then((resp)=>{
                      return {
                          status: 200,
                          message: "Company Details save successully",
                          success: false,
                          data: resp
                        }
                  }).catch(error=>{
                    console.log(error)
                  })    
                }else{
                  return {
                    status: 400,
                    message: "User not found",
                    success: false,
                  }
                }               
            }else{
              return {
                status: 400,
                message: "Variables are empty",
                success: false,
                data: ""
              }
            }
        }catch(error){
          console.log(error)
            return error;
        }
        
    }

    async uploadProfile(req) {
      try {
        return new Promise(async (resolve, reject) => {
          var userId = req.userId;
          var base64Str = req.body.data;
          var path = "./public/uploads/";
          var optionalObj = { fileName: `image${Date.now()}`, type: "png" };
           base64ToImage(base64Str, path, optionalObj);
          var imageInfo = base64ToImage(base64Str, path, optionalObj);
          if (imageInfo) {
            var update = {
              profileImage: path,
              profileImageName: imageInfo.fileName,
            };
            userModel
              .updateOne({ _id: userId }, { $set: update })
              .then((result) => {
                if (result.nModified) {
                  return resolve({
                    status: 200,
                    profileImage: path,
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
        });
      } catch (error) {
        return next(error);
      }
  
    }

    async uploadCompanyLogo(req,res){
      return new Promise(async (resolve, reject) => {
        var userId = req.userId;
        let user = await userModel.findOne({ _id: ObjectId(req.userId) })

        var base64Str = req.body.data;
        var path = "./public/uploads/";
        var optionalObj = { fileName: `image${Date.now()}`, type: "png" };
         base64ToImage(base64Str, path, optionalObj);
        var imageInfo = base64ToImage(base64Str, path, optionalObj);
        if (imageInfo) {
          user.companyDetails.companyLogo= imageInfo.fileName;
          user.save().then((result) => {
            return resolve({
              status: 200,
              companyLogo: path,
              message: "update successfully",
            });
          
          
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
      });
    }

    async changePassword(req){
      try{
          const resetData = req.body;
          if(resetData.password !== undefined && resetData.password !== ""){
              let user = await userModel.findOne({ _id: req.userId });
              if(user) {
                  let validPassword = await bcrypt.compare(
                  resetData.oldPassword.toString(),
                  user.hash.toString()
                  );
                  if (validPassword) {
                    user.setPassword(resetData.password);
                    return user.save().then((resp) => {
                      return {
                          status: 200,
                          success: "success",
                          messag: "password update successfully",
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
                      data: '',
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

          }else{
              return {
                  status: 400,
                  message: "variables are not valid",
                  success: "false",
                  data: {},
              };
          
          }
      }catch(error){
          return error ;
      }
    }

    async removeImage(req){
      try{
        let user = await userModel.findOne({ _id: req.userId });
        if(user){
          user.profileImageName=null
          return user.save().then((resp)=>{
            return {
              status: 200,
              message: "Profile Image remove successfully",
              success: "true"
            }
          })
        }else{
          return {
            status: 400,
            message: "User Not found",
            success: "false"
          }
        }
        }catch(error){
          return error;
        }
      

    }

    async removeCompanyLogo(req){
      try{
        let user = await userModel.findOne({ _id: req.userId });
        if(user){
          user.companyDetails.companyLogo=null
          return user.save().then((resp)=>{
            return {
              status: 200,
              message: "Profile Image remove successfully",
              success: "true"
            }
          })
        }else{
          return {
            status: 400,
            message: "User Not found",
            success: "false"
          }
        }
        }catch(error){
          return error;
        }
      

    }

    async resetPassword(req){
      const resetData = req.body;
        if (resetData.password !== undefined && resetData.password !== "") {    
          let userId = resetData._id ? resetData._id : null;
          let user = await userModel.findOne({ _id: userId });
          if (user) {
            user.setPassword(resetData.password);
            return user.save().then((resp) => {
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
              message: "Invalid User",
              success: false,
              data: {},
            };
          }
        }
    }

    async verifyUser(req){
        const verifyUser = req.body;
        let userId = verifyUser._id ? verifyUser._id : null;
        let user = await userModel.findOne({ _id: userId });
        if(user){
            user.isVerified=true
            return user
              .save()
              .then((resp) => {
                // console.log(resp);
                return {
                  status: 200,
                  success: true,
                  messag: "User verified successfully",
                  token:user.token
                };
              })
              .catch((err) => {
                return err;
              });
        }else{
            return {
                status: 400,
                success: false,
                messag: "Not valid user",
              }; 
        }


    }

    async getInviteUser(req){
      try{
        let id = ObjectId(req.params.id);
        var invite = await inviteModel.findOne({_id: id });
        if(invite){
          return {
            status:200,
            success:true,
            data:invite
          }
        }else{
          return {
            status:400,
            success:false,
            message:"Not a valid user"
          }
        }
  
      }catch(error){
        return error;
      }


    }  
    
    async calculteSubscritption(){
      try{
        let users = await userModel.find();
        users.map(async(user)=>{
            if(user.subscription.expiryDate <= new Date()){
              if(new Date(moment(user.subscription.expiryDate).add(30, 'days'))>=new Date()){
                let result = await invoiceController.removeAllInvoiceOfUser(user._id);
              }
              if(moment(user.subscription.expiryDate).add(15, 'days').format("YYYY-MM-DD")==moment(new Date).format('YYYY-MM-DD')){
                let data = {
                    email: req.body.email,
                    url: verifyLink,
                    subject:'Verification Message'
                };
                template.sendNotification(data);

              }
              if(moment(user.subscription.expiryDate).add(23, 'days').format("YYYY-MM-DD")==moment(new Date).format('YYYY-MM-DD')){
                let data = {
                  email: req.body.email,
                  url: "https://fatoura.work/",
                  subject:'Verification Message'
                };
                template.sendNotification(data);
              }
            } 
            
          // }
        })
      }catch(error){

      }
    }

}
module.exports = new userController();
