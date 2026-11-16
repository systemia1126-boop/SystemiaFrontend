<template>
  <nav class="cinta" aria-label="Menú principal">
    <!-- Módulos (pestañas) -->
    <div class="cinta__barra">
      <q-tabs
        :model-value="abierta || moduloActual ? seleccionado : undefined"
        dense
        no-caps
        align="left"
        outside-arrows
        mobile-arrows
        indicator-color="primary"
        class="cinta__pestanas"
      >
        <q-tab
          v-for="modulo in modulos"
          :key="modulo.titulo"
          :name="slug(modulo.titulo)"
          :label="modulo.titulo"
          class="cinta__pestana"
          @click="alPulsarModulo(modulo)"
        />
      </q-tabs>

      <q-btn
        flat
        dense
        round
        size="sm"
        :icon="abierta ? 'expand_less' : 'expand_more'"
        :aria-label="abierta ? 'Cerrar barra de menús' : 'Abrir barra de menús'"
        :aria-expanded="abierta"
        class="cinta__plegar"
        @click="abierta ? cerrar() : (abierta = true)"
      />
    </div>

    <!-- Franja horizontal: primero los menús del módulo; al elegir uno, sus vistas -->
    <q-slide-transition>
      <div v-show="abierta" class="cinta__panel">
        <transition name="cinta-cambio" mode="out-in">
          <!-- Menús -->
          <div v-if="!menuSeleccionado" key="menus" class="cinta__menus">
            <p v-if="!moduloSeleccionado?.menus.length" class="cinta__pendiente">
              Menús de {{ moduloSeleccionado?.titulo }} pendientes de configurar.
            </p>

            <button
              v-for="menu in moduloSeleccionado?.menus ?? []"
              :key="menu.titulo"
              type="button"
              class="cinta__menu"
              :class="{ 'cinta__menu--activo': esMenuActual(menu) }"
              @click="abrirMenu(menu)"
            >
              <q-icon :name="menu.icono" size="26px" class="cinta__menu-icono" />
              <span class="cinta__menu-titulo">{{ menu.titulo }}</span>
              <span class="cinta__menu-cantidad">{{ menu.vistas.length }} vistas</span>
            </button>
          </div>

          <!-- Vistas del menú elegido -->
          <div v-else :key="menuSeleccionado.titulo" class="cinta__vistas">
            <div class="cinta__vistas-cabecera">
              <q-btn
                flat
                dense
                no-caps
                icon="arrow_back"
                class="cinta__volver"
                @click="volverAMenus"
              />
              <span class="cinta__vistas-titulo">
                {{ menuSeleccionado.titulo }}
              </span>

              <q-input
                v-if="menuSeleccionado.vistas.length > MINIMO_PARA_BUSCAR"
                v-model="filtro"
                dense
                outlined
                clearable
                placeholder="Buscar vista..."
                aria-label="Buscar vista"
                class="cinta__buscador"
              >
                <template #prepend><q-icon name="search" size="18px" /></template>
              </q-input>
            </div>

            <div class="cinta__vistas-grid">
              <router-link
                v-for="vista in vistasFiltradas"
                :key="vista.titulo"
                :to="rutaVista(moduloSeleccionado!, menuSeleccionado, vista)"
                class="cinta__vista"
                active-class="cinta__vista--activa"
                @click="cerrar"
              >
                <q-icon :name="vista.icono" size="18px" class="cinta__vista-icono" />
                <span>{{ vista.titulo }}</span>
              </router-link>

              <p v-if="!vistasFiltradas.length" class="cinta__pendiente">
                {{
                  menuSeleccionado.vistas.length
                    ? 'Ninguna vista coincide con la búsqueda.'
                    : 'Este menú aún no tiene vistas configuradas.'
                }}
              </p>
            </div>
          </div>
        </transition>
      </div>
    </q-slide-transition>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { modulos, rutaVista, slug, type Menu, type Modulo } from '@/data/menu';

/** A partir de cuántas vistas se muestra el buscador */
const MINIMO_PARA_BUSCAR = 12;

const route = useRoute();

const moduloActual = computed(() =>
  typeof route.params.modulo === 'string' ? route.params.modulo : null,
);

// Módulo inicial: el de la pantalla actual o el primero que tenga menús
const primeroConMenus = modulos.find((m) => m.menus.length) ?? modulos[0];
const seleccionado = ref(moduloActual.value ?? (primeroConMenus ? slug(primeroConMenus.titulo) : ''));
const menuAbierto = ref<string | null>(null);
const filtro = ref<string | null>('');

// Si se entra directamente a una vista, la barra empieza cerrada
const abierta = ref(!route.params.vista);

const moduloSeleccionado = computed(() =>
  modulos.find((m) => slug(m.titulo) === seleccionado.value),
);

const menuSeleccionado = computed(() =>
  moduloSeleccionado.value?.menus.find((m) => slug(m.titulo) === menuAbierto.value),
);

function normalizar(texto: string) {
  return slug(texto).replace(/-/g, ' ');
}

