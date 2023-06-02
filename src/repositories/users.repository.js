import { db } from "../database/database.connection.js";


export function findUserIdDB(id){
    return db.query("SELECT * FROM users WHERE id=$1", [id]);
}

export function searchUsersRep(search){
    console.log(search)
    return db.query(`SELECT "id", "userName", "picture", "email" FROM users WHERE "userName" LIKE $1 LIMIT 3 `, [search + "%"]);
}