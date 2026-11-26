import { useCallback } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { cores } from '../../lib/cores';
import { useCarregar } from '../../hooks/useCarregar';
import Topo from '../../components/Topo';
import Carregando from '../../components/Carregando';
import Capa from '../../components/Capa';
import Erro from '../../components/Erro';

type Favorito = {
  id: number;
  mangaId: string;
  title: string;
  coverUrl: string | null;
};

export default function Favoritos() {
  const { token } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dados, setDados, carregando, erro, recarregar, atualizar } = useCarregar<Favorito[]>(
    '/favoritos',
    { token, automatico: false }
  );

  // recarrega toda vez que a aba é aberta, para refletir o que foi favoritado
  useFocusEffect(
    useCallback(() => {
      atualizar();
    }, [atualizar])
  );

  function confirmarRemocao(f: Favorito) {
    Alert.alert('Remover favorito', `Remover “${f.title}” dos favoritos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => remover(f) },
    ]);
  }

  async function remover(f: Favorito) {
    try {
      await api(`/favoritos/${f.mangaId}`, { method: 'DELETE' }, token);
      setDados((atual) => atual?.filter((x) => x.mangaId !== f.mangaId) ?? null);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  }

  return (
    <View style={[s.tela, { paddingTop: insets.top + 8 }]}>
      <Topo titulo="Meus favoritos" />

      {carregando ? (
        <Carregando style={{ marginTop: 40 }} />
      ) : erro ? (
        <Erro mensagem={erro} aoTentar={recarregar} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={dados ?? []}
          keyExtractor={(f) => String(f.id)}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={<Text style={s.vazio}>Você ainda não tem favoritos.</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={s.linha}
              onPress={() =>
                router.push({ pathname: '/manga/[id]', params: { id: item.mangaId } })
              }
            >
              <Capa uri={item.coverUrl} largura={56} raio={6} />
              <Text style={s.nome} numberOfLines={2}>{item.title}</Text>
              <Pressable onPress={() => confirmarRemocao(item)} hitSlop={8}>
                <Text style={s.remover}>Remover</Text>
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, paddingHorizontal: 16 },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 40 },
  linha: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: cores.borda,
  },
  nome: { flex: 1, fontSize: 15, fontWeight: '600', color: cores.texto },
  remover: { color: cores.erro, fontWeight: '600', fontSize: 14 },
});