import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_KEY, REFRESH_JWT_KEY } from "../config/index.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add a Name"],
      maxlength: 32,
    },

    email: {
      type: String,
      trim: true,
      required: [true, "Please add a E-mail"],
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, "Please add a Password"],
      minlength: [6, "password must have at least six(6) characters"]
    },
    gender:{
    type:String,
    required:true,
    enum:["male","female"]
    },
    profilePic:{
      type:String,
      default:""

    }
  },
  { timestamps: true }
);

// encrypting password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// verify password
userSchema.methods.comparePassword = async function (yourPassword) {
  return await bcrypt.compare(yourPassword, this.password);
};

// get the token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, password: this.password },
    JWT_KEY,
    {
      expiresIn: 3600,
    }
  );
};

// refreshToken
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, REFRESH_JWT_KEY, { expiresIn: "2h" });
};

export default mongoose.model("User", userSchema);
