import { db } from "../database/database.connection.js";

export async function getUserIdRep (id) {
	return await db.query(`SELECT * FROM users WHERE "id" = $1;`,[id])
}