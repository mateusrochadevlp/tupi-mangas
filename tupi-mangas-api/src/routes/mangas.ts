import { Router } from "express";

const router = Router();
const API = "https://api.mangadex.org";

// faz a chamada na MangaDex e já dá erro se algo der errado
async function chamarApi(caminho: string) {
  const r = await fetch(`${API}${caminho}`);
  if (!r.ok) throw new Error("Erro na MangaDex");
  return r.json();
}

// título e descrição vêm separados por idioma, aqui pego pt-br ou en
function pegarTexto(obj: any) {
  if (!obj) return "";
  return obj["pt-br"] || obj.en || Object.values(obj)[0] || "";
}

// deixa o mangá no formato simples que o app vai usar
function formatarManga(m: any) {
  const capa = m.relationships.find((r: any) => r.type === "cover_art");
  return {
    id: m.id,
    titulo: pegarTexto(m.attributes.title),
    descricao: pegarTexto(m.attributes.description),
    status: m.attributes.status,
    capa: capa?.attributes?.fileName
      ? `https://uploads.mangadex.org/covers/${m.id}/${capa.attributes.fileName}.256.jpg`
      : null,
  };
}

// catálogo + pesquisa: GET /mangas?busca=naruto&pagina=1
router.get("/", async (req, res) => {
  const busca = req.query.busca as string | undefined;
  const pagina = Number(req.query.pagina) || 1;
  const idioma = (req.query.idioma as string) || "pt-br";
  const limite = 20;

  const params = new URLSearchParams();
  params.append("limit", String(limite));
  params.append("offset", String((pagina - 1) * limite));
  params.append("includes[]", "cover_art");
  params.append("availableTranslatedLanguage[]", idioma);
  params.append("contentRating[]", "safe");
  params.append("contentRating[]", "suggestive");

  if (busca) params.append("title", busca);
  else params.append("order[followedCount]", "desc"); // sem busca, mostra os mais populares

  try {
    const dados = await chamarApi(`/manga?${params}`);
    res.json({
      total: dados.total,
      pagina,
      mangas: dados.data.map(formatarManga),
    });
  } catch {
    res.status(500).json({ erro: "Erro ao buscar mangás" });
  }
});

// páginas de um capítulo: GET /mangas/capitulos/:id/paginas
router.get("/capitulos/:id/paginas", async (req, res) => {
  try {
    const dados = await chamarApi(`/at-home/server/${req.params.id}`);
    const { hash, data } = dados.chapter;

    // o app carrega essas imagens direto da MangaDex
    const paginas = data.map((arq: string) => `${dados.baseUrl}/data/${hash}/${arq}`);
    res.json({ total: paginas.length, paginas });
  } catch {
    res.status(500).json({ erro: "Erro ao buscar páginas do capítulo" });
  }
});

// capítulos de um mangá: GET /mangas/:id/capitulos?idioma=pt-br&pagina=1
router.get("/:id/capitulos", async (req, res) => {
  const idioma = (req.query.idioma as string) || "pt-br";
  const pagina = Number(req.query.pagina) || 1;
  const limite = 100;

  const params = new URLSearchParams();
  params.append("translatedLanguage[]", idioma);
  params.append("order[chapter]", "asc");
  params.append("limit", String(limite));
  params.append("offset", String((pagina - 1) * limite));
  params.append("contentRating[]", "safe");
  params.append("contentRating[]", "suggestive");

  try {
    const dados = await chamarApi(`/manga/${req.params.id}/feed?${params}`);

    const capitulos = dados.data
      .filter((c: any) => c.attributes.pages > 0) // tira os que só têm link externo, esses não dá pra ler no app
      .map((c: any) => ({
        id: c.id,
        capitulo: c.attributes.chapter,
        titulo: c.attributes.title,
        paginas: c.attributes.pages,
      }));

    res.json({ total: dados.total, pagina, capitulos });
  } catch {
    res.status(500).json({ erro: "Erro ao buscar capítulos" });
  }
});

// detalhes de um mangá: GET /mangas/:id
router.get("/:id", async (req, res) => {
  try {
    const dados = await chamarApi(
      `/manga/${req.params.id}?includes[]=cover_art&includes[]=author`
    );
    const autor = dados.data.relationships.find((r: any) => r.type === "author");

    res.json({
      ...formatarManga(dados.data),
      autor: autor?.attributes?.name ?? null,
      generos: dados.data.attributes.tags.map((t: any) => t.attributes.name.en),
    });
  } catch {
    res.status(500).json({ erro: "Erro ao buscar detalhes do mangá" });
  }
});

export default router;