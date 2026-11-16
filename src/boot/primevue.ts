import { defineBoot } from '#q-app';
import PrimeVue from 'primevue/config';
import { SystemiaPreset } from '@/theme/systemia-preset';

export default defineBoot(({ app }) => {
  app.use(PrimeVue, {
    theme: {
      preset: SystemiaPreset,
      options: {
        // Usa el mismo selector que el modo oscuro de Quasar
        darkModeSelector: '.body--dark',
      },
    },
  });
});
