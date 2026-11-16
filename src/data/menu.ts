// Menú principal de Systemia: Módulo → Menú → Vistas.
// - Módulo: pestaña superior (Contabilidad, Nómina...).
// - Menú:   botón de la cinta (Parámetros, Movimiento...).
// - Vista:  pantalla final; se elige en la lista desplegable del menú.
// Cada vista navega a /modulo/<modulo>/<menu>/<vista>.
// Iconos: nombres de Material Icons (https://fonts.google.com/icons)

export interface Vista {
  titulo: string;
  icono: string;
}

export interface Menu {
  titulo: string;
  icono: string;
  vistas: Vista[];
}

export interface Modulo {
  titulo: string;
  icono: string;
  menus: Menu[];
}

/** "Cuentas por Cobrar" → "cuentas-por-cobrar" */
export function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function rutaVista(modulo: Modulo, menu: Menu, vista: Vista): string {
  return `/modulo/${slug(modulo.titulo)}/${slug(menu.titulo)}/${slug(vista.titulo)}`;
}

export const modulos: Modulo[] = [
  { titulo: 'Empresa', icono: 'business', menus: [] },
  { titulo: 'Básicos', icono: 'tune', menus: [] },
  { titulo: 'Tercero', icono: 'people', menus: [] },
  {
    titulo: 'Contabilidad',
    icono: 'account_balance',
    menus: [
      {
        titulo: 'Parámetros',
        icono: 'tune',
        vistas: [
          { titulo: 'Plan Contable', icono: 'account_tree' },
          { titulo: 'Nivel Cuenta', icono: 'format_list_numbered' },
          { titulo: 'Concepto Contable', icono: 'settings_suggest' },
          { titulo: 'Indicador Retención', icono: 'percent' },
          { titulo: 'Concepto Exógena', icono: 'description' },
          { titulo: 'Actividad Económica', icono: 'business_center' },
          { titulo: 'Responsabilidad', icono: 'assignment_ind' },
          { titulo: 'Transacción', icono: 'swap_horiz' },
          { titulo: 'Concepto Transacción', icono: 'rule' },
          { titulo: 'Moneda', icono: 'paid' },
          { titulo: 'Definición UVT', icono: 'calculate' },
          { titulo: 'TRM Diario', icono: 'currency_exchange' },
          { titulo: 'Definición IPC', icono: 'trending_up' },
          { titulo: 'Régimen', icono: 'gavel' },
          { titulo: 'Tipo Impuesto', icono: 'receipt' },
        ],
      },
      {
        titulo: 'Movimiento',
        icono: 'sync_alt',
        vistas: [
          { titulo: 'Movimiento Contable', icono: 'post_add' },
          { titulo: 'Generar Pasivo', icono: 'request_quote' },
          { titulo: 'Anular Otro Pasivo', icono: 'undo' },
          { titulo: 'Generar Cuenta Cobrar', icono: 'note_add' },
          { titulo: 'Anticipo Cliente o Proveedor', icono: 'payments' },
          { titulo: 'Devolución Anticipo', icono: 'keyboard_return' },
        ],
      },
      {
        titulo: 'Herramientas',
        icono: 'build',
        vistas: [
          { titulo: 'Cierres', icono: 'lock_clock' },
          { titulo: 'Reclasificación', icono: 'low_priority' },
          { titulo: 'Eliminar Movimiento', icono: 'delete_sweep' },
          { titulo: 'Importar Exportar', icono: 'import_export' },
        ],
      },
      { titulo: 'Consultas', icono: 'search', vistas: [] },
      { titulo: 'Reportes', icono: 'print', vistas: [] },
    ],
  },
  { titulo: 'NIIF', icono: 'menu_book', menus: [] },
  { titulo: 'Inventario', icono: 'inventory_2', menus: [] },
  { titulo: 'Cuentas por Cobrar', icono: 'request_quote', menus: [] },
  { titulo: 'Cuentas por Pagar', icono: 'payments', menus: [] },
  { titulo: 'Venta', icono: 'point_of_sale', menus: [] },
  { titulo: 'Nómina', icono: 'badge', menus: [] },
  { titulo: 'Servicio Automotriz', icono: 'directions_car', menus: [] },
  { titulo: 'Cartera Financiera', icono: 'account_balance_wallet', menus: [] },
  { titulo: 'Activo Fijo', icono: 'domain', menus: [] },
  { titulo: 'Presupuesto', icono: 'savings', menus: [] },
  { titulo: 'Siembra y Cosecha', icono: 'agriculture', menus: [] },
  { titulo: 'Producción Avícola', icono: 'egg', menus: [] },
  { titulo: 'Bomberos', icono: 'local_fire_department', menus: [] },
  { titulo: 'Control Préstamo', icono: 'handshake', menus: [] },
  { titulo: 'Seguridad', icono: 'security', menus: [] },
  { titulo: 'Herramientas', icono: 'build', menus: [] },
];

/** Busca módulo, menú y vista a partir de los segmentos de la URL */
export function buscarVista(moduloSlug: string, menuSlug: string, vistaSlug: string) {
  const modulo = modulos.find((m) => slug(m.titulo) === moduloSlug);
  const menu = modulo?.menus.find((m) => slug(m.titulo) === menuSlug);
  const vista = menu?.vistas.find((v) => slug(v.titulo) === vistaSlug);
  return modulo && menu && vista ? { modulo, menu, vista } : null;
}
