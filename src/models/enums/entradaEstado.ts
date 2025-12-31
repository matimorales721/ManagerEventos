export enum EntradaEstado {
  NUEVA = "NUEVA",         // reservada, no paga
  ACTIVA = "ACTIVA",       // paga
  UTILIZADA = "UTILIZADA", // usada en el evento
  CANCELADA = "CANCELADA", // vencida / cancelada
}
