import { db } from "../database/database.connection.js";

export default async function postUserValidation(req, res, next) {
    const { postId } = req.body;
    const { id } = res.locals.tokenData;

    try {
        const user = await db.query(
            `SELECT * FROM posts
            WHERE id=$1;`,
            [postId]
        );
        if (id !== user.rows[0].userId) {
            return res.sendStatus(403);
        }
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}