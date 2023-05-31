import { Router } from "express";
import { trending } from "../controllers/tags.controller.js";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";

const tagsRouter = Router();

tagsRouter.get("/tags/trending", tokenValidation, trending);

export default tagsRouter;
