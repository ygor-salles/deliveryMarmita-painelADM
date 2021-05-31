import { ProdutoDigital } from './produtoDigital.model';
export interface IprodutoDigitalPaginado {
    total: number;
    pagina: number;
    totalPaginas: number;
    limite: number;
    offset: number;
    instancias: ProdutoDigital[];
            
};