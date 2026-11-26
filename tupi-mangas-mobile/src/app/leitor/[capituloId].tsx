import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores } from '../../lib/cores';
import { useCarregar } from '../../hooks/useCarregar';
import Botao from '../../components/Botao';
import Carregando from '../../components/Carregando';
import Erro from '../../components/Erro';
import PaginaComZoom from '../../components/PaginaComZoom';

const VAZIO: string[] = [];

export default function Leitor() {
  const { capituloId, rotulo } = useLocalSearchParams<{ capituloId: string; rotulo?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [indice, setIndice] = useState(0);
  const { dados, carregando, erro, recarregar } = useCarregar<{ total: number; paginas: string[] }>(
    `/mangas/capitulos/${capituloId}/paginas`
  );

  const paginas = dados?.paginas ?? VAZIO;

  // já baixa a próxima página para a troca ser rápida
  useEffect(() => {
    if (paginas[indice + 1]) Image.prefetch(paginas[indice + 1]!);
  }, [indice, paginas]);

  const vazio = paginas.length === 0;
  const primeira = indice === 0;
  const ultima = indice === paginas.length - 1;

  return (
    <View style={[s.tela, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }]}>
      <View style={s.topo}>
        <Pressable onPress={() => router.back()}>
          <Text style={s.voltar}>← Voltar</Text>
        </Pressable>
        <Text style={s.rotulo} numberOfLines={1}>{rotulo ?? ''}</Text>
        <Text style={s.contador}>{!vazio ? `${indice + 1} / ${paginas.length}` : ''}</Text>
      </View>

      <View style={s.area}>
        {carregando ? (
          <Carregando cor={cores.branco} style={{ flex: 1 }} />
        ) : erro ? (
          <View style={s.centro}>
            <Erro mensagem={erro} aoTentar={recarregar} />
          </View>
        ) : vazio ? (
          <View style={s.centro}>
            <Text style={s.aviso}>Este capítulo não tem páginas.</Text>
          </View>
        ) : (
          // a key reinicia o zoom e o carregamento a cada página nova
          <PaginaComZoom key={paginas[indice]} uri={paginas[indice]!} />
        )}
      </View>

      {/* mangá se lê da direita para a esquerda: Próxima à esquerda, Anterior à direita */}
      <View style={s.botoes}>
        <Botao
          titulo="← Próxima"
          desabilitado={ultima || vazio}
          onPress={() => setIndice((i) => i + 1)}
          style={{ flex: 1 }}
        />
        <Botao
          titulo="Anterior →"
          desabilitado={primeira || vazio}
          onPress={() => setIndice((i) => i - 1)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundoLeitor },
  topo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 8, gap: 12,
  },
  voltar: { color: cores.destaque, fontWeight: '600', fontSize: 15 },
  rotulo: { color: cores.branco, flex: 1, textAlign: 'center', fontSize: 14 },
  contador: { color: cores.branco, fontSize: 14, minWidth: 54, textAlign: 'right' },
  area: { flex: 1, overflow: 'hidden' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  aviso: { color: cores.textoSuave, textAlign: 'center' },
  botoes: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 10 },
});