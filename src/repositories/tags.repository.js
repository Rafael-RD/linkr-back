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
        AND likes."userId" = $2
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
      JOIN post_tag pt on pt."postId" = p1.id
      JOIN tags on tags.id = pt."tagId"
      LEFT JOIN (
        SELECT likes."postId", array_agg(users."userName") AS like_users, COUNT(likes.id) AS qtt_likes
        FROM likes JOIN users ON likes."userId"=users.id
        GROUP BY likes."postId"
      ) sub_query_like ON p1.id=sub_query_like."postId"
      WHERE tags.name ILIKE $1
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
          AND likes."userId" = $2
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
        JOIN post_tag pt on pt."postId" = reposts."postId"
        JOIN tags on tags.id = pt."tagId"
        LEFT JOIN (
        SELECT likes."postId", array_agg(users."userName") AS like_users, COUNT(likes.id) AS qtt_likes
        FROM likes JOIN users ON likes."userId"=users.id
        GROUP BY likes."postId"
        ) sub_query_like ON posts.id=sub_query_like."postId"
        WHERE tags.name ILIKE $1
      )
      ORDER BY "createdAt" DESC;
    `,
    [name, userId]
  );
  return result;
}