
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/errorApi';
import { JWT_KEY } from '../config';
import User from '../models/User';

export const protectRoute =async(req,res,next)=>{

    try {
        const token =req.cookies.jwt;

        if (!token) {
            return res.status(401).json( new ApiError(401,"authorised no token") )
        }
        const decoded = jwt.verify(token,JWT_KEY)
        if (decoded) {
            return res.status(401).json( new ApiError(401,"unauthorised - invalid token") )
            
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json( new ApiError(401,"user is not found") )
            
        }
        req.user = user

        next()
    } catch (error) {
        return res.status(401).json( new ApiError(401,"Internal server error") )
        
    }
}