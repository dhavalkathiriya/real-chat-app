import express from 'express'
import { sendMessage } from '../controller/messageController';


const messageRoute = express.Router()

messageRoute.post("/send/:id",sendMessage)



export default messageRoute;