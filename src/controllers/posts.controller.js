import { findTimeline } from "../repositories/posts.repository.js";
import { findUserIdDB } from "../repositories/users.repository.js";

export async function getTimeline(req, res){
    const {id}=res.locals.tokenData;

    try {
        const idSearch=await findUserIdDB(id);
        if(idSearch.rowCount===0) return res.sendStatus(401);
        const postsSearch=await findTimeline(1);
        return res.send(postsSearch.rows);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}