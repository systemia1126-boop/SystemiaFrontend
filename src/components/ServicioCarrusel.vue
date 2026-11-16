<template>
  <div
    class="carrusel"
    :class="{ 'carrusel--oscuro': oscuro, 'carrusel--vertical': vertical }"
    @mouseenter="pausado = true"
    @mouseleave="pausado = false"
  >
    <q-carousel
      v-model="actual"
      class="carrusel__q"
      :autoplay="autoplay"
      animated
      infinite
      swipeable
      navigation
      :vertical="vertical"
      :navigation-position="vertical ? 'right' : 'bottom'"
      transition-prev="slide-down"
      transition-next="slide-up"
      :control-color="oscuro ? 'white' : 'primary'"
      height="100%"
      @focusin="pausado = true"
      @focusout="pausado = false"
    >
      <q-carousel-slide
        v-for="(servicio, i) in servicios"
        :key="servicio.titulo"
        :name="i"
        class="carrusel__slide"
      >
        <span v-if="vertical" class="carrusel__numero" aria-hidden="true">
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <span class="carrusel__etiqueta">{{ etiqueta }}</span>

        <span class="carrusel__icono">
          <q-icon :name="servicio.icono" size="40px" />
        </span>

        <h3 class="carrusel__titulo">{{ servicio.titulo }}</h3>
        <p class="carrusel__descripcion">{{ servicio.descripcion }}</p>

        <ul class="carrusel__puntos">
          <li v-for="punto in servicio.puntos" :key="punto">
            <q-icon name="check_circle" size="18px" class="carrusel__check" />
            <span>{{ punto }}</span>
          </li>
        </ul>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Servicio } from '@/data/servicios';

const props = withDefaults(
  defineProps<{
    servicios: Servicio[];
    /** Milisegundos entre cada servicio */
    intervalo?: number;
    etiqueta?: string;
    /** Integrado en un fondo oscuro: sin tarjeta, letra blanca y detalles en verde claro */
    oscuro?: boolean;
    /** Carrusel vertical grande: contenido alineado a la izquierda y navegación al lado */
    vertical?: boolean;
  }>(),
  { intervalo: 5000, etiqueta: 'Módulo', oscuro: false, vertical: false },
);

const actual = ref(0);
const pausado = ref(false);

// Sin animación automática si el usuario pidió reducir el movimiento
const reducirMovimiento =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const autoplay = computed(() =>
  pausado.value || reducirMovimiento || props.servicios.length < 2 ? false : props.intervalo,
);
</script>

<style scoped>
.carrusel {
  height: 100%;
  min-height: 420px;
  border: 1px solid #d5f2e8;
  border-radius: var(--sy-radio-lg);
  background: linear-gradient(180deg, var(--sy-verde-claro) 0%, var(--sy-blanco) 100%);
  overflow: hidden;
}

.carrusel__q {
  background: transparent;
}

.carrusel__slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 28px 56px;
  text-align: center;
}

.carrusel__etiqueta {
  margin-bottom: 20px;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--sy-blanco);
  color: var(--sy-verde-oscuro);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.carrusel__icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--sy-blanco);
  color: var(--sy-verde-oscuro);
  box-shadow: 0 6px 18px rgba(11, 61, 55, 0.08);
}

.carrusel__titulo {
  margin-top: 20px;
  color: var(--sy-gris-oscuro);
  font-size: 1.25rem;
  font-weight: 600;
}

.carrusel__descripcion {
  max-width: 260px;
  margin: 8px 0 0;
  color: var(--sy-gris-medio);
  font-size: 0.875rem;
  line-height: 1.55;
}

.carrusel__puntos {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  text-align: left;
}

.carrusel__puntos li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--sy-gris-oscuro);
  font-size: 0.875rem;
}

.carrusel__check {
  color: var(--sy-verde-principal);
}

/* ---------- Variante oscura: integrada en el fondo ---------- */
.carrusel--oscuro {
  border: 0;
  border-radius: 0;
  background: transparent;
}

.carrusel--oscuro .carrusel__etiqueta {
  border: 1px solid rgba(230, 251, 244, 0.3);
  background: transparent;
  color: var(--sy-verde-claro);
}

.carrusel--oscuro .carrusel__icono {
  border: 1px solid rgba(230, 251, 244, 0.18);
  background: rgba(230, 251, 244, 0.08);
  color: var(--sy-verde-claro);
  box-shadow: none;
}

.carrusel--oscuro .carrusel__titulo {
  color: var(--sy-blanco);
}

.carrusel--oscuro .carrusel__descripcion {
  color: rgba(255, 255, 255, 0.75);
}

.carrusel--oscuro .carrusel__puntos li {
  color: rgba(255, 255, 255, 0.92);
}

.carrusel--oscuro .carrusel__check {
  color: var(--sy-verde-claro);
}

/* ---------- Variante vertical grande ---------- */
.carrusel--vertical .carrusel__slide {
  position: relative;
  align-items: flex-start;
  padding: 48px 88px 48px 56px;
  text-align: left;
}

.carrusel__numero {
  position: absolute;
  top: 24px;
  right: 88px;
  color: rgba(230, 251, 244, 0.08);
  font-size: clamp(5rem, 4rem + 4vw, 9rem);
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.carrusel--vertical .carrusel__etiqueta {
  margin-bottom: 28px;
}

.carrusel--vertical .carrusel__icono {
  width: 96px;
  height: 96px;
  border-radius: 24px;
}

.carrusel--vertical .carrusel__icono .q-icon {
  font-size: 48px !important;
}

.carrusel--vertical .carrusel__titulo {
  margin-top: 28px;
  font-size: clamp(1.75rem, 1.3rem + 1.2vw, 2.5rem);
  font-weight: 700;
  line-height: 1.15;
}

.carrusel--vertical .carrusel__descripcion {
  max-width: 460px;
  margin-top: 12px;
  font-size: 1.0625rem;
  line-height: 1.6;
}

.carrusel--vertical .carrusel__puntos {
  gap: 14px;
  margin-top: 28px;
}

.carrusel--vertical .carrusel__puntos li {
  font-size: 1rem;
}

/* Puntos de navegación más discretos */
.carrusel__q :deep(.q-carousel__navigation .q-btn) {
  margin: 0 2px;
}
.carrusel__q :deep(.q-carousel__navigation-icon--inactive) {
  opacity: 0.35;
}
</style>
