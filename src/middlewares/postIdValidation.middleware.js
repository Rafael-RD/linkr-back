import { findPostIdDB } from "../repositories/posts.repository.js";

export default async function postIdValidation(req, res, next) {
  const { postId } = req.params;

  try {
    const { rowCount } = await findPostIdDB(postId);
    if (!rowCount) return res.status(404).send("Post not found");
    next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(401);
  }
}
