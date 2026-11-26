import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../lib/cores';
import Capa from './Capa';

export type Manga = {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  capa: string | null;
};

type Props = {
  manga: Manga;
  onPress?: (id: string) => void;
};

function MangaCard({ manga, onPress }: Props) {
  return (
    <Pressable style={s.card} onPress={() => onPress?.(manga.id)}>
      <Capa uri={manga.capa} />
      <Text style={s.titulo} numberOfLines={2}>
        {manga.titulo}
      </Text>
    </Pressable>
  );
}

// o memo só redesenha o cartão se o mangá ou o onPress mudarem
export default memo(MangaCard);

const s = StyleSheet.create({
  card: { flex: 1, maxWidth: '50%', margin: 6 },
  titulo: { marginTop: 6, fontSize: 14, fontWeight: '600', color: cores.texto },
});