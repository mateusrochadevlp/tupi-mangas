import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';
import { cores } from '../lib/cores';
import Botao from '../components/Botao';
import Campo from '../components/Campo';

export default function Login() {
  const { entrar } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    setErroGeral('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErroEmail('Digite um e-mail válido');
      return;
    }
    setErroEmail('');
    if (!senha) {
      setErroGeral('Digite a senha');
      return;
    }

    setEnviando(true);
    try {
      await entrar(email.trim(), senha);
      // o layout troca de tela sozinho quando o token existe
    } catch (e: any) {
      setErroGeral(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={s.titulo}>Tupi Mangás</Text>
      <Text style={s.sub}>Entre para continuar</Text>

      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
        erro={erroEmail}
      />
      <Campo
        rotulo="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholder="Sua senha"
        secureTextEntry
      />

      {erroGeral ? <Text style={s.erro}>{erroGeral}</Text> : null}

      <Botao titulo="Entrar" onPress={enviar} carregando={enviando} style={{ marginTop: 24 }} />

      <Pressable onPress={() => router.push('/cadastro')}>
        <Text style={s.link}>Criar uma conta</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: cores.fundo },
  titulo: { fontSize: 28, fontWeight: '700', marginBottom: 4, color: cores.texto },
  sub: { fontSize: 15, color: cores.textoSuave, marginBottom: 24 },
  erro: { color: cores.erro, fontSize: 13, marginTop: 6 },
  link: { color: cores.destaque, fontWeight: '600', textAlign: 'center', marginTop: 18 },
});