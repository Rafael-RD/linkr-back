import { findTimeline } from "../repositories/posts.repository.js";
import { findUserIdDB } from "../repositories/users.repository.js";
import { getPostsDevRep, publishPost } from "../repositories/posts.repository.js"

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
        const tags = description.split(" ").filter(word => word[0] === "#").map(t => t.replace("#", "").replace(",", ""))
        const response = await publishPost(id, description, link, tags)
        res.status(201).send({id: response})
    } catch (err) {
        console.error(err)
        res.status(500).send(err.message)
    }
}