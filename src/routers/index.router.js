import { Router } from "express";
import cors from "cors";
import { json } from "express";
import authRouter from "./auth.router.js";
import postRouter from "./posts.router.js";
import userRouter from "./users.router.js";

const router = Router();
router.use(json());
router.use(cors());
router.use(authRouter);
router.use(postRouter)
router.use(userRouter)

export default router;
