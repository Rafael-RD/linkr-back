import { getUserIdForValidate } from "../repositories/posts.repository.js";

export default async function postUserValidation(req, res, next) {
    const { postId } = req.params;
    const { id } = res.locals.tokenData;
    try {
        console.log(postId)
        console.log(id)
        const userId = await getUserIdForValidate(postId)
        if (id !== userId) {
            return res.sendStatus(403);
        }
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}