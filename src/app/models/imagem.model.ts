export interface Imagem {
    id: number;
    url: string;
    produto_fisico_id: number;
    produto_digital_id: number;
    exposicao_id: number;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}
