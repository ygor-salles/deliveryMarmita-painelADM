export interface ITokenDecoded {
  exp: number;
  perfil_id: number;
  role: number;
  allowed_clients: number[];
  allowed_stores: number[];
}
