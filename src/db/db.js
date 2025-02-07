import mongoose from "mongoose";
import { Db_NAME } from "../constant.js";

const connectDB=async()=>{
    try {
        const connection=await mongoose.connect(`${process.env.MONGODB_URI}/${Db_NAME}`)
        console.log(`\n Mongo connected !! DB HOST:`);
        
    } catch (error) {
        console.log(" mongoDb connection Failed ",error);
        process.exit(1)
        
    }
}
export default connectDB;