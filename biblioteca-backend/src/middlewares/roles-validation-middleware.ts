import { Request, Response, NextFunction } from "express";

// Função que retorna o middleware
export const rolesValidation = (roles: Array<number>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verifica se o usuário está no request
      //@ts-ignore
      const user = req.user;

      if (!user) {
        return res.status(403).json({ message: "Access denied. No user found." });
      }

      // Verifica se o usuário tem pelo menos uma das roles necessárias
      if (!roles.some(role => user.roles.includes(role))) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      // Se passar pela validação, continua para o próximo middleware
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error });
    }
  };
};
