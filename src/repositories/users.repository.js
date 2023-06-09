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
        SELECT 
        p1.description, 
        p1.id, 
        p1."userId", 
        p1.link,
        p1."createdAt", 
        users."userName", 
        users.picture,
        (
            SELECT COUNT(*) 
            FROM comments 
            WHERE comments."postId" = p1.id
        ) AS qtt_comments,
        sub_query_like.like_users, 
        sub_query_like.qtt_likes,
        EXISTS (
            SELECT 1 FROM likes 
            WHERE likes."postId" = p1.id
            AND likes."userId" = $1
        ) AS "hasLiked",
        (
            SELECT COUNT(*) 
            FROM reposts r
            WHERE r."postId" = p1.id
        ) AS qtt_reposts,
        NULL AS "repostUserName", 
        NULL AS "repostId"

        FROM posts p1
        JOIN users ON p1."userId"=users.id
        LEFT JOIN (
            SELECT likes."postId", array_agg(users."userName") AS like_users, COUNT(likes.id) AS qtt_likes
            FROM likes JOIN users ON likes."userId"=users.id
            GROUP BY likes."postId"
        ) sub_query_like ON p1.id=sub_query_like."postId"
        WHERE p1."userId"=$1

        UNION(
            SELECT 
            posts.description, 
            posts.id, 
            posts."userId", 
            posts.link,
            reposts."createdAt", 
            u1."userName", 
            u1.picture,
            (
                SELECT COUNT(*) 
                FROM comments 
                WHERE comments."postId" = posts.id
            ) AS qtt_comments, 
            sub_query_like.like_users, 
            sub_query_like.qtt_likes,
            EXISTS (
                SELECT 1 FROM likes 
                WHERE likes."postId" = posts.id
                AND likes."userId" = $1
            ) AS "hasLiked",
            (
                SELECT COUNT(*) 
                FROM reposts r
                WHERE r."postId" = posts.id
            ) AS qtt_reposts,
            u2."userName", 
            reposts.id
            FROM reposts 
            JOIN posts ON reposts."postId"=posts.id
            JOIN users u1 ON posts."userId"=u1.id
            JOIN users u2 ON reposts."userId"=u2.id
            LEFT JOIN (
            SELECT likes."postId", array_agg(users."userName") AS like_users, COUNT(likes.id) AS qtt_likes
            FROM likes JOIN users ON likes."userId"=users.id
            GROUP BY likes."postId"
            ) sub_query_like ON posts.id=sub_query_like."postId"
            WHERE reposts."userId"=$1
        )
        ORDER BY "createdAt" DESC`, [userId]);
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