import type { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<Response> =>{
  try{
    console.log("AUTH INIT")

    const authHeader = req.headers["authorization"] || req.headers["Authorization"]
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
      //@ts-ignore
      return res.status(401).send('Access Token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string);

    if(!decoded)
    {
      //@ts-ignore
      return res.status(403).send('Invalid Access Token');
    }
    //@ts-ignore
    req.user = decoded;

    next();
  }catch(error){

  }
}