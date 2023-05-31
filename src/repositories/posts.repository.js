import { db } from "../database/database.connection.js";

export function findTimeline(page=1){
    return db.query(`
    SELECT posts.*, users."userName", users.picture, sub_query_like.like_users, sub_query_like.qtt_likes, sub_query_tag.tag_array
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
		GROUP BY likes.id
	) sub_query_like ON posts.id=sub_query_like."postId"
    ORDER BY posts."createdAt" DESC 
    LIMIT 20 OFFSET $1;`, [(page-1)*20]);
}


export async function getPostsDevRep () {
	return await db.query(`SELECT * FROM posts;`)
}

export async function publishPost(id, description, link, tags) {
	const post = await db.query(
	  `INSERT INTO posts ("userId", description, link)
	   VALUES ($1, $2, $3)
	   RETURNING id;`,
	  [id, description, link]
	);

	const postId = post.rows[0].id;

	for (let i = 0; i < tags.length; i++) {
	  const tag = await db.query(`SELECT id FROM tags WHERE name = $1;`, [
		tags[i].toLowerCase(),
	  ]);
  
	  if (!tag.rows[0]) {
		const newTag = await db.query(
		  `INSERT INTO tags (name) VALUES ($1) RETURNING id;`,
		  [tags[i]]
		);
  
		const tagId = newTag.rows[0].id;
  
		await db.query(
		  `INSERT INTO post_tag ("postId", "tagId")
		   VALUES ($1, $2);`,
		  [postId, tagId]
		);
	  } else {
		const tagId = tag.rows[0].id;
  
		await db.query(
		  `INSERT INTO post_tag ("postId", "tagId")
		   VALUES ($1, $2);`,
		  [postId, tagId]
		);
	  }
	}
  
	return postId;
  }
  