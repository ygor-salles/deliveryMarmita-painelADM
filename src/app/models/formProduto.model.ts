import { Imagem } from './imagem.model';
export interface DialogData {
    title: string;
    selectProduto: string;
    id: number;
    nome: string;
    descricao: string;
    ativo: boolean;
    estoque: number;
    validade: number;
    created_at: Date;
    updated_at: Date;
    imagens: Imagem[];
    link_hotmat: string;
}
