import { Router } from "express";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { publishSchema } from "../schemas/validate.schema.js";
import { getPostsDev, publish } from "../controllers/posts.controller.js";

const postRouter = Router()
postRouter.get("/postDev", getPostsDev)
postRouter.post("/post",schemaValidation(publishSchema), publish)

export default postRouter