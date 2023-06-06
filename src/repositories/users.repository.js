import { db } from "../database/database.connection.js";


export function findUserIdDB(id) {
    return db.query("SELECT * FROM users WHERE id=$1", [id]);
}

export function searchUsersRep(id, search){
    return db.query(`
    SELECT "id", "userName", "picture", "email",
    EXISTS (
        SELECT 1 FROM follows WHERE "userId" = $1 AND followed = users.id
    ) AS is_following
    FROM users WHERE "userName" ILIKE $2
    ORDER BY is_following DESC, "userName" ASC
    LIMIT 3 `, [id, search + "%"]);
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

export async function followUserRep(userId, followedId) {
   
    const verify = await db.query(`
        SELECT * FROM follows WHERE "userId"=$1 AND followed=$2`
        , [userId, followedId]);
        
    if(verify.rows[0]) {
        await db.query(
			`DELETE FROM follows
			WHERE "userId"=$1 AND followed=$2;
            `,[userId, followedId]);
        return "Deleted"
    }
    else{
        await db.query(`
            INSERT INTO follows ("userId", followed)
            VALUES ($1, $2);
            `, [userId, followedId]);
        return "Inserted"
    }
    
}

export async function getFollowRep(id, followedId) {   
    return db.query(`
        SELECT * FROM follows WHERE "userId"=$1 AND followed=$2`
        , [id, followedId]);  
    
}