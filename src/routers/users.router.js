import { Router } from "express";
import { getUserId } from "../repositories/users.repository.js";

const userRouter = Router()
userRouter.get("/user", getUserId)

export default userRouter