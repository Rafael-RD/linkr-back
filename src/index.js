import express from "express";
import router from "./routers/index.router.js";

const server = express();

server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server initiated on ${PORT}`));
