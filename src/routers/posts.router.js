import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";
import { deletePost, getTimeline, updatePost } from "../controllers/posts.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { editPublishSchema, publishSchema } from "../schemas/validate.schema.js";
import { getPostsDev, publish } from "../controllers/posts.controller.js";
import postUserValidation from "../middlewares/postValidation.middleware.js";

const postsRouter=Router();

postsRouter.get("/timeline", tokenValidation, getTimeline);
postsRouter.get("/postDev", getPostsDev);
postsRouter.post("/post",tokenValidation,schemaValidation(publishSchema), publish);
postsRouter.patch("/post", tokenValidation, postUserValidation, schemaValidation(editPublishSchema), updatePost);
postsRouter.delete("/post/:postId", tokenValidation, postUserValidation, deletePost);

export default postsRouter;