const mongoose = require("mongoose");
import users from "../../models/userModel";
const userModel = mongoose.model("Users");
exports.lastLoginUpdate = async(data) => {
    let user = await userModel.findOne({ _id: data });
    if(user){
        user.lastLogin=new Date();
        user.save();
    }

    
};