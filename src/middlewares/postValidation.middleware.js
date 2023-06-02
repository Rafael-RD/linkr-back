import { db } from "../database/database.connection.js";
import { getUserIdForValidate } from "../repositories/posts.repository.js";

export default async function postUserValidation(req, res, next) {
    const { postId } = req.body;
    const { id } = res.locals.tokenData;

    try {
        const userId = await getUserIdForValidate(postId)
        console.log({id, userId})
        if (id !== userId) {
            return res.sendStatus(403);
        }
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}