<template>
  <!-- hHh: el header ocupa todo el ancho; el menú es una cinta horizontal dentro del header -->
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-verde-principal text-white encabezado-sombra">
      <q-toolbar class="encabezado">
        <router-link to="/" class="encabezado__marca" aria-label="Inicio">
          <span class="emblema-insignia">
            <img src="~@/assets/systemia-emblema.png" alt="" class="emblema" />
          </span>
          <span class="encabezado__nombre">Systemia</span>
        </router-link>

        <q-space />

        <q-btn flat no-caps class="encabezado__usuario" aria-label="Opciones de usuario">
          <q-avatar size="30px" class="encabezado__avatar">
            <q-icon name="person" size="18px" />
          </q-avatar>
          <span class="gt-xs q-ml-sm">Mi cuenta</span>
          <q-icon name="expand_more" size="18px" class="gt-xs q-ml-xs" />

          <q-menu anchor="bottom right" self="top right" :offset="[0, 6]">
            <q-list style="min-width: 180px">
              <q-item v-close-popup clickable to="/login">
                <q-item-section avatar><q-icon name="logout" /></q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <!-- Menú horizontal: pestañas de módulos + cinta de opciones -->
      <MenuCinta />
    </q-header>

    <q-page-container class="contenido">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MenuCinta from '@/components/MenuCinta.vue';
</script>

<style scoped>
.encabezado {
  min-height: 56px;
  gap: 8px;
}

.encabezado__marca {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.encabezado__nombre {
  font-size: 1.125rem;
  font-weight: 600;
}

.encabezado__ubicacion {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  font-size: 0.875rem;
  opacity: 0.95;
}

.encabezado__usuario {
  padding: 4px 8px;
  border-radius: var(--sy-radio-sm);
}

.encabezado__avatar {
  background: rgba(255, 255, 255, 0.2);
}

/* Sombra sutil bajo el header + menú (reemplaza la de "elevated" de Quasar) */
.encabezado-sombra {
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.04);
}

.contenido {
  background: var(--sy-fondo);
}
</style>
