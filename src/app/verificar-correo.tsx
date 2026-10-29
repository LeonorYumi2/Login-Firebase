/**
 * Pantalla de verificación de correo electrónico.
 *
 * Se muestra tras el registro o al iniciar sesión con una cuenta no verificada.
 * Protegida por Stack.Protected (guard={!!usuario && !verificado}).
 */
import { useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';

import { Aviso } from '@/components/aviso';
import { Boton } from '@/components/boton';
import { PantallaHoja } from '@/components/pantalla-hoja';
import { espacio } from '@/constants/tema';
import { useSesion } from '@/context/sesion';
import { mensajeDeError } from '@/lib/errores-firebase';

export default function PantallaVerificarCorreo() {
  const { usuario, comprobarVerificacion, enviarVerificacion, cerrarSesion } = useSesion();

  const [comprobando, setComprobando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: 'error' | 'exito'; mensaje: string } | null>(null);

  // Cuando el usuario abre el enlace en su cliente de correo / navegador y vuelve a la app,
  // verificamos automáticamente el estado sin exigirle presionar el botón.
  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') {
        comprobarVerificacion().catch(() => {});
      }
    });

    return () => {
      suscripcion.remove();
    };
  }, [comprobarVerificacion]);

  async function manejarComprobar() {
    setComprobando(true);
    setAviso(null);
    try {
      const verificado = await comprobarVerificacion();
      if (!verificado) {
        setAviso({
          tipo: 'error',
          mensaje:
            'Aún no detectamos la verificación. Abre el enlace que te enviamos al correo y vuelve a pulsar este botón.',
        });
      }
      // Si devuelve true no navegamos manualmente: Stack.Protected se encarga al cambiar el estado.
    } catch (error) {
      setAviso({ tipo: 'error', mensaje: mensajeDeError(error) });
    } finally {
      setComprobando(false);
    }
  }

  async function manejarReenviar() {
    setReenviando(true);
    setAviso(null);
    try {
      await enviarVerificacion();
      setAviso({
        tipo: 'exito',
        mensaje: 'Te enviamos un nuevo correo de verificación. Revisa tu bandeja de entrada o spam.',
      });
    } catch (error) {
      setAviso({ tipo: 'error', mensaje: mensajeDeError(error) });
    } finally {
      setReenviando(false);
    }
  }

  async function manejarCerrarSesion() {
    try {
      await cerrarSesion();
      // No navegamos: al quedar usuario = null, Stack.Protected nos lleva al login.
    } catch (error) {
      setAviso({ tipo: 'error', mensaje: mensajeDeError(error) });
    }
  }

  const correoUsuario = usuario?.email ?? 'tu correo';

  return (
    <PantallaHoja
      antetitulo="ESFOT, Escuela Politécnica Nacional"
      titulo={'Verifica\ntu correo'}
      bajada={`Enviamos un mensaje de confirmación a ${correoUsuario}. Abre el enlace para activar tu cuenta.`}>
      {aviso ? <Aviso tipo={aviso.tipo} mensaje={aviso.mensaje} /> : null}

      <Boton
        texto="Ya verifiqué mi correo"
        onPress={manejarComprobar}
        cargando={comprobando}
      />

      <Boton
        variante="secundario"
        texto="Reenviar correo"
        onPress={manejarReenviar}
        cargando={reenviando}
      />

      <View style={styles.pie}>
        <Boton variante="enlace" texto="Usar otra cuenta" onPress={manejarCerrarSesion} />
      </View>
    </PantallaHoja>
  );
}

const styles = StyleSheet.create({
  pie: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: espacio.m,
  },
});

