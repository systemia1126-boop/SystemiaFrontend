<template>
  <div class="login">
    <main class="login__contenedor">
      <!-- Acceso (izquierda) -->
      <section class="login__acceso">
        <div class="login__tarjeta">
          <div class="login__marca">
            <img src="~@/assets/systemia-emblema.png" alt="" class="emblema emblema--lg" />
            <span class="login__marca-nombre">Systemia</span>
          </div>

          <div class="login__encabezado">
          </div>

          <form class="column q-gutter-y-lg" novalidate @submit.prevent="iniciarSesion">
            <div class="login__campo">
              <label for="usuario" class="login__etiqueta">Usuario</label>
              <IconField>
                <InputIcon><q-icon name="person_outline" size="18px" /></InputIcon>
                <InputText
                  id="usuario"
                  v-model.trim="usuario"
                  autocomplete="username"
                  placeholder="Ingresa tu usuario"
                  :invalid="enviado && !!errores.usuario"
                  size="large"
                  fluid
                />
              </IconField>
              <Message
                v-if="enviado && errores.usuario"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errores.usuario }}
              </Message>
            </div>

            <div class="login__campo">
              <label for="identificacion" class="login__etiqueta">Identificación</label>
              <IconField>
                <InputIcon><q-icon name="badge" size="18px" /></InputIcon>
                <InputText
                  id="identificacion"
                  v-model.trim="identificacion"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="Número de identificación"
                  :invalid="enviado && !!errores.identificacion"
                  size="large"
                  fluid
                />
              </IconField>
              <Message
                v-if="enviado && errores.identificacion"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ errores.identificacion }}
              </Message>
            </div>

            <div class="row items-center justify-between login__opciones">
              <label class="row items-center no-wrap q-gutter-x-sm login__recordar">
                <Checkbox v-model="recordar" input-id="recordar" binary />
                <span>Recordar usuario</span>
              </label>
              <a class="login__enlace" href="#" @click.prevent="abrirRecuperar">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" label="Ingresar" :loading="cargando" size="large" fluid />
          </form>
        </div>
      </section>

      <!-- Publicidad (derecha): carrusel vertical grande con todos los servicios -->
      <aside class="login__aside" aria-label="Servicios de Systemia">
        <ServicioCarrusel :servicios="servicios" :intervalo="5000" oscuro vertical />
      </aside>

      <!-- En pantallas pequeñas: carrusel horizontal debajo del login -->
      <aside class="login__aside-movil" aria-label="Servicios de Systemia">
        <ServicioCarrusel :servicios="servicios" :intervalo="5000" oscuro />
      </aside>
    </main>

    <!-- Recuperar contraseña -->
    <Dialog
      v-model:visible="recuperarVisible"
      modal
      header="Recuperar contraseña"
      :style="{ width: '28rem' }"
      :breakpoints="{ '575px': '92vw' }"
    >
      <template v-if="!recuperarEnviado">
        <p class="texto-parrafo text-gris-medio q-mt-none">
          Ingresa tu usuario y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>

        <form class="column q-gutter-y-md" novalidate @submit.prevent="enviarRecuperacion">
          <div class="login__campo">
            <label for="usuario-recuperar" class="login__etiqueta">Usuario</label>
            <IconField>
              <InputIcon><q-icon name="person_outline" size="18px" /></InputIcon>
              <InputText
                id="usuario-recuperar"
                v-model.trim="usuarioRecuperar"
                autocomplete="username"
                placeholder="Ingresa tu usuario"
                :invalid="recuperarIntento && !usuarioRecuperar"
                fluid
              />
            </IconField>
            <Message
              v-if="recuperarIntento && !usuarioRecuperar"
              severity="error"
              size="small"
              variant="simple"
            >
              Ingresa tu usuario.
            </Message>
          </div>

          <div class="row justify-end q-gutter-x-sm">
            <Button
              type="button"
              label="Cancelar"
              severity="secondary"
              text
              @click="recuperarVisible = false"
            />
            <Button type="submit" label="Enviar instrucciones" />
          </div>
        </form>
      </template>

      <template v-else>
        <Message severity="success">
          Si el usuario existe, recibirás las instrucciones para restablecer tu contraseña.
        </Message>
        <div class="row justify-end q-mt-md">
          <Button label="Entendido" @click="recuperarVisible = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import ServicioCarrusel from '@/components/ServicioCarrusel.vue';
import { servicios } from '@/data/servicios';

