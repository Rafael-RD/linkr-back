import { db } from "../database/database.connection.js";

export async function getUserId (id) {
	return await db.query(`SELECT * FROM users WHERE "userId" = $1;`,[id])
}