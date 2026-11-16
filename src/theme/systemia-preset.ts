import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Tema de PrimeVue con la paleta de Systemia.
 *
 * primary: escala generada a partir del Verde principal (#00C896),
 *          de Verde claro (#E6FBF4) a Verde oscuro (#0B3D37).
 * surface: escala de grises que contiene Gris medio (#6B7280)
 *          y Gris oscuro (#1F2937).
 */
const verde = {
  50: '#e6fbf4', // Verde claro
  100: '#c0f4e2',
  200: '#8aeacb',
  300: '#4fdcb2',
  400: '#1ccf9f',
  500: '#00c896', // Verde principal
  600: '#00a47c',
  700: '#008265',
  800: '#0a6250',
  900: '#0b4a40',
  950: '#0b3d37', // Verde oscuro
};

const gris = {
  0: '#ffffff',
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280', // Gris medio
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937', // Gris oscuro
  900: '#111827',
  950: '#030712',
};

export const SystemiaPreset = definePreset(Aura, {
  semantic: {
    primary: verde,
    colorScheme: {
      light: {
        surface: gris,
      },
      dark: {
        surface: gris,
      },
    },
  },
});
