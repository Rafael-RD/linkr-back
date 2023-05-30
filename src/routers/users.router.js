import { Router } from "express";
import { getUserId } from "../controllers/users.controller.js";


const userRouter = Router()
userRouter.get("/user", getUserId)

export default userRouter