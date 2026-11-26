import { StyleSheet, Text, View, type DimensionValue } from 'react-native';
import { Image } from 'expo-image';
import { cores } from '../lib/cores';

type Props = {
  uri: string | null; // sem endereço, mostra o quadro "Sem capa"
  largura?: DimensionValue;
  raio?: number;
};

export default function Capa({ uri, largura = '100%', raio = 8 }: Props) {
  const caixa = { width: largura, borderRadius: raio };

  if (uri) {
    return <Image source={{ uri }} style={[s.capa, caixa]} contentFit="cover" />;
  }

  return (
    <View style={[s.capa, s.semCapa, caixa]}>
      <Text style={s.texto}>Sem capa</Text>
    </View>
  );
}

const s = StyleSheet.create({
  capa: { aspectRatio: 2 / 3, backgroundColor: cores.superficie },
  semCapa: { alignItems: 'center', justifyContent: 'center' },
  texto: { color: cores.textoSuave, fontSize: 12 },
});