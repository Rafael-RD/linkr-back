import { db } from "../database/database.connection.js";


export function findUserIdDB(id) {
    return db.query("SELECT * FROM users WHERE id=$1", [id]);
}

export function searchUsersRep(search){
    return db.query(`SELECT "id", "userName", "picture", "email" FROM users WHERE "userName" ILIKE $1 LIMIT 3 `, [search + "%"]);
}

export function findUserPostsDB(userId, page=1) {
    return db.query(`
        SELECT posts.*, users."userName", users.id AS userId, users.picture, sub_query_like.like_users, sub_query_like.qtt_likes, sub_query_tag.tag_array
        FROM posts LEFT JOIN (
            SELECT post_tag."postId", array_agg(tags.name) AS tag_array 
            FROM post_tag
            JOIN tags ON tags.id=post_tag."tagId"
            GROUP BY post_tag."postId"
            ) sub_query_tag ON posts.id=sub_query_tag."postId" 
        JOIN users ON posts."userId"=users.id
        LEFT JOIN (
            SELECT likes."postId", array_agg(users."userName") AS like_users, COUNT(likes.id) AS qtt_likes
            FROM likes JOIN users ON likes."userId"=users.id
            GROUP BY likes."postId"
        ) sub_query_like ON posts.id=sub_query_like."postId"
        WHERE posts."userId" = $1
        ORDER BY posts."createdAt" DESC 
        LIMIT 20 OFFSET $2;`, [userId, (page - 1) * 20]);
}