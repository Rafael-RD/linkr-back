import { Router } from "express";
import cors from "cors";
import { json } from "express";
import authRouter from "./auth.router.js";

const router = Router();
router.use(json());
router.use(cors());
router.use(authRouter);

export default router;
