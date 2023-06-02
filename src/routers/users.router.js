import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { searchUsers } from "../controllers/users.controller.js";
import { searchSchema } from "../schemas/validate.schema.js";

const userRouter = Router()
userRouter.post("/searchUsers",tokenValidation, searchUsers)
export default userRouter