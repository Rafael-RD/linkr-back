import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";
import { followUser, getFollow, getUserPosts, searchUsers } from "../controllers/users.controller.js";
import userIdExistsMiddleware from "../middlewares/userIdExists.middleware.js";

const userRouter = Router();

userRouter.post("/searchUsers",tokenValidation, searchUsers);
userRouter.get("/user/:id", tokenValidation, userIdExistsMiddleware, getUserPosts);
userRouter.post("/follow",tokenValidation, followUser);
userRouter.get("/getFollow/:followedId", tokenValidation, getFollow);

export default userRouter;