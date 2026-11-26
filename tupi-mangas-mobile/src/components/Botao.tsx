import {
  ActivityIndicator, Pressable, StyleSheet, Text,
  type StyleProp, type ViewStyle,
} from 'react-native';
import { cores } from '../lib/cores';

type Props = {
  titulo: string;
  onPress: () => void;
  carregando?: boolean; // mostra o círculo no lugar do texto e bloqueia o toque
  desabilitado?: boolean; // deixa o botão cinza e bloqueia o toque
  variante?: 'cheio' | 'contorno';
  style?: StyleProp<ViewStyle>; // margem, flex etc. da tela que usa
};

export default function Botao({
  titulo,
  onPress,
  carregando = false,
  desabilitado = false,
  variante = 'cheio',
  style,
}: Props) {
  const contorno = variante === 'contorno';

  return (
    <Pressable
      style={[
        s.base,
        contorno ? s.contorno : s.cheio,
        desabilitado && !contorno && s.off,
        style,
      ]}
      onPress={onPress}
      disabled={desabilitado || carregando}
    >
      {carregando ? (
        <ActivityIndicator color={contorno ? cores.destaque : cores.branco} />
      ) : (
        <Text style={[s.texto, contorno && s.textoContorno]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.botao,
  },
  cheio: { backgroundColor: cores.botao },
  contorno: { backgroundColor: 'transparent' },
  off: { backgroundColor: cores.botaoDesativado, borderColor: cores.botaoDesativado },
  texto: { color: cores.branco, fontSize: 16, fontWeight: '600' },
  textoContorno: { color: cores.destaque },
});