import { Imagem } from './imagem.model';
export interface ProdutoFisico {
    id?: number;
    ativo: boolean;
    nome: string;
    descricao: string;
    estoque: number;
    created_at?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
    imagens?: Imagem[];
}
