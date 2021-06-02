import { IProduto } from "./IProduto.model";

export interface IProdutoPaginado {
  total: number;
  pagina: number;
  totalPaginas: number;
  limite: number;
  offset: number;
  instancias: IProduto[];
}
