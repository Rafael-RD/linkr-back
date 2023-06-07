import jwt from "jsonwebtoken";

export default function tokenValidation(req, res, next){
    const token=req.headers.authorization?.replace("Bearer ", "");
    
    try {
        const tokenData=jwt.verify(token, process.env.SECRET_KEY);
        res.locals.tokenData=tokenData;
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}