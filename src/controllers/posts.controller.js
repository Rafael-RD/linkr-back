import { getPostsDevRep } from "../repositories/posts.repository.js"

// GetPostsDev é um Get que está sendo utilizado para Desenvolvimento apenas para verificar se os dados
// estão sendo inseridos corretamente na tabela "posts"
export async function getPostsDev(req, res) {
    try {
        const response = await getPostsDevRep()
        console.table(response.rows)
        res.send(response.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function publish(req, res) {
    const {description, link, tags} = req.body
    const { authorization } = req.headers;

    if (!authorization) return res.sendStatus(401);
    const token = authorization.replace("Bearer ", "");

    try {
        const id  = jwt.verify(token, process.env.SECRET_KEY);

        const response = await publishPost(userId, description, link)
        res.send("Published")
    } catch (err) {
        res.status(500).send(err.message)
    }
}