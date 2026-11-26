import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores } from '../../lib/cores';
import { useCarregar } from '../../hooks/useCarregar';
import { useFavorito } from '../../hooks/useFavorito';
import Botao from '../../components/Botao';
import Capa from '../../components/Capa';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';

type Detalhes = {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  capa: string | null;
  autor: string | null;
  generos: string[];
};

type Capitulo = {
  id: string;
  capitulo: string | null;
  titulo: string | null;
  paginas: number;
};

export default function DetalhesManga() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const detalhes = useCarregar<Detalhes>(`/mangas/${id}`);
  const lista = useCarregar<{ capitulos: Capitulo[] }>(`/mangas/${id}/capitulos`);
  const fav = useFavorito(id);

  const manga = detalhes.dados;
  const capitulos = lista.dados?.capitulos ?? [];
  const carregando = detalhes.carregando || lista.carregando;
  const erro = detalhes.erro || lista.erro;

  function tentarDeNovo() {
    detalhes.recarregar();
    lista.recarregar();
  }

  if (carregando) {
    return (
      <View style={s.centro}>
        <Carregando />
      </View>
    );
  }

  if (erro || !manga) {
    return (
      <View style={s.centro}>
        <Erro mensagem={erro || 'Mangá não encontrado'} aoTentar={tentarDeNovo} />
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={s.voltar}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
    >
      <Pressable onPress={() => router.back()} style={s.voltarBox}>
        <Text style={s.voltar}>← Voltar</Text>
      </Pressable>

      <View style={s.cabecalho}>
        <Capa uri={manga.capa} largura={120} />
        <View style={{ flex: 1 }}>
          <Text style={s.titulo}>{manga.titulo}</Text>
          <Text style={s.autor}>{manga.autor ?? 'Autor desconhecido'}</Text>
          <Text style={s.status}>{manga.status}</Text>
        </View>
      </View>

      <View style={s.generos}>
        {manga.generos.map((g) => (
          <View key={g} style={s.genero}>
            <Text style={s.generoTexto}>{g}</Text>
          </View>
        ))}
      </View>

      <View style={s.favoritoBox}>
        <Botao
          titulo={fav.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          variante={fav.favorito ? 'contorno' : 'cheio'}
          carregando={fav.trabalhando}
          onPress={() => fav.alternar(manga.titulo, manga.capa)}
        />
      </View>

      <Text style={s.secao}>Sinopse</Text>
      <Text style={s.sinopse}>{manga.descricao || 'Sem sinopse.'}</Text>

      <Text style={s.secao}>Capítulos ({capitulos.length})</Text>
      {capitulos.length === 0 ? (
        <Text style={s.vazio}>Nenhum capítulo disponível em português.</Text>
      ) : (
        capitulos.map((c) => {
          const rotulo = `Cap. ${c.capitulo ?? '?'}${c.titulo ? ` - ${c.titulo}` : ''}`;
          return (
            <Pressable
              key={c.id}
              style={s.capitulo}
              onPress={() =>
                router.push({
                  pathname: '/leitor/[capituloId]',
                  params: { capituloId: c.id, rotulo },
                })
              }
            >
              <Text style={s.capituloTexto}>{rotulo}</Text>
              <Text style={s.capituloPaginas}>{c.paginas} págs</Text>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  centro: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 24, backgroundColor: cores.fundo,
  },
  voltarBox: { paddingHorizontal: 16, marginBottom: 12 },
  voltar: { color: cores.destaque, fontWeight: '600', fontSize: 15 },
  cabecalho: { flexDirection: 'row', gap: 14, paddingHorizontal: 16 },
  titulo: { fontSize: 20, fontWeight: '700', color: cores.texto },
  autor: { fontSize: 14, color: cores.textoSuave, marginTop: 6 },
  status: { fontSize: 13, color: cores.textoSuave, marginTop: 4, textTransform: 'capitalize' },
  generos: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, marginTop: 14 },
  genero: { backgroundColor: cores.chip, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  generoTexto: { color: cores.destaque, fontSize: 12, fontWeight: '600' },
  favoritoBox: { paddingHorizontal: 16, marginTop: 18 },
  secao: {
    fontSize: 17, fontWeight: '700', marginTop: 22, marginBottom: 8,
    paddingHorizontal: 16, color: cores.texto,
  },
  sinopse: { fontSize: 14, lineHeight: 20, color: cores.texto, paddingHorizontal: 16 },
  vazio: { color: cores.textoSuave, paddingHorizontal: 16 },
  capitulo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: cores.borda,
  },
  capituloTexto: { fontSize: 14, flex: 1, color: cores.texto },
  capituloPaginas: { fontSize: 12, color: cores.textoSuave },
});