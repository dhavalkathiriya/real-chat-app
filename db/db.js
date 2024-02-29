import mongoose from "mongoose";
import { DB_URL } from "../config/index.js";

const dbConnect = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("database is coonected");
  } catch (error) {
    console.log("databese is failed",error);
  }   
};  
  
export default dbConnect;
