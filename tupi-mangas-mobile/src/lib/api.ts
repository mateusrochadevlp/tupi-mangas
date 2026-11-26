const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function api<T = unknown>(
  caminho: string,
  opcoes: RequestInit = {},
  token?: string | null
): Promise<T> {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.erro ?? dados?.mensagem ?? `Erro ${resposta.status}`);
  }

  return dados as T;
}