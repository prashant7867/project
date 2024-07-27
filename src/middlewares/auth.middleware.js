import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import jwt, { decode } from "jsonwebtoken"
export const verifyJWT= asyncHandler(async(req,res,next)=>{
  try {
     const token= req.cookies?.accessToken || req.header("Autherization")?.replace("Bearer ","");
  
     if(!token){
      throw new ApiError(401,"Unautherized request")
     }
     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     
      const user=await User.findById(decodeToken?._id).select
     ("-password -refreshToken")
  
      if(!user){
          throw new ApiError(401,"InvalidAccess Token")
      }
  
      req.user=user;
      next()
  } catch (error) {
    throw new ApiError(401, error?.message || " Invalid access token")

  }
})