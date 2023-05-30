import jwt from "jsonwebtoken";

export default function tokenValidation(req, res, next){
    const token=req.headers.authorization?.replace("Bearer ", "");

    try {
        const tokenData=jwt.verify(token, process.env.JWT_SECRET);
        res.locals.tokenData=tokenData;
        next();
    } catch (error) {
        return res.sendStatus(401);
    }
}