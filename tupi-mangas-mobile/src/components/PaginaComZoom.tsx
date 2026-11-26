import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { cores } from '../lib/cores';
import Botao from './Botao';
import Carregando from './Carregando';

function entre(valor: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(valor, min), max);
}

type Props = {
  uri: string;
};

// página com zoom de pinça, arrastar quando ampliada e toque duplo
export default function PaginaComZoom({ uri }: Props) {
  const escala = useSharedValue(1);
  const escalaSalva = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const largura = useSharedValue(0);
  const altura = useSharedValue(0);

  // carregamento da imagem desta página
  const [carregando, setCarregando] = useState(true);
  const [falhou, setFalhou] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  function tentarDeNovo() {
    setFalhou(false);
    setCarregando(true);
    setTentativa((t) => t + 1);
  }

  const pinca = usePinchGesture({
    onUpdate: (e) => {
      escala.value = entre(escalaSalva.value * e.scale, 1, 5);
      const mx = (largura.value * (escala.value - 1)) / 2;
      const my = (altura.value * (escala.value - 1)) / 2;
      x.value = entre(x.value, -mx, mx);
      y.value = entre(y.value, -my, my);
    },
    onDeactivate: () => {
      escalaSalva.value = escala.value;
    },
  });

  const arrasta = usePanGesture({
    onUpdate: (e) => {
      const mx = (largura.value * (escala.value - 1)) / 2;
      const my = (altura.value * (escala.value - 1)) / 2;
      x.value = entre(x.value + e.changeX, -mx, mx);
      y.value = entre(y.value + e.changeY, -my, my);
    },
  });

  const duploToque = useTapGesture({
    numberOfTaps: 2,
    onDeactivate: (e) => {
      if (e.canceled) return;
      if (escala.value > 1) {
        escala.value = withTiming(1);
        escalaSalva.value = 1;
        x.value = withTiming(0);
        y.value = withTiming(0);
      } else {
        escala.value = withTiming(2.5);
        escalaSalva.value = 2.5;
      }
    },
  });

  const gesto = useSimultaneousGestures(pinca, arrasta, duploToque);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: escala.value }],
  }));

  return (
    <View style={s.pagina}>
      <GestureDetector gesture={gesto}>
        <Animated.View
          style={[s.pagina, estilo]}
          onLayout={(ev) => {
            largura.value = ev.nativeEvent.layout.width;
            altura.value = ev.nativeEvent.layout.height;
          }}
        >
          <Image
            key={tentativa}
            source={{ uri }}
            style={s.imagem}
            contentFit="contain"
            onLoad={() => setCarregando(false)}
            onError={() => {
              setCarregando(false);
              setFalhou(true);
            }}
          />
        </Animated.View>
      </GestureDetector>

      {/* o círculo fica por cima da página e não atrapalha os gestos */}
      {carregando ? (
        <View style={[s.sobreposicao, { pointerEvents: 'none' }]}>
          <Carregando cor={cores.branco} />
        </View>
      ) : null}

      {falhou ? (
        <View style={s.sobreposicao}>
          <Text style={s.erro}>Não foi possível carregar esta página.</Text>
          <Botao
            titulo="Tentar de novo"
            onPress={tentarDeNovo}
            style={{ marginTop: 12, paddingHorizontal: 24 }}
          />
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  pagina: { flex: 1, width: '100%' },
  imagem: { width: '100%', height: '100%' },
  sobreposicao: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  erro: { color: cores.erro, textAlign: 'center' },
});