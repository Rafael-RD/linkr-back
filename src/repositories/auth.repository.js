import { db } from "../database/database.connection.js";

export function createUserDB(email, password, username, image) {
  const result = db.query(
    `
        INSERT INTO users (email, password, "userName", picture)
        VALUES ($1, $2, $3, $4);
    `,
    [email, password, username, image]
  );
  return result;
}
