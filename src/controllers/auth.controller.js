import bcrypt from "bcrypt";
import { createUserDB } from "../repositories/auth.repository.js";

export async function signup(req, res) {
  const { email, password, username, image } = req.body;
  try {
    const hashPassword = bcrypt.hashSync(password, 10);

    await createUserDB(email, hashPassword, username, image);

    res.sendStatus(201);
  } catch (error) {
    if (error.constraint === "users_email_key") return res.sendStatus(409);
    res.status(500).send(error.message);
  }
}
