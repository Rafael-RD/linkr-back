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
		GROUP BY likes.id
	) sub_query_like ON posts.id=sub_query_like."postId"
    ORDER BY posts."createdAt" DESC 
    LIMIT 20 OFFSET $1;`, [(page - 1) * 20]);
}


export async function getPostsDevRep () {
	return await db.query(`SELECT * FROM users;`)
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
	console.log(tags)
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

	return 200;
}

export async function deletePostByPostId(postId, userId) {

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


	return 200;
}

export async function getUserIdForValidate(postId){
	const user = await db.query(
		`SELECT * FROM posts
		WHERE id=$1;`,
		[postId]
	);

	return(user.rows[0].userId);
}