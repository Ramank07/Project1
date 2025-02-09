import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespose.js";

const generateAccessandRefreshToken=async(userId)=>{
    try {
        const user=await User.findById({userId});
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

       await user.save({validateBeforeSafe: false});

       return {accessToken, refreshToken}

    } catch (error) {
        console.log("error on token generation error:",error);
        throw new ApiError(500, "something went wrong while genration refresh tokken")
        
    }
}


export const registerUser = asyncHandler(async (req, res) => {
    //get the user detail from req.body
    //validation-not empty
    //check for already exists
    //check for image and avatars
    //upload to cloudinary
    //create user object-create entry in db
    //remove password and refresh token from respose
    //check for user creation   
    //return res

    const { fullName, userName, email, password } = req.body;
    if (
        [fullName, userName, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(400, "User Already Exist")
    }

    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;

   


    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)
    //  console.log(avatarLocalpath);
    // console.log(coverImageLocalpath);
    // console.log(avatar);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        email,
        userName: userName.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(400, "Something went wrong while regitration")
    }

    res.status(200).json(
        new ApiResponse(200, createdUser, "user Registered Successfully")
    )

})

export const loginUser= asyncHandler(async(req,res)=>{

        //data from req.body
        //check for username and password
        //find user
        //check for paasword
        //access and refresh token
        //send cookie


        const {email,userName, password}=req.body;
        if(!(userName || email)){
            throw new ApiError(400, "username or email is required")
        }

      const user= await  User.findOne({$or:[{userName},{email}]});
      if(!user){
        throw new ApiError(400,"user not exist")
      }

      const isPasswordValid=await user.isPasswordCorrect(password);

      if(!isPasswordValid){
        throw new ApiError(400,"Invalid user cradiential")
      }
      const {accessToken, refreshToken}=generateAccessandRefreshToken(user._id);

      const loggedInUser= await User.findById(user._id).select("-password -refreshToken");
      const option={
        httpOnly:true,
        secure:true
      }
      res.status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
        new ApiResponse(200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User LoggedIn successfully"
        )
      )


})
export const logoutUser=asyncHandler(async(req,res)=>{
   
   await User.findByIdAndUpdate( req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },
        {
            new: true
        }
    )
    const option={
        httpOnly:true,
        secure:true
      }

      return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200,{}," User Logged out"))



    
})