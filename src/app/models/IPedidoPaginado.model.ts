import { IPedido } from './IPedido.model';

export interface IPedidoPaginado {
  total: number;
  pagina: number;
  totalPaginas: number;
  limite: number;
  offset: number;
  instancias: IPedido[];
}
