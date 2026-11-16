// Servicios / módulos de Systemia que se promocionan en el login.
// Edita esta lista a tu gusto. Iconos: nombres de Material Icons (https://fonts.google.com/icons)

export interface Servicio {
  icono: string;
  titulo: string;
  descripcion: string;
  puntos: string[];
}

export const servicios: Servicio[] = [
  {
    icono: 'account_balance_wallet',
    titulo: 'Cartera',
    descripcion: 'Saldos, cuentas por cobrar y recaudos siempre al día.',
    puntos: ['Cuentas por cobrar', 'Recaudos y abonos', 'Estados de cuenta'],
  },
  {
    icono: 'groups',
    titulo: 'Clientes',
    descripcion: 'Toda la información de tus clientes en un solo lugar.',
    puntos: ['Ficha completa del cliente', 'Historial de movimientos', 'Búsqueda rápida'],
  },
  {
    icono: 'water_drop',
    titulo: 'Control de agua',
    descripcion: 'Lecturas, consumos y control del servicio de agua.',
    puntos: ['Lectura de medidores', 'Cálculo de consumos', 'Control de suscriptores'],
  },
  {
    icono: 'receipt_long',
    titulo: 'Facturación',
    descripcion: 'Emisión y control de facturas de forma ordenada.',
    puntos: ['Facturas y notas', 'Control de vencimientos', 'Historial de facturación'],
  },
  {
    icono: 'insights',
    titulo: 'Reportes',
    descripcion: 'Informes claros para tomar mejores decisiones.',
    puntos: ['Informes por periodo', 'Exportación de datos', 'Indicadores clave'],
  },
  {
    icono: 'admin_panel_settings',
    titulo: 'Usuarios y permisos',
    descripcion: 'Acceso seguro según el rol de cada persona.',
    puntos: ['Roles por perfil', 'Acceso controlado', 'Registro de actividad'],
  },
];
