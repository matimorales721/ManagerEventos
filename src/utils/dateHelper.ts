/**
 * Helper para manejo de fechas en GMT-3 (Argentina/Buenos Aires)
 */

const GMT3_OFFSET = -3 * 60 * 60 * 1000;

/**
 * Obtiene la fecha y hora actual ajustada a GMT-3
 * @returns Date object ajustado a GMT-3
 */
export function newDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + GMT3_OFFSET);
}