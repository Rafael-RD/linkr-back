import { db } from "../database/database.connection.js";

export function findTimeline(page = 1) {
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
    ORDER BY posts."createdAt" DESC 
    LIMIT 20 OFFSET $1;`, [(page - 1) * 20]);
}


export async function getPostsDevRep() {
	return await db.query(`SELECT * FROM follows;`)
}

export async function publishPost(id, description, link, tags) {
	const post = await db.query(
		`INSERT INTO posts ("userId", description, link)
		VALUES ($1, $2, $3)
		RETURNING id;`,
		[id, description, link]
	);
	const postId = post.rows[0].id;

	if (tags.length > 0) {
		const queryTags = tags.map((t, index) => `$${index + 1}`).join(", ")
		const queryFindTags = `SELECT * FROM tags WHERE name IN (${queryTags});`;
		const { rows } = await db.query(queryFindTags, [...tags]);

		//Array de ids de tags que já existem no banco de dados
		const existingIds = [...rows].map(tag => tag.id);
		//Array de nomes de tags que já existem no banco de dados
		const existingNames = [...rows].map(tag => tag.name);

		//Array de tags que precisam ser inseridas
		const filteredTags = tags.filter(tag => !existingNames.includes(tag))
		if (filteredTags.length > 0) {
			const insertIntoTags = filteredTags.map((t, index) => `($${index + 1})`).join(", ");
			const tagQuery = `INSERT INTO tags (name) VALUES ${insertIntoTags} RETURNING id;`;
			const { rows: createdTagIds } = await db.query(tagQuery, filteredTags)
			createdTagIds.forEach(tagId => existingIds.push(tagId.id));
		}

		const queryIds = existingIds.map((t, index) => `($1, $${index + 2})`).join(", ");
		const queryTagPost = `INSERT INTO post_tag ("postId", "tagId") VALUES ${queryIds};`
		const final = await db.query(queryTagPost, [postId, ...existingIds]);
	}
	return postId;
}

export async function updatePostByPostId(description, postId, tags, userId) {
	const id = await getUserIdForValidate(postId);

	if (userId === id) {
		await db.query(
			`UPDATE posts 
			SET description = $1
			WHERE id=$2;`,
			[description, postId]
		);

		await db.query(
			`DELETE FROM post_tag
			WHERE "postId"=$1;`, [postId]
		);
		if (tags.length > 0) {
			const queryTags = tags.map((t, index) => `$${index + 1}`).join(", ")
			const queryFindTags = `SELECT * FROM tags WHERE name IN (${queryTags});`;
			const { rows } = await db.query(queryFindTags, [...tags]);

			//Array de ids de tags que já existem no banco de dados
			const existingIds = [...rows].map(tag => tag.id);
			//Array de nomes de tags que já existem no banco de dados
			const existingNames = [...rows].map(tag => tag.name);

			//Array de tags que precisam ser inseridas
			const filteredTags = tags.filter(tag => !existingNames.includes(tag))
			if (filteredTags.length > 0) {
				const insertIntoTags = filteredTags.map((t, index) => `($${index + 1})`).join(", ");
				const tagQuery = `INSERT INTO tags (name) VALUES ${insertIntoTags} RETURNING id;`;
				const { rows: createdTagIds } = await db.query(tagQuery, filteredTags)
				createdTagIds.forEach(tagId => existingIds.push(tagId.id));
			}

			const queryIds = existingIds.map((t, index) => `($1, $${index + 2})`).join(", ");
			const queryTagPost = `INSERT INTO post_tag ("postId", "tagId") VALUES ${queryIds};`
			const final = await db.query(queryTagPost, [postId, ...existingIds]);
		}
	} else {
		return 403;
	}

	return 200;
}

export async function deletePostByPostId(postId, userId) {
	const id = await getUserIdForValidate(postId);

	if (userId === id) {
		await db.query(
			`DELETE FROM likes
				WHERE "postId"=$1;`,
			[postId]
		);
		await db.query(
			`DELETE FROM post_tag 
				WHERE "postId"=$1;`,
			[postId,]
		);
		await db.query(
			`DELETE FROM posts
				WHERE id=$1;`,
			[postId]
		);
	} else {
		return 403;
	}

	return 200;
}

export async function getUserIdForValidate(postId) {
	const user = await db.query(
		`SELECT * FROM posts
		WHERE id=$1;`,
		[postId]
	);

	return (user.rows[0].userId);
}

export async function likesPostRep(id, postId) {
	const check = await db.query(
		`SELECT * FROM likes
		WHERE "userId"=$1 AND "postId"=$2;`,
		[id, postId]
	);
	if (!check.rows[0]) {
		await db.query(
			`INSERT INTO likes ("userId", "postId")
			VALUES ($1, $2);`,
			[id, postId]
		);
	}
	else {
		await db.query(
			`DELETE FROM likes
			WHERE "userId"=$1 AND "postId"=$2;`,
			[id, postId]
		);
	}
	const users = await db.query(
		`SELECT 
		COUNT(*) AS qtt_likes,
		EXISTS(SELECT 1 FROM likes WHERE "postId" = $1 AND "userId" = $2) AS user_liked,
		(
		  SELECT 
			ARRAY(
			  SELECT 
				users."userName"
			  FROM 
				likes
				JOIN users ON users.id = likes."userId"
			  WHERE 
				likes."postId" = $1
			  ORDER BY 
				likes."createdAt" DESC
			  LIMIT 5
			)
		) AS user_list
	  FROM 
		likes
	  JOIN users ON users.id = likes."userId"
	  WHERE 
		likes."postId" = $1
	  GROUP BY 
		likes."postId";	
		`, [postId, id]
	);

	return (users)
}

export function makeNewCommentDB(userId, postId, content) {
	const result = db.query(
	  `
		INSERT INTO comments ("userId", "postId", content)
		VALUES ($1, $2, $3);
	  `,
	  [userId, postId, content]
	);
	return result;
  }

  export function getPostCommentsDB(userId, postId){
	const result = db.query(
		`
			SELECT 
			users.id,
				users."userName", 
				users.picture,
				comments.content,
				EXISTS (
					SELECT 1 FROM follows WHERE "userId" = $1 AND followed = users.id
				) AS is_following,
				comments."userId" = posts."userId" AS is_author
			FROM
				comments
			JOIN users ON users.id = comments."userId"
			JOIN posts ON posts.id = comments."postId"
				WHERE comments."postId" = $2
			ORDER BY comments."createdAt" ASC;
		`,
		[userId, postId]
	);
	return result;
  }

  export function findPostIdDB(postId){
	const result = db.query(
		`
			SELECT 1 FROM posts WHERE posts.id = $1;
		`, [postId]
	);
	return result
  }