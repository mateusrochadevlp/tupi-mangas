import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';
import { cores } from '../lib/cores';

type Props = TextInputProps & {
  rotulo: string;
  erro?: string; // se vier preenchido, a borda fica vermelha e a mensagem aparece abaixo
};

export default function Campo({ rotulo, erro, style, ...resto }: Props) {
  return (
    <>
      <Text style={s.rotulo}>{rotulo}</Text>
      <TextInput
        placeholderTextColor={cores.textoSuave}
        keyboardAppearance="dark"
        style={[s.campo, erro ? s.campoErro : null, style]}
        {...resto}
      />
      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </>
  );
}

const s = StyleSheet.create({
  rotulo: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 12, color: cores.texto },
  campo: {
    borderWidth: 1, borderColor: cores.borda, borderRadius: 8, padding: 12,
    fontSize: 16, backgroundColor: cores.superficie, color: cores.texto,
  },
  campoErro: { borderColor: cores.erro },
  erro: { color: cores.erro, fontSize: 13, marginTop: 6 },
});