export interface IProduto {
  id?: number;
  nome: string;
  preco: number;
  tipo: string;
  descricao: string;
  status: boolean;
  imagem: File;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
