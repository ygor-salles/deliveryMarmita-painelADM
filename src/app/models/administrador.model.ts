export interface Administrador {
  id?: number;
  nome: string;
  email: string;
  refresh_token?: string;
  token_recuperacao?: string;
  perfil_id: number;
  senha?: string;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  ativo?: boolean;
}
