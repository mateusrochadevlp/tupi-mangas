# Tupi Mangás (app)

App mobile para ler mangás, feito com Expo e React Native. Usa a API do projeto **tupi-mangas** (backend), que busca os dados na MangaDex.

Este app precisa da API rodando. Backend

## Funcionalidades

- Cadastro e login
- Catálogo com busca e "Carregar mais obras"
- Detalhes do mangá e lista de capítulos
- Leitor de páginas com zoom
- Favoritos (adicionar e remover)

## Como rodar

1. Suba a API (veja o README do backend).
2. Instale as dependências:

```
npm install
```

3. Crie o arquivo `.env` a partir do exemplo:

```
copy .env.example .env
```

4. Abra o `.env` e troque o IP pelo do PC que roda a API (use `ipconfig`):

```
EXPO_PUBLIC_API_URL=http://SEU_IP:3333
```

5. Inicie o app:

```
npx expo start
```

6. Abra o **Expo Go** no celular (na mesma rede Wi-Fi do PC) e leia o QR code.

## Tecnologias

Expo, React Native, Expo Router, TypeScript.
