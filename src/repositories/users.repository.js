import { db } from "../database/database.connection.js";


export function findUserIdDB(id){
    return db.query("SELECT * FROM users WHERE id=$1", [id]);
}