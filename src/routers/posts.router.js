import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";
import { getTimeline } from "../controllers/posts.controller.js";

const postsRouter=Router();

postsRouter.get("/timeline", tokenValidation, getTimeline);

export default postsRouter;