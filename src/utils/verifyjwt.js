import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId,role,type="session")=>{
const expires = type === "session" ? "15m" : "7d";
  const secret =
    type === "session"
      ? process.env.SESSION_JWT_SECRET
      : process.env.PERMANENT_JWT_SECRET;
return jwt.sign({userId,role},secret,{expiresIn:expires});
}