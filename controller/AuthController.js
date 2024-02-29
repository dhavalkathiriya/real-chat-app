import User from "../models/User.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/errorApi.js";

// register 
export const RegisterController = async (req,res) => {
  const { name, email,password,gender,profilePic} = req.body;
  try {

    const alreadyUser = await User.findOne({email});
    if (alreadyUser) {
      return res.status(201).json({
        success:false ,
        message:"User with email or username already exists"
      })
    }
 if(!name || !email || !password || !gender){
  return res.status(201).json({
    success:false ,
    message:"all fied is required"
  })
}
  const boyPic =`https://avatar.iran.liara.run/public/boy?username=${name}`
  const girlPic =`https://avatar.iran.liara.run/public/girl?username=${name}`

    const users = await new User({
      name,
      email,
      password,
      gender,
      profilePic:gender === "male" ? boyPic :girlPic
      
    }).save();
    const createdUser = await User.findById(users._id).select(
      "-password -refreshToken"
  )
  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
  }
   return res.status(201).json(new ApiResponse(201, createdUser, "Register successfully"));
  } catch (error) {
   return res.status(401).json(new ApiError(401,"somithing is wrong",error.message));
  }
};

const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

// login 
export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400,"email and password is required")
    }
    const user = await User.findOne({email});
    if (user) {
      res
        .status(201)
        .json(new ApiError(409, "User with email or username already exists"));
    }
    const ispassword = user.comparePassword(password)
    if (!ispassword) {
      throw new ApiError(401,"username and password unvalid")
    }
    const {accessToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")
    

    return res
    .status(200)
    .cookie("accessToken", accessToken, {
      maxAge:15 * 24 * 60 * 60 * 1000,
      httpOnly:true,
      sameSite:"strict"
    })
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
    
  } catch (error) {
    res.status(401).json(new ApiError(401,"something is wrong",error))
  }
};


// LOGOUT 
export const logOut =async(req,res) =>{
  await User.findByIdAndUpdate(
    req.body._id,
    {
        $set: {
            refreshToken: undefined
        }
    },
    {
        new: true
    }
)

const options = {
    httpOnly: true,
    secure: true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User logged Out"))
}



// forget password

export const passwordResetController = async (req, res) => {
  try {
    // user get email || newPassword || answer
    const { email, newPassword } = req.body;
    // valdiation
    if (!email || !newPassword ) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    // find user
    const user = await userModel.findOne({ email });
    //valdiation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "invalid user or answer",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your Password Has Been Reset Please Login !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In password reset API",
      error,
    }); 
  }
};

// all user delete
 export const allUserDelete = async(req,res)=>{
 try {
    await User.deleteMany()
    res.status(201).json(new ApiResponse(201,"delete sucessfuly"));
 } catch (error) {
  res.status(401).json(new ApiError(401,"something is wrong",error))
 }
}

// all user
 export const allUser = async(req,res)=>{
 try {
   const user =  await User.find({})
    res.status(201).json(new ApiResponse(201,user));
 } catch (error) {
  res.status(401).json(new ApiError(401,"something is wrong",error))
 }
}