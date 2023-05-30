import { getUserIdRep } from "../repositories/users.repository.js";
import jwt from "jsonwebtoken";
export async function getUserId(req, res) {
    const { authorization } = req.headers
    
    try {
        if (!authorization) return res.sendStatus(401);
        const token = authorization?.replace("Bearer ", "");
        // console.log(token)
        const {id}  = jwt.verify(token, process.env.SECRET_KEY);
        const response = await getUserIdRep(id)
        res.send(response.rows)
    } catch (err) {
        console.error(err)
        res.status(501).send(err.message)
    }
}