import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const router = Router();

// cadastro
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ erro: "Preencha nome, email e senha" });
  }

  // vê se o email já existe
  const existe = await prisma.user.findUnique({ where: { email } });
  if (existe) {
    return res.status(409).json({ erro: "Email já cadastrado" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash },
  });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const senhaOk = await bcrypt.compare(password, user.password);
  if (!senhaOk) {
    return res.status(401).json({ erro: "Email ou senha inválidos" });
  }

  // token vale 7 dias
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;