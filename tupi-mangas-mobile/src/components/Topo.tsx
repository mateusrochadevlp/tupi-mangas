import {
  Pressable, StyleSheet, Text, View,
  type StyleProp, type ViewStyle,
} from 'react-native';
import { useAuth } from '../lib/auth';
import { cores } from '../lib/cores';

type Props = {
  titulo: string;
  style?: StyleProp<ViewStyle>;
};

export default function Topo({ titulo, style }: Props) {
  const { sair } = useAuth();

  return (
    <View style={[s.topo, style]}>
      <Text style={s.titulo}>{titulo}</Text>
      <Pressable onPress={sair} hitSlop={8}>
        <Text style={s.sair}>Sair</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.texto },
  sair: { color: cores.destaque, fontWeight: '600' },
});