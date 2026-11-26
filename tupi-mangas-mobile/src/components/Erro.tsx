import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { cores } from '../lib/cores';

type Props = {
  mensagem: string;
  aoTentar?: () => void; // sem isso, o link "Tentar de novo" não aparece
  style?: StyleProp<ViewStyle>;
};

export default function Erro({ mensagem, aoTentar, style }: Props) {
  return (
    <View style={[s.caixa, style]}>
      <Text style={s.erro}>{mensagem}</Text>
      {aoTentar ? (
        <Pressable onPress={aoTentar}>
          <Text style={s.tentar}>Tentar de novo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  caixa: { alignItems: 'center' },
  erro: { color: cores.erro, fontSize: 14, marginBottom: 10, textAlign: 'center' },
  tentar: { color: cores.destaque, fontWeight: '600' },
});