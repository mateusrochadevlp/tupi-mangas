import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../lib/api';
import { cores } from '../../lib/cores';
import MangaCard, { type Manga } from '../../components/MangaCard';
import Botao from '../../components/Botao';
import Topo from '../../components/Topo';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';

type Resposta = { total: number; pagina: number; mangas: Manga[] };

const POR_PAGINA = 20;

function montarCaminho(texto: string, pagina: number) {
  const base = `/mangas?pagina=${pagina}`;
  return texto ? `${base}&busca=${encodeURIComponent(texto)}` : base;
}

export default function Catalogo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');
  const [termo, setTermo] = useState('');
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState('');
  const [erroMais, setErroMais] = useState('');

  // função estável: é ela que permite ao memo do MangaCard funcionar
  const abrir = useCallback(
    (id: string) => router.push({ pathname: '/manga/[id]', params: { id } }),
    [router]
  );

  // primeira página (ao abrir e a cada nova busca)
  const carregarPrimeira = useCallback(async (texto: string) => {
    setCarregando(true);
    setErro('');
    setErroMais('');
    try {
      const dados = await api<Resposta>(montarCaminho(texto, 1));
      setMangas(dados.mangas);
      setPagina(1);
      setTotal(dados.total);
    } catch (e: any) {
      setErro(e.message);
      setMangas([]);
      setTotal(0);
    } finally {
      setCarregando(false);
    }
  }, []);

  // páginas seguintes: soma à lista, sem repetir mangás
  async function carregarMais() {
    if (carregandoMais) return;
    setCarregandoMais(true);
    setErroMais('');
    try {
      const proxima = pagina + 1;
      const dados = await api<Resposta>(montarCaminho(termo, proxima));
      setMangas((atual) => {
        const ids = new Set(atual.map((m) => m.id));
        return [...atual, ...dados.mangas.filter((m) => !ids.has(m.id))];
      });
      setPagina(proxima);
      setTotal(dados.total);
    } catch (e: any) {
      setErroMais(e.message);
    } finally {
      setCarregandoMais(false);
    }
  }

  useEffect(() => {
    carregarPrimeira(termo);
  }, [termo, carregarPrimeira]);

  const temMais = pagina * POR_PAGINA < total;

  const rodape = (
    <View style={s.rodape}>
      {erroMais ? <Text style={s.erro}>{erroMais}</Text> : null}
      {carregandoMais ? (
        <Carregando />
      ) : temMais ? (
        <Botao
          titulo="Carregar mais obras"
          onPress={carregarMais}
          style={{ alignSelf: 'stretch' }}
        />
      ) : mangas.length > 0 ? (
        <Text style={s.fim}>Você chegou ao fim da lista.</Text>
      ) : null}
    </View>
  );

  return (
    <View style={[s.tela, { paddingTop: insets.top + 8 }]}>
      <Topo titulo="Catálogo" style={{ paddingHorizontal: 6 }} />

      <TextInput
        style={s.busca}
        value={busca}
        onChangeText={setBusca}
        onSubmitEditing={() => setTermo(busca.trim())}
        placeholder="Buscar mangá"
        placeholderTextColor={cores.textoSuave}
        keyboardAppearance="dark"
        returnKeyType="search"
      />

      {carregando ? (
        <Carregando style={{ marginTop: 40 }} />
      ) : erro ? (
        <Erro mensagem={erro} aoTentar={() => carregarPrimeira(termo)} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={mangas}
          keyExtractor={(m) => m.id}
          numColumns={2}
          renderItem={({ item }) => <MangaCard manga={item} onPress={abrir} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={<Text style={s.vazio}>Nenhum mangá encontrado.</Text>}
          ListFooterComponent={rodape}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, paddingHorizontal: 10 },
  busca: {
    borderWidth: 1, borderColor: cores.borda, borderRadius: 8,
    padding: 12, fontSize: 16, marginHorizontal: 6, marginBottom: 10,
    backgroundColor: cores.superficie, color: cores.texto,
  },
  erro: { color: cores.erro, fontSize: 14, marginBottom: 10, textAlign: 'center' },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 40 },
  rodape: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 6 },
  fim: { color: cores.textoSuave, fontSize: 13 },
});