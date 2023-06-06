import { findUserIdDB } from "../repositories/users.repository.js";

export default async function userIdExistsMiddleware(req, res, next){
    const {id}= req.params

    try {
        const userSearch=await findUserIdDB(id);
        if(!userSearch.rowCount) return res.status(404).send('user not found');
        delete userSearch.rows[0].password;
        res.locals.userInfo=userSearch.rows;
        next()
    } catch (error) {
        return res.sendStatus(500);
    }
}