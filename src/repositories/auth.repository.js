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

export function findUserEmailDB(email) {
  const result = db.query(
    `
        SELECT * FROM users WHERE email=$1;
    `,
    [email]
  );
  return result;
}