const vistasFiltradas = computed(() => {
  const vistas = menuSeleccionado.value?.vistas ?? [];
  const termino = normalizar(filtro.value ?? '').trim();
  return termino ? vistas.filter((v) => normalizar(v.titulo).includes(termino)) : vistas;
});

watch(moduloActual, (valor) => {
  if (valor) seleccionado.value = valor;
});

function esMenuActual(menu: Menu) {
  return moduloActual.value === seleccionado.value && route.params.menu === slug(menu.titulo);
}

function alPulsarModulo(modulo: Modulo) {
  const valor = slug(modulo.titulo);
  if (valor === seleccionado.value && abierta.value && !menuAbierto.value) {
    // Pulsar el mismo módulo con sus menús a la vista: cierra la barra
    cerrar();
    return;
  }
  seleccionado.value = valor;
  volverAMenus();
  abierta.value = true;
}

function abrirMenu(menu: Menu) {
  filtro.value = '';
  menuAbierto.value = slug(menu.titulo);
}

function volverAMenus() {
  filtro.value = '';
  menuAbierto.value = null;
}

// Al elegir una vista (o con el botón ⌃) se cierra la barra y vuelve al estado inicial
function cerrar() {
  abierta.value = false;
  volverAMenus();
}
</script>

<style scoped>
.cinta {
  background: var(--sy-blanco);
  color: var(--sy-gris-oscuro);
  border-bottom: 1px solid var(--sy-borde);
}

/* ---------- Módulos (pestañas) ---------- */
.cinta__barra {
  display: flex;
  align-items: center;
  background: var(--sy-fondo);
}

.cinta__pestanas {
  flex: 1 1 auto;
  min-width: 0;
}

.cinta__pestana {
  min-height: 40px;
  padding: 0 14px;
  color: var(--sy-gris-medio);
  font-size: 0.875rem;
}

.cinta__pestana.q-tab--active {
  background: var(--sy-blanco);
  color: var(--sy-verde-oscuro);
  font-weight: 600;
}

.cinta__pestanas :deep(.q-tab__label) {
  font-weight: inherit;
}

.cinta__plegar {
  flex: 0 0 auto;
  margin: 0 8px;
  color: var(--sy-gris-medio);
}

/* ---------- Franja ---------- */
.cinta__panel {
  border-top: 1px solid var(--sy-borde);
  overflow: hidden;
}

.cinta__pendiente {
  margin: 0;
  padding: 14px 4px;
  color: var(--sy-gris-medio);
  font-size: 0.875rem;
}

/* Cambio suave entre menús y vistas */
.cinta-cambio-enter-active,
.cinta-cambio-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.cinta-cambio-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.cinta-cambio-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

/* ---------- Menús ---------- */
.cinta__menus {
  display: flex;
  align-items: stretch;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 12px;
  scrollbar-width: thin;
}

.cinta__menu {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 112px;
  padding: 8px 14px;
  border: 1px solid var(--sy-borde);
  border-radius: var(--sy-radio);
  background: var(--sy-blanco);
  color: var(--sy-gris-oscuro);
  font: inherit;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.cinta__menu:hover,
.cinta__menu:focus-visible {
  border-color: var(--sy-verde-principal);
  background: var(--sy-verde-claro);
  outline: none;
}

.cinta__menu-icono {
  margin-bottom: 2px;
  color: var(--sy-verde-oscuro);
}

.cinta__menu-titulo {
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}

.cinta__menu-cantidad {
  color: var(--sy-gris-medio);
  font-size: 0.6875rem;
}

.cinta__menu--activo {
  border-color: rgba(0, 200, 150, 0.6);
  background: var(--sy-verde-claro);
  color: var(--sy-verde-oscuro);
}

/* ---------- Vistas ---------- */
.cinta__vistas {
  padding: 8px 12px 12px;
}

.cinta__vistas-cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--sy-borde);
}

.cinta__volver {
  color: var(--sy-verde-oscuro);
  font-weight: 500;
}

.cinta__vistas-titulo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--sy-verde-oscuro);
  font-size: 0.9375rem;
  font-weight: 600;
}

.cinta__vistas-cantidad {
  color: var(--sy-gris-medio);
  font-size: 0.8125rem;
  font-weight: 400;
}

.cinta__buscador {
  width: 240px;
  max-width: 100%;
  margin-left: auto;
}

/* Las vistas llenan todo el ancho en columnas; si son muchas, la franja se desplaza */
.cinta__vistas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 2px 8px;
  max-height: min(45vh, 360px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.cinta__vista {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: var(--sy-radio-sm);
  color: var(--sy-gris-oscuro);
  font-size: 0.85rem;
  text-decoration: none;
  transition: background-color 0.15s;
}

.cinta__vista:hover,
.cinta__vista:focus-visible {
  background: var(--sy-verde-claro);
  outline: none;
}

.cinta__vista-icono {
  flex: 0 0 auto;
  color: var(--sy-verde-oscuro);
}

.cinta__vista--activa {
  background: var(--sy-verde-claro);
  color: var(--sy-verde-oscuro);
  font-weight: 600;
}

@media (max-width: 599px) {
  .cinta__vistas-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .cinta__buscador {
    width: 100%;
  }
}
</style>
