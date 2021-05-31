import { Administrador } from './administrador.model';
export interface IadministradorPaginado {
  total: number;
  pagina: number;
  totalPaginas: number;
  limite: number;
  offset: number;
  instancias: Administrador[];
}
