import { findUserIdDB, findUserPostsDB, followUserRep, getFollowRep, searchUsersRep } from "../repositories/users.repository.js";

export async function searchUsers(req, res){
    const {search} = req.body
    const { id } = res.locals.tokenData
    try {
        const getUsers=await searchUsersRep(id, search);
        
        return res.send(getUsers.rows);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getUserPosts(req, res){
    const {id}=req.params;
    
    try {
        let resp=[];
        const userPosts=await findUserPostsDB(id);
        console.log(userPosts.rows[0])
        if(userPosts.rowCount===0){
            const userSearch=await findUserIdDB(id);
            userSearch.rows[0].noPosts=true;
            resp=userSearch.rows
        }else resp=userPosts.rows
        
        return res.send(resp);     
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function followUser(req, res){
    const { followedId } = req.body
    const { id } = res.locals.tokenData
    try {
        const userId = id
        if(userId == followedId){
            return res.send("It's not possible follow yourself")
        } 
        const follow= await followUserRep(userId, followedId);        
        return res.send(follow);
    } catch (error) {
        console.error(error);
        return res.sendStatus(501);
    }
}


export async function getFollow(req, res){
    const {id}=res.locals.tokenData;
    const { followedId } = req.params 
    
    try {
        const userId = id
        if(userId == followedId){
            return res.send("yourself")
        } 
        const userPosts = await getFollowRep(id, followedId);
        return res.send(userPosts.rows);     
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}