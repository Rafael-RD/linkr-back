import { db } from "../database/database.connection.js";

export async function getPostsDevRep () {
	return await db.query(`SELECT * FROM posts;`)
}


export async function publishPost(id, description, link, tags) {
	const post = await db.query(
		`INSERT INTO posts ("userId", description, link)
		 VALUES ($1, $2, $3)
		 RETURNING id;`,
		[id,description, link]
	);
	  
	const postId = post.rows[0].id;
	  
	const tag = await db.query(`SELECT id FROM tags WHERE name = $1;`, [tags]);
	  
	if (!tag.rows[0]) {
		const newTag = await db.query(
		  `INSERT INTO tags (name) VALUES ($1) RETURNING id;`,
		  [tags]
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
	return "Ok"
}