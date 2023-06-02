import { searchUsersRep } from "../repositories/users.repository.js";

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