// Datos de EJEMPLO para la tabla de usuarios (no son datos reales).
// Reemplazar por la consulta al backend / base de datos cuando esté disponible.

export type EstadoUsuario = 'Activo' | 'Inactivo' | 'Bloqueado';

export interface Usuario {
  id: number;
  usuario: string;
  nombre: string;
  identificacion: string;
  correo: string;
  rol: string;
  estado: EstadoUsuario;
  ultimoAcceso: string | null; // ISO 8601
}

const nombres = [
  'Ana María Gómez',
  'Carlos Andrés Pérez',
  'Laura Valentina Ríos',
  'Jorge Iván Martínez',
  'Diana Patricia Castro',
  'Luis Fernando Ortiz',
  'Paula Andrea Herrera',
  'Andrés Felipe Morales',
  'Sandra Milena Vargas',
  'Juan Sebastián López',
  'Natalia Rodríguez',
  'Camilo Torres',
  'Marcela Jiménez',
  'Óscar Eduardo Suárez',
  'Catalina Restrepo',
  'Diego Alejandro Ramírez',
  'Juliana Mejía',
  'Ricardo Salazar',
  'Valeria Cárdenas',
  'Felipe Rojas',
  'Gloria Inés Muñoz',
  'Hernán Darío Quintero',
  'Lina Marcela Zapata',
  'Mauricio Giraldo',
];

const roles = ['Administrador', 'Contador', 'Auxiliar contable', 'Cartera', 'Facturación', 'Consulta'];
const estados: EstadoUsuario[] = ['Activo', 'Activo', 'Activo', 'Activo', 'Inactivo', 'Bloqueado'];

function usuarioDesdeNombre(nombre: string) {
  const partes = nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(' ');
  const apellido = partes.at(-1) ?? 'usuario';
  return `${partes[0]?.[0] ?? 'u'}${apellido}`;
}

export const usuariosEjemplo: Usuario[] = nombres.map((nombre, i) => {
  const usuario = usuarioDesdeNombre(nombre);
  const estado = estados[i % estados.length] ?? 'Activo';
  return {
    id: i + 1,
    usuario,
    nombre,
    identificacion: String(1_000_000_000 + i * 37_291_113).slice(0, 10),
    correo: `${usuario}@empresa-ejemplo.com`,
    rol: roles[i % roles.length] ?? 'Consulta',
    estado,
    ultimoAcceso:
      estado === 'Inactivo' ? null : new Date(Date.UTC(2026, 10, 15 - (i % 12), 8 + (i % 9), (i * 7) % 60)).toISOString(),
  };
});
