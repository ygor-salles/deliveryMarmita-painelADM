import { IStatusPedido } from './IStatusPedido.model';
import { IPedidoProduto } from './IPedidoProduto.model';
export interface IPedido {
  id: number;
  cliente: string;
  telefone: string;
  cep: string;
  endereco_rua: string;
  endereco_numero: number;
  endereco_bairro: string;
  endereco_cidade: string;
  valor_frete: number;
  retirada: string;
  pagamento: string;
  ponto_referencia: string;
  status: IStatusPedido;
  troco: number;
  total: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  pedido_produto: IPedidoProduto[];
}
