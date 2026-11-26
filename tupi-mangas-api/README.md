# Tupi Mangás API

Backend de um aplicativo mobile de leitura de mangás. A API cuida do cadastro e login de usuários e dos favoritos (salvos no PostgreSQL), e consome a [API da MangaDex](https://api.mangadex.org/docs/) para o catálogo, a busca, os capítulos e as páginas do leitor.

## Tecnologias

- Node.js + Express 5
- TypeScript (executado com `tsx`)
- Prisma ORM 6 + PostgreSQL
- JWT (`jsonwebtoken`) e `bcryptjs` para autenticação
- API externa: MangaDex

## Como rodar

Pré-requisitos: Node.js 20+ e Docker Desktop.

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Suba o banco PostgreSQL com Docker (ele fica na porta `5434`):
   ```bash
   docker compose up -d
   ```

3. Crie o arquivo `.env` a partir do exemplo e preencha a URL do banco e o `JWT_SECRET`:
   ```bash
   cp .env.example .env
   ```
   No Windows (CMD): `copy .env.example .env`

4. Gere o client do Prisma e aplique as migrations:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

O servidor roda em `http://localhost:3333`.