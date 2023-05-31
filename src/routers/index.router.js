import { Router } from "express";
import cors from "cors";
import { json } from "express";
import authRouter from "./auth.router.js";
import postsRouter from "./posts.router.js";

const router = Router();
router.use(json());
router.use(cors());
router.use(authRouter);
router.use(postsRouter);

export default router;
