import { Router, type Response } from "express";
import { prisma } from "../prisma.js";
import { autenticar, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

// todas as rotas daqui pra baixo exigem login
router.use(autenticar);

// listar favoritos do usuário: GET /favoritos
router.get("/", async (req: AuthRequest, res: Response) => {
  const favoritos = await prisma.favorite.findMany({
    where: { userId: req.userId as number },
    orderBy: { createdAt: "desc" },
  });

  res.json(favoritos);
});

// favoritar: POST /favoritos
router.post("/", async (req: AuthRequest, res: Response) => {
  const { mangaId, titulo, capa } = req.body;

  if (!mangaId || !titulo) {
    return res.status(400).json({ erro: "Envie mangaId e titulo" });
  }

  const userId = req.userId as number;

  // não deixa favoritar o mesmo mangá duas vezes
  const jaExiste = await prisma.favorite.findUnique({
    where: { userId_mangaId: { userId, mangaId } },
  });
  if (jaExiste) {
    return res.status(409).json({ erro: "Mangá já está nos favoritos" });
  }

  const favorito = await prisma.favorite.create({
    data: { mangaId, title: titulo, coverUrl: capa, userId },
  });

  res.status(201).json(favorito);
});

// remover: DELETE /favoritos/:mangaId
router.delete("/:mangaId", async (req: AuthRequest, res: Response) => {
  const resultado = await prisma.favorite.deleteMany({
    where: { userId: req.userId as number, mangaId: String(req.params.mangaId) },
  });

  if (resultado.count === 0) {
    return res.status(404).json({ erro: "Favorito não encontrado" });
  }

  res.json({ mensagem: "Removido dos favoritos" });
});

export default router;