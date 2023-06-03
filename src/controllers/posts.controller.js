import { deletePostByPostId, findTimeline, likesPostRep, updatePostByPostId } from "../repositories/posts.repository.js";
import { findUserIdDB } from "../repositories/users.repository.js";
import { getPostsDevRep, publishPost } from "../repositories/posts.repository.js"
import { getMetadata } from "../utils/metadata.utils.js";

export async function getTimeline(req, res) {
    const { id } = res.locals.tokenData;

    try {
        const idSearch = await findUserIdDB(id);
        if (idSearch.rowCount === 0) return res.sendStatus(401);
        const postsSearch = await findTimeline(1);

        const resp = [];
        for (const e of postsSearch.rows) {
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
    const { link, description } = req.body
    const { id } = res.locals.tokenData

    try {
        const tags = description.split(" ").filter(word => word[0] === "#").map(t => t.replace(/#/g, "").replace(",", "")).filter(tag => tag !== '');
        const response = await publishPost(id, description, link, tags)
        res.status(201).send({ id: response })
    } catch (err) {
        console.error(err)
        res.status(500).send(err.message)
    }
}

export async function updatePost(req, res) {
    const { description, postId } = req.body;
    const { id } = res.locals.tokenData;
    try {
        const tags = description.split(" ").filter(word => word[0] === "#").map(t => t.replace(/#/g, "").replace(",", "")).filter(tag => tag !== '');
        const response = await updatePostByPostId(description, postId, tags, id);
        res.status(response).send(description);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);

    }
}

export async function deletePost(req, res) {
    const { postId } = req.params;
    const { id } = res.locals.tokenData;

    try{
        const response = await deletePostByPostId(postId, id);
        res.sendStatus(response)
    }catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

export async function likes(req, res) {
    const { postId } = req.params
    const { id } = res.locals.tokenData

    try {
        const response = await likesPostRep(id, postId)
        return res.status(201).send(response.rows)
    } catch (err) {
        console.error(err)
        res.status(501).send(err.message)
    }
}