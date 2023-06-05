import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";
import { deletePost, getTimeline, likes, newComment, updatePost } from "../controllers/posts.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { editPublishSchema, publishSchema } from "../schemas/validate.schema.js";
import { getPostsDev, publish } from "../controllers/posts.controller.js";
import { commentSchema } from "../schemas/comment.schema.js";

const postsRouter=Router();

postsRouter.get("/timeline", tokenValidation, getTimeline);
postsRouter.get("/postDev", getPostsDev);
postsRouter.post("/post",tokenValidation,schemaValidation(publishSchema), publish);
postsRouter.patch("/post", tokenValidation, schemaValidation(editPublishSchema), updatePost);
postsRouter.delete("/post/:postId", tokenValidation, deletePost);
postsRouter.post("/likes/:postId", tokenValidation, likes)
postsRouter.post("/comments/new/:postId", tokenValidation, schemaValidation(commentSchema), newComment)

export default postsRouter;