<template>
  <q-page class="vista">
    <template v-if="encontrada">
      <div class="row items-center no-wrap q-mt-none">
        <span class="vista__icono">
          <q-icon :name="encontrada.vista.icono" size="28px" />
        </span>
        <h5 class="vista__titulo">{{ encontrada.vista.titulo }}</h5>
      </div>

      <!-- Tabla de usuarios (datos de ejemplo: src/data/usuarios-ejemplo.ts) -->
      <div class="tarjeta vista__tabla">
        <DataTable
          ref="tabla"
          v-model:filters="filtros"
          :value="usuarios"
          data-key="id"
          :global-filter-fields="camposBusqueda"
          sort-field="nombre"
          :sort-order="1"
          removable-sort
          striped-rows
          size="small"
          scrollable
          table-style="min-width: 960px"
          paginator
          :rows="10"
          :rows-per-page-options="[10, 25, 50]"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          current-page-report-template="{first}–{last} de {totalRecords}"
          export-filename="usuarios"
        >
          <template #header>
            <div class="tabla__barra">
              <div class="tabla__titulo">
                Usuarios
                <span class="tabla__cantidad">{{ usuarios.length }} registrados</span>
              </div>

              <div class="tabla__acciones">
                <IconField>
                  <InputIcon><q-icon name="search" size="18px" /></InputIcon>
                  <InputText
                    v-model="filtros.global.value"
                    placeholder="Buscar usuario..."
                    aria-label="Buscar usuario"
                    size="small"
                  />
                </IconField>

                <Button
                  label="Exportar CSV"
                  severity="secondary"
                  outlined
                  size="small"
                  @click="exportar"
                >
                  <template #icon><q-icon name="download" size="18px" class="q-mr-xs" /></template>
                </Button>
              </div>
            </div>
          </template>

          <template #empty>
            <div class="tabla__vacio">No se encontraron usuarios.</div>
          </template>

          <Column field="usuario" header="Usuario" sortable>
            <template #body="{ data }">
              <span class="tabla__usuario">{{ data.usuario }}</span>
            </template>
          </Column>
          <Column field="nombre" header="Nombre" sortable />
          <Column field="identificacion" header="Identificación" sortable />
          <Column field="correo" header="Correo" sortable />
          <Column field="rol" header="Rol" sortable />
          <Column field="estado" header="Estado" sortable>
            <template #body="{ data }">
              <Tag :value="data.estado" :severity="severidadEstado(data.estado)" />
            </template>
          </Column>
          <Column field="ultimoAcceso" header="Último acceso" sortable>
            <template #body="{ data }">
              <span :class="{ 'text-gris-medio': !data.ultimoAcceso }">
                {{ formatearFecha(data.ultimoAcceso) }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>

    <div v-else class="tarjeta vista__contenido">
      <q-icon name="search_off" size="40px" class="text-gris-medio" />
      <p class="texto-parrafo text-gris-medio q-mb-none">La vista solicitada no existe.</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import { buscarVista } from '@/data/menu';
import { usuariosEjemplo, type EstadoUsuario } from '@/data/usuarios-ejemplo';

const route = useRoute();

const encontrada = computed(() =>
  buscarVista(
    String(route.params.modulo ?? ''),
    String(route.params.menu ?? ''),
    String(route.params.vista ?? ''),
  ),
);

// --- Tabla de usuarios ---
const usuarios = ref(usuariosEjemplo);
const tabla = ref<{ exportCSV: () => void } | null>(null);

const camposBusqueda = ['usuario', 'nombre', 'identificacion', 'correo', 'rol', 'estado'];
const filtros = ref({
  global: { value: null as string | null, matchMode: 'contains' },
});

function severidadEstado(estado: EstadoUsuario) {
  return { Activo: 'success', Inactivo: 'secondary', Bloqueado: 'danger' }[estado];
}

const formatoFecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

function formatearFecha(iso: string | null) {
  return iso ? formatoFecha.format(new Date(iso)) : 'Sin acceso';
}

function exportar() {
  tabla.value?.exportCSV();
}
</script>

<style scoped>
.vista {
  padding: 10px;
}

.vista__icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: 12px;
  border-radius: var(--sy-radio);
  background: var(--sy-verde-claro);
  color: var(--sy-verde-oscuro);
}

.vista__titulo {
  margin: 0;
  font-weight: 600;
}

.vista__contenido {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  padding: 48px 24px;
  text-align: center;
}

/* ---------- Tabla ---------- */
.vista__tabla {
  margin-top: 10px;
  padding: 0;
  overflow: hidden;
}

.tabla__barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tabla__titulo {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: var(--sy-gris-oscuro);
  font-size: 1rem;
  font-weight: 600;
}

.tabla__cantidad {
  color: var(--sy-gris-medio);
  font-size: 0.8125rem;
  font-weight: 400;
}

.tabla__acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tabla__acciones :deep(.p-inputicon) {
  display: inline-flex;
  color: var(--sy-gris-medio);
}

.tabla__usuario {
  color: var(--sy-verde-oscuro);
  font-weight: 600;
}

.tabla__vacio {
  padding: 24px;
  color: var(--sy-gris-medio);
  text-align: center;
}

/* Bordes de la tabla acordes a la tarjeta */
.vista__tabla :deep(.p-datatable-header) {
  padding: 14px 16px;
  border-width: 0 0 1px;
}

.vista__tabla :deep(.p-datatable-paginator-bottom) {
  border-width: 1px 0 0;
}

@media (max-width: 599px) {
  .vista {
    padding: 16px;
  }

  .tabla__acciones,
  .tabla__acciones :deep(.p-iconfield) {
    width: 100%;
  }

  .tabla__acciones :deep(.p-inputtext) {
    width: 100%;
  }
}
</style>
