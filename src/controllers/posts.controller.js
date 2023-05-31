import { getPostsDevRep, publishPost } from "../repositories/posts.repository.js"

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
    const {description, link} = req.body
    const {id} = res.locals.tokenData;
    try {
        const tags = description.split(" ").filter(word => word[0] === "#").map(t => t.replace("#", ""))
        const response = await publishPost(id, description, link, tags)
        res.status(201).send({id: response})
    } catch (err) {
        console.error(err)
        res.status(500).send(err.message)
    }
}