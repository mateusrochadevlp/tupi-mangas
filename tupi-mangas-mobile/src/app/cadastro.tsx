import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';
import { cores } from '../lib/cores';
import Botao from '../components/Botao';
import Campo from '../components/Campo';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    setErro('');
    if (!nome.trim()) return setErro('Digite seu nome');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErro('Digite um e-mail válido');
    if (senha.length < 6) return setErro('A senha precisa ter ao menos 6 caracteres');
    if (senha !== confirmar) return setErro('As senhas não conferem');

    setEnviando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
      setSucesso(true);
      setTimeout(() => router.replace('/login'), 1200);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.tela} keyboardShouldPersistTaps="handled">
        <Text style={s.titulo}>Criar conta</Text>

        <Campo rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Campo
          rotulo="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
        />
        <Campo
          rotulo="Confirmar senha"
          value={confirmar}
          onChangeText={setConfirmar}
          placeholder="Repita a senha"
          secureTextEntry
        />

        {erro ? <Text style={s.erro}>{erro}</Text> : null}
        {sucesso ? <Text style={s.sucesso}>Conta criada com sucesso!</Text> : null}

        <Botao
          titulo="Cadastrar"
          onPress={enviar}
          carregando={enviando}
          desabilitado={sucesso}
          style={{ marginTop: 24 }}
        />

        <Pressable onPress={() => router.replace('/login')}>
          <Text style={s.link}>Já tenho conta</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  tela: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: cores.texto },
  erro: { color: cores.erro, fontSize: 13, marginTop: 10 },
  sucesso: { color: cores.sucesso, fontSize: 14, fontWeight: '600', marginTop: 10 },
  link: { color: cores.destaque, fontWeight: '600', textAlign: 'center', marginTop: 18 },
});