const router = useRouter();

// Servicios (publicidad): la lista se edita en src/data/servicios.ts

// --- Recordar usuario (solo en este navegador) ---
const CLAVE_USUARIO = 'systemia.usuario';

function leerUsuarioGuardado(): string {
  try {
    return localStorage.getItem(CLAVE_USUARIO) ?? '';
  } catch {
    return '';
  }
}

function guardarUsuario(valor: string | null) {
  try {
    if (valor) localStorage.setItem(CLAVE_USUARIO, valor);
    else localStorage.removeItem(CLAVE_USUARIO);
  } catch {
    // Almacenamiento no disponible (modo privado, bloqueado...): se ignora.
  }
}

// --- Login ---
const usuario = ref(leerUsuarioGuardado());
const recordar = ref(!!usuario.value);
const identificacion = ref('');
const enviado = ref(false);
const cargando = ref(false);

const errores = computed(() => ({
  usuario: usuario.value ? '' : 'Ingresa tu usuario.',
  identificacion: !identificacion.value
    ? 'Ingresa tu número de identificación.'
    : /^\d+$/.test(identificacion.value)
      ? ''
      : 'La identificación solo debe contener números.',
}));

async function iniciarSesion() {
  enviado.value = true;
  if (errores.value.usuario || errores.value.identificacion) return;

  cargando.value = true;
  try {
    guardarUsuario(recordar.value ? usuario.value : null);
    // Pendiente: validar las credenciales contra el backend / base de datos.
    await router.push('/');
  } finally {
    cargando.value = false;
  }
}

// --- Recuperar contraseña ---
const recuperarVisible = ref(false);
const recuperarEnviado = ref(false);
const recuperarIntento = ref(false);
const usuarioRecuperar = ref('');

function abrirRecuperar() {
  usuarioRecuperar.value = usuario.value;
  recuperarIntento.value = false;
  recuperarEnviado.value = false;
  recuperarVisible.value = true;
}

function enviarRecuperacion() {
  recuperarIntento.value = true;
  if (!usuarioRecuperar.value) return;

  // Pendiente: llamar al backend para enviar las instrucciones de recuperación.
  recuperarEnviado.value = true;
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: var(--sy-verde-oscuro);
}

/* Dos columnas: formulario (izquierda) | carrusel vertical grande (derecha) */
.login__contenedor {
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
  align-items: center;
  align-content: center;
  gap: 64px;
  max-width: 1280px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 48px 40px;
}

.login__acceso {
  display: flex;
  align-items: center;
}

.login__aside {
  min-width: 0;
  height: clamp(520px, calc(100vh - 96px), 680px);
}

.login__aside-movil {
  display: none;
}

/* ---------- Tarjeta de acceso ---------- */
.login__tarjeta {
  width: 100%;
  padding: 40px;
  background: var(--sy-blanco);
  border: 1px solid var(--sy-borde);
  border-radius: var(--sy-radio-lg);
  /* Sombra suave */
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 12px 32px rgba(15, 23, 42, 0.08);
}

.login__marca {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.login__marca-nombre {
  color: var(--sy-verde-oscuro);
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.login__encabezado {
  margin-bottom: 28px;
  text-align: center;
}

.login__form-titulo {
  color: var(--sy-gris-oscuro);
  font-size: 1.625rem;
  font-weight: 600;
}

.login__campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login__etiqueta {
  color: var(--sy-gris-oscuro);
  font-size: 0.875rem;
  font-weight: 500;
}

.login__campo :deep(.p-inputicon) {
  display: inline-flex;
  color: var(--sy-gris-medio);
}

.login__opciones {
  gap: 10px 16px;
}

.login__recordar {
  color: var(--sy-gris-oscuro);
  font-size: 0.875rem;
  cursor: pointer;
}

.login__enlace {
  color: var(--sy-verde-oscuro);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.login__enlace:hover {
  color: var(--sy-verde-principal);
  text-decoration: underline;
}

/* ---------- Responsive ---------- */
/* Pantallas pequeñas: login arriba y un solo carrusel con todos los servicios debajo */
@media (max-width: 1023px) {
  .login__contenedor {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    max-width: 480px;
    padding: 32px 16px;
  }

  .login__aside {
    display: none;
  }

  .login__aside-movil {
    display: block;
  }
}

@media (max-width: 480px) {
  .login__tarjeta {
    padding: 28px 20px;
  }
}
</style>
