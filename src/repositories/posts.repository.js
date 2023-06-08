import { db } from "../database/database.connection.js";

export function findTimeline(id, createdAt) {
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
		WHERE (p1."userId"=$1 OR p1."userId" IN(SELECT follows.followed from follows WHERE follows."userId"=$1))
		AND ($2::timestamp IS NULL OR p1."createdAt"<$2)

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
			WHERE (reposts."userId"=$1 OR reposts."userId" IN(SELECT follows.followed from follows WHERE follows."userId"=$1))
			AND ($2::timestamp IS NULL OR reposts."createdAt"<$2)
		)
		ORDER BY "createdAt" DESC
		LIMIT 10;`, [id, createdAt]);
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
			`DELETE FROM comments
				WHERE "postId"=$1;`,
			[postId]
		);
		await db.query(
			`DELETE FROM reposts
				WHERE "postId"=$1;`,
			[postId]
		);
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

export async function postSharePost(userId, postId){
	const userRePost =  await db.query(
		`SELECT * FROM reposts
			WHERE "userId"=$1 AND "postId"=$2;`, 
		[userId, postId]
	);
	if(userRePost.rowCount === 0){
		const repostId = await db.query(
			`INSERT INTO reposts ("userId", "postId")
				VALUES ($1, $2)
				RETURNING id;`, 
			[userId, postId]
		);
		return {status:201, postInfo: {postId, userId, repostId: repostId.rows[0].id}};
	}else if(userRePost.rowCount > 0){
		await db.query(
			`DELETE FROM reposts
				WHERE "userId"=$1 AND "postId"=$2;`, 
			[userId, postId]
		);
		return {status:200, postInfo: postId};
	}	
}

export async function getSharePost() {
	const share = await db.query(`SELECT * FROM reposts;`);
	return share;
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

export function getPostCommentsDB(userId, postId) {
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

export function findPostIdDB(postId) {
	const result = db.query(
		`
			SELECT 1 FROM posts WHERE posts.id = $1;
		`, [postId]
	);
	return result
}

export function getPostsCounterDB(userId, createdAt) {
	const result = db.query(`
	SELECT COUNT(*) AS new_post_counts, $2::timestamp AS param_createdAt
	FROM(
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
		WHERE p1."userId"=$1 OR p1."userId" IN(SELECT follows.followed from follows WHERE follows."userId"=$1)

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
			WHERE reposts."userId"=$1 OR reposts."userId" IN(SELECT follows.followed from follows WHERE follows."userId"=$1)
		)
	) AS subquery
	WHERE $2 IS NULL OR subquery."createdAt" >= $2::timestamp;
	`, [userId, createdAt]);
	return result;
}

export function getPostsUpdateDB(userId, limit) {
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
	  WHERE p1."userId"=$1 OR p1."userId" IN(SELECT follows.followed from follows WHERE follows."userId"=$1)

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
		  WHERE reposts."userId"=$1 OR reposts."userId" IN(SELECT follows.followed from follows WHERE follows."userId"=$1)
	  )
	  ORDER BY "createdAt" DESC LIMIT $2;
	  `, [userId, limit]);

	return result;
}

