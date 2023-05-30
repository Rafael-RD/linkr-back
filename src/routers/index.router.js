import { Router } from "express";
import cors from "cors";
import { json } from "express";

const router = Router();
router.use(json());
router.use(cors());
// router.use();

export default router;
