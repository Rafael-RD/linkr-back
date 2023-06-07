import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";
import { deletePost, getTimeline, likes, listComments, newComment, newPostsCounter, newPostsUpdate, updatePost } from "../controllers/posts.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { editPublishSchema, publishSchema } from "../schemas/validate.schema.js";
import { getPostsDev, publish } from "../controllers/posts.controller.js";
import { commentSchema } from "../schemas/comment.schema.js";
import postIdValidation from "../middlewares/postIdValidation.middleware.js";

const postsRouter=Router();

postsRouter.get("/timeline", tokenValidation, getTimeline);
postsRouter.get("/postDev", getPostsDev);
postsRouter.post("/post",tokenValidation,schemaValidation(publishSchema), publish);
postsRouter.patch("/post", tokenValidation, schemaValidation(editPublishSchema), updatePost);
postsRouter.delete("/post/:postId", tokenValidation, deletePost);
postsRouter.post("/likes/:postId", tokenValidation, likes)
postsRouter.post("/post/comments/new/:postId", postIdValidation, tokenValidation, schemaValidation(commentSchema), newComment)
postsRouter.get("/post/comments/list/:postId", postIdValidation, tokenValidation, listComments)
postsRouter.get("/post/list/counter/:createdAt", tokenValidation, newPostsCounter)
postsRouter.get("/post/list/update/:createdAt", tokenValidation, newPostsUpdate)

export default postsRouter;