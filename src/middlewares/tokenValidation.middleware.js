import jwt from "jsonwebtoken";

export default function tokenValidation(req, res, next){
    const token=req.headers.authorization?.replace("Bearer ", "");

    try {
        console.log("teste teste teste")
        console.log(token)
        const tokenData=jwt.verify(token, process.env.SECRET_KEY);
        console.log(tokenData)
        res.locals.tokenData=tokenData;
        console.log("teste teste")
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}