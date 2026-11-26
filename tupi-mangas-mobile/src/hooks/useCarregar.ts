import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

type Opcoes = {
  token?: string | null; // para rotas que exigem login
  automatico?: boolean; // false = não carrega sozinho ao abrir (a tela chama quando quiser)
};

export function useCarregar<T>(caminho: string, { token, automatico = true }: Opcoes = {}) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // silencioso = não mostra o círculo, só atualiza os dados que já estão na tela
  const buscar = useCallback(
    async (silencioso: boolean) => {
      if (!silencioso) setCarregando(true);
      setErro('');
      try {
        setDados(await api<T>(caminho, {}, token));
      } catch (e: any) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    },
    [caminho, token]
  );

  const recarregar = useCallback(() => buscar(false), [buscar]);
  const atualizar = useCallback(() => buscar(true), [buscar]);

  useEffect(() => {
    if (automatico) recarregar();
  }, [automatico, recarregar]);

  return { dados, setDados, carregando, erro, recarregar, atualizar };
}