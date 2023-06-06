import { db } from "../database/database.connection.js";

export function getTrendingDB() {
  const result = db.query(
    `SELECT 
        tags.id, 
        tags.name,  
        (SELECT COUNT(*) FROM post_tag WHERE "tagId" = tags.id) AS amount
    FROM tags
    GROUP BY tags.name, tags.id
    ORDER BY amount DESC
    LIMIT 10;`
  );
  return result;
}

export function getTagPosts(name, userId) {
  const result = db.query(
    `
    SELECT 
    posts.id, 
    posts."userId" AS "userId",
    users."userName",
    users.picture,
    posts.description, 
    posts.link, 
    posts."createdAt",
    (
        SELECT COUNT(*) 
        FROM likes 
        WHERE likes."postId" = posts.id
    ) AS qtt_likes, 
    (
        SELECT jsonb_agg(u."userName")
        FROM likes
        INNER JOIN users u ON u.id = likes."userId"
        WHERE likes."postId" = posts.id
        LIMIT 5
    )AS like_users,
    EXISTS (
        SELECT 1 FROM likes 
        WHERE likes."postId" = posts.id
        AND likes."userId" = $2
    ) AS "hasLiked",
    (
      SELECT COUNT(*) 
      FROM comments 
      WHERE comments."postId" = posts.id
    ) AS qtt_comments
    FROM posts
    JOIN users on users.id = posts."userId"
    JOIN post_tag pt on pt."postId" = posts.id
    JOIN tags on tags.id = pt."tagId"
    WHERE tags.name ILIKE $1
    ORDER BY posts."createdAt" DESC
    LIMIT 20;
    `,
    [name, userId]
  );
  return result;
}
