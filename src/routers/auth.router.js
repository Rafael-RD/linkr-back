import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { signupSchema } from "../schemas/auth.schema.js";


const authRouter = Router();

authRouter.post("/signup", schemaValidation(signupSchema), signup);

export default authRouter;
