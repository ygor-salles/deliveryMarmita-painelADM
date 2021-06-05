import { IProduto } from './IProduto.model';

export interface IPedidoProduto {
  quantidade: number;
  observacao: string;
  opcoes_carne: string;
  produto: IProduto;
}
