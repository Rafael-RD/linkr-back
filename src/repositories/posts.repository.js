import { db } from "../database/database.connection.js";

export async function getPostsDevRep () {
	return await db.query(`SELECT * FROM posts;`)
}