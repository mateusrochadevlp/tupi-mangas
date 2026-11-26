import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores } from '../../lib/cores';

const TAMANHO_ICONE = 26;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: cores.fundo },
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
          height: 68 + insets.bottom, // altura do rodapé (aumente ou diminua o 68)
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={TAMANHO_ICONE}
              color={focused ? cores.destaque : cores.textoSuave}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={TAMANHO_ICONE}
              color={focused ? cores.destaque : cores.textoSuave}
            />
          ),
        }}
      />
    </Tabs>
  );
}