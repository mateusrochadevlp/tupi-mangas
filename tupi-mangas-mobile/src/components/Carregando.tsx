import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { cores } from '../lib/cores';

type Props = {
  cor?: string;
  tamanho?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
};

export default function Carregando({ cor = cores.destaque, tamanho = 'large', style }: Props) {
  return <ActivityIndicator size={tamanho} color={cor} style={style} />;
}