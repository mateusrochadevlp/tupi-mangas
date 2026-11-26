import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from './api';

type Usuario = { id: number; name: string; email: string };

type AuthContexto = {
  token: string | null;
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const Contexto = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // ao abrir o app, recupera o login salvo
  useEffect(() => {
    (async () => {
      try {
        const t = await SecureStore.getItemAsync('token');
        const u = await SecureStore.getItemAsync('usuario');
        if (t && u) {
          setToken(t);
          setUsuario(JSON.parse(u));
        }
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  async function entrar(email: string, senha: string) {
    const dados = await api<{ token: string; user: Usuario }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: senha }),
    });
    await SecureStore.setItemAsync('token', dados.token);
    await SecureStore.setItemAsync('usuario', JSON.stringify(dados.user));
    setToken(dados.token);
    setUsuario(dados.user);
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: nome, email, password: senha }),
    });
  }

  async function sair() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('usuario');
    setToken(null);
    setUsuario(null);
  }

  return (
    <Contexto.Provider value={{ token, usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </Contexto.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('useAuth precisa estar dentro do AuthProvider');
  return ctx;
}