/**
 * Layout del grupo (app): las pantallas que solo ve un usuario con sesión.
 * 
 * Los paréntesis en el nombre de la carpeta significan "grupo": organiza
 * archivos pero NO aparece en la URL. La bienvenida es "/" y no "/app".
 */
import { Stack } from 'expo-router';

import { colores } from '@/constants/tema';

export default function LayoutApp() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colores.tinta },
      }}
    />
  );
}