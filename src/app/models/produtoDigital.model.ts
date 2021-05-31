import { Imagem } from './imagem.model';

export interface ProdutoDigital {
    id?: number;
    ativo: boolean;
    nome: string;
    descricao: string;
    validade: number;
    link_hotmat?: string;
    created_at?: Date;
    updated_at?: Date | null;
    deleted_at?: Date | null;
    imagens?: Imagem[];
}
