import express from 'express'
import { LoginController, RegisterController, allUser, allUserDelete, logOut } from '../controller/AuthController.js'
import { JwtVerify } from '../middleware/AuthMiddleware.js'

const authRoute = express.Router()

authRoute.post("/login",LoginController)
authRoute.post("/register",RegisterController)
authRoute.post("/logout",JwtVerify,logOut)

export default authRoute