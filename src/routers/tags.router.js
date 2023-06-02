import { Router } from "express";
import { listHashtags, trending } from "../controllers/tags.controller.js";
import tokenValidation from "../middlewares/tokenValidation.middleware.js";

const tagsRouter = Router();

tagsRouter.get("/tags/trending", tokenValidation, trending);
tagsRouter.get("/tags/hashtag/:name", tokenValidation, listHashtags);

export default tagsRouter;
