import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

export function useFavorito(mangaId: string) {
  const { token } = useAuth();
  const [favorito, setFavorito] = useState(false);
  const [trabalhando, setTrabalhando] = useState(false);

  // descobre se este mangá já está nos favoritos do usuário
  useEffect(() => {
    (async () => {
      try {
        const lista = await api<{ mangaId: string }[]>('/favoritos', {}, token);
        setFavorito(lista.some((f) => f.mangaId === mangaId));
      } catch {
        setFavorito(false);
      }
    })();
  }, [mangaId, token]);

  async function adicionar(titulo: string, capa: string | null) {
    setTrabalhando(true);
    try {
      await api(
        '/favoritos',
        { method: 'POST', body: JSON.stringify({ mangaId, titulo, capa }) },
        token
      );
      setFavorito(true);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setTrabalhando(false);
    }
  }

  async function remover() {
    setTrabalhando(true);
    try {
      await api(`/favoritos/${mangaId}`, { method: 'DELETE' }, token);
      setFavorito(false);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setTrabalhando(false);
    }
  }

  // adiciona direto; para remover, pergunta antes
  function alternar(titulo: string, capa: string | null) {
    if (trabalhando) return;

    if (favorito) {
      Alert.alert('Remover favorito', `Remover “${titulo}” dos favoritos?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: remover },
      ]);
    } else {
      adicionar(titulo, capa);
    }
  }

  return { favorito, trabalhando, alternar };
}