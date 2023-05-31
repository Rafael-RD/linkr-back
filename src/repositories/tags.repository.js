import { db } from "../database/database.connection.js";

export function getTrendingDB() {
  const result = db.query(
    `SELECT 
        tags.id, 
        tags.name,  
        (SELECT COUNT(*) FROM post_tag WHERE "tagId" = tags.id) AS amount
    FROM tags
    GROUP BY tags.name, tags.id
    ORDER BY amount DESC
    LIMIT 10;`
  );
  return result;
}
