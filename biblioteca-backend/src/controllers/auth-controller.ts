import type { Request, Response } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Roles } from "../utils/Roles";

dotenv.config()

const generateAccessToken = (payload: User) =>{
  return jwt.sign({sub: payload.id, username: payload.username,email: payload.email, roles: payload.roles}, process.env.JWT_ACCESS_TOKEN_SECRET as string, {expiresIn : '30s'})
}

const generateRefreshToken = (payload: User) =>{
  return jwt.sign({sub: payload.id}, process.env.JWT_REFRESH_TOKEN_SECRET as string, {expiresIn : '1d'})
}

export const userRegister = async (req: Request, res: Response): Promise<Response> => {
  const {username,email, password, roles} = req.body
 
  try{
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      //@ts-ignore
      return res.status(400).json({ status: 400, message: "User already exists." });
    }
    const inputRoles = (arr: Array<string>) =>{
      const newroles = []
      arr.map(r =>{
        newroles.push(Roles[r])

      })
      return newroles;
    }
    const newUser = await User.create(
      {
        username, 
        email,
        password,
        roles: inputRoles(roles)
      }
    )

    if(!newUser)
    {
      //@ts-ignore
      return res.status(400).json({status: 400, message: "User not created."})
    }
    //@ts-ignore
    return res.status(201).json({status: 201, data: newUser})
  }
  catch(error){
    console.error(error)
  }
}

export const userLogin = async (req: Request, res: Response): Promise<Response> => {
  const {email, password} = req.body
  try{
    const existingUser = await User.findOne({where : {email}})

    if (!existingUser) {
      //@ts-ignore
      return res.status(404).json({ status: 404, message: "User not found." });
    }
    
    const result = bcrypt.compareSync(password, existingUser.password)
    
    if(!result)
    {
        //@ts-ignore
        return res.status(404).json({ status: 404, message: "Invalid password." });
    }
    const accessToken = generateAccessToken(existingUser)
    const refreshToken = generateRefreshToken(existingUser)

    //@ts-ignore
    return res.status(200).json({accessToken, refreshToken});
  }
  catch(error){
    console.error(error)
  }
}

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  const {refreshToken} = req.body
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET as string);

    if(!decoded)
    {
      //@ts-ignore
      return res.status(403).send('Invalid Refresh Token');
    }

    const user = await User.findByPk(decoded.sub);

    if(!user)
    {
      //@ts-ignore
      return res.status(404).send('User not found');
    }

    const accessToken = generateAccessToken(user);

    //@ts-ignore
    return res.json({accessToken});

  } catch (error) {
    //@ts-ignore
    return res.status(500).json("Server error", error);
  }
}