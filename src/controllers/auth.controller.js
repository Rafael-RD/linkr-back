import bcrypt from "bcrypt";
import {
  createUserDB,
  findUserEmailDB,
} from "../repositories/auth.repository.js";
import jwt from "jsonwebtoken";

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

export async function signin(req, res) {
  const { email, password: inputPassword } = req.body;
  try {
    const { rows, rowCount } = await findUserEmailDB(email);
    if (!rowCount) return res.status(404).send("Invalid credentials");

    const { password, id, picture, userName } = rows[0];

    const comparePassword = bcrypt.compareSync(inputPassword, password);
    if (!comparePassword) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id }, process.env.SECRET_KEY);

    res.status(200).send({ username: userName, picture, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
