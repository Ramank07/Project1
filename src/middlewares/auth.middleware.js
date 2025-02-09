import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";

export const verifyJWT= asyncHandler(async(req,res,next)=>{

   try {
    const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
     if(!token){
         throw new ApiError(401, "Unauthorised request");
         
     }
    //  console.log("Extracted Token:", token);
     

     const decodedToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    //  console.log("Decoded Token:", decodedToken);
     const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
     if(!user){
         throw new ApiError(401, "Invalid Access Token")
     }
     req.user=user;
     next();
   } catch (error) {
    console.error("Error in verifyJWT middleware:", error.name, error.message);
        throw new ApiError(401, error?.message||"Invalid Token")
        
   }
})