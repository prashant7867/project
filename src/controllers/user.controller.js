import {asyncHandler} from "../utils/asyncHandler.js";
import  {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken=async(userId)=>{
    try{
       const user= await User.findById(userId)
       const accessToken= user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        user.save({validBeforeSave: false})

    }catch(error){
        throw new ApiError(500,"something went wrong will genrating refresh and access token")
    }
}
const registerUser = asyncHandler(async (req,res)=>{
    //get user details from frontend
    // validation - not empty
    //check if user alredy exists: username 
    //check for images,check for avatar
    //upload them to cloudinary, avatar
    // create user object-create entry in db
     // remove password and refresh token field  from response
    //check for user creation 
    // return response
    const  {username , email, fullname,password,}=req.body;
    if([username,email,fullname,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"fullname is required ")
    }
    const existUser= await  User.findOne({
        $or:[{username},{email}]
    })
    if(existUser){
        throw new ApiError(409,"user with email or name alredy exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path  ;
     //const coverImageLocalPath=   req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.file && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }
     if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
     }
     const avatar=await uploadOnCloudinary(avatarLocalPath)
     const coverImage=await uploadOnCloudinary(coverImageLocalPath)

     if(!avatar){
        throw new ApiError(400,"Avatar file is required")
     }

     const user= await   User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage.url || "",
        email,
        password,
        username:username.toLowercase()
     })

     const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
     )
     if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user ")
     }
     return res.status(201).json(
           new ApiError(200,createdUser,"User registered succusfully")
     )


})  

const loginUser= asyncHandler(async (req,res)=>{
  // req body ->data
  // username or email
  // find the user
  //password check
  // access and refresh token
  //send cookie
   const {email,username,password}=req.body
   if(!email||!username){
      throw new ApiError(400,"username or email is required")
   }
     const user =await User.findOne({
        $or:[{username},{email}]
    })
     if (!user){
        throw new ApiError(404,"user does not exist")
     }
     const isPasswordValid= await user.isPasswordCorrect(password)
     if (!isPasswodCorrect){
        throw new ApiError(401,"Invalid user credentials")
     }
})


export {
    registerUser,
    loginUser
}