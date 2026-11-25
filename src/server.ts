import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import mangaRoutes from "./routes/mangas.js";
import favoritoRoutes from "./routes/favoritos.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ mensagem: "API de mangás funcionando" });
});

app.use("/auth", authRoutes)
app.use("/mangas", mangaRoutes);
app.use("/favoritos", favoritoRoutes);


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));