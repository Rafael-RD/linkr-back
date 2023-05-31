import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";
import { getTimeline } from "../controllers/posts.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { publishSchema } from "../schemas/validate.schema.js";
import { getPostsDev, publish } from "../controllers/posts.controller.js";

const postsRouter=Router();

postsRouter.get("/timeline", tokenValidation, getTimeline);
postsRouter.get("/postDev", getPostsDev)
postsRouter.post("/post",tokenValidation,schemaValidation(publishSchema), publish)

export default postsRouter;