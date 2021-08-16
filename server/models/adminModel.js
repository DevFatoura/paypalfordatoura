const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const AdminSchema = new Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, default: null },
    hash: String,
    token: { type: String, default: null },
    profileImage: { type: String, required: false, default: null },
    profileImageName: { type: String, required: false, default: null },
    gender: { type: String, default: null },
  },
  { timestamps: true }
);
AdminSchema.methods.setPassword = function (password) {
  this.hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
AdminSchema.methods.validatePassword = function (password, hash) {
  return bcrypt.compareSync(password, hash); // true
};
mongoose.model("Admin", AdminSchema);
