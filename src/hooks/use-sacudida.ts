/**
 * Hook para animar una sacudida horizontal (shake).
 *
 * Utiliza react-native-reanimated. Conforme a las recomendaciones para
 * React Compiler, se accede y modifica el valor compartido a través de
 * los métodos .get() y .set(...) en vez de la propiedad .value.
 */
import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const DESPLAZAMIENTO = 10;
const TIEMPO = 70;

export function useSacudida() {
  const desplazamiento = useSharedValue(0);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ translateX: desplazamiento.get() }],
  }));

  const sacudir = useCallback(() => {
    desplazamiento.set(
      withSequence(
        withTiming(-DESPLAZAMIENTO, { duration: TIEMPO / 2 }),
        withRepeat(withTiming(DESPLAZAMIENTO, { duration: TIEMPO }), 5, true),
        withTiming(0, { duration: TIEMPO / 2 })
      )
    );
  }, [desplazamiento]);

  return { estilo, sacudir };
}

