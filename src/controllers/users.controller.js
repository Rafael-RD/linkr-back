import { findUserPostsDB, searchUsersRep } from "../repositories/users.repository.js";
import { getMetadata } from "../utils/metadata.utils.js";

export async function searchUsers(req, res){
    const {search} = req.body
    console.log(search)
    try {
        const getUsers=await searchUsersRep(search);
        
        return res.send(getUsers.rows);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getUserPosts(req, res){
    const {id}=req.params;
    
    
    try {
        const userPosts=await findUserPostsDB(id);
        
        const resp = [];
        for (const e of userPosts.rows) {
            const meta = await getMetadata(e.link);
            resp.push({
                ...e, linkMetadata: meta
            });
        }
        return res.send(resp);     
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}