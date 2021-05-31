import { ProdutoFisico } from './produtoFisico.model';

export interface IprodutoFisicoPaginado {
    total: number;
    pagina: number;
    totalPaginas: number;
    limite: number;
    offset: number;
    instancias: ProdutoFisico[];
};