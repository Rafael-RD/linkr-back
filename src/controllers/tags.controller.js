import { getTagPosts, getTrendingDB } from "../repositories/tags.repository.js";
import { fetchMetadata } from "../utils/metadata.utils.js";

export async function trending(req, res) {
  try {
    const { rows } = await getTrendingDB();
    res.send(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function listHashtags(req, res) {
  const { name } = req.params;
  const userId = res.locals.tokenData.id;

  try {
    const { rows } = await getTagPosts(name, userId);
    const resultWithMetadata = await Promise.all(
      rows.map(async (row) => {
        const metadata = await fetchMetadata(row.link);
        return { ...row, linkMetadata: metadata };
      })
    );

    res.send(resultWithMetadata);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
