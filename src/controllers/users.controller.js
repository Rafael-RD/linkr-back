import { getUserId } from "../repositories/users.repository";

export async function getPostsDev(req, res) {
    const { authorization } = req.headers
    if (!authorization) return res.sendStatus(401);
    const token = authorization.replace("Bearer ", "");

    try {
        const id  = jwt.verify(token, process.env.SECRET_KEY);
        const response = await getUserId(id)
        res.send(response.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}