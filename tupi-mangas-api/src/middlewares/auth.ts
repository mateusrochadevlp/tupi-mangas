import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// só pra poder guardar o id do usuário dentro do req
export interface AuthRequest extends Request {
  userId?: number;
}

export function autenticar(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // o app manda assim: "Bearer TOKEN"
  if (!header) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = header.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    req.userId = dados.id;
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}