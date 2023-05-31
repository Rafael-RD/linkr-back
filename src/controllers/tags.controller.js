import { getTrendingDB } from "../repositories/tags.repository.js";

export async function trending(req, res) {
  try {
    const { rows } = await getTrendingDB();
    res.send(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
