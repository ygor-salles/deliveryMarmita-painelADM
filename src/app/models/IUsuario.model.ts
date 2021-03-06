export interface IUsuario {
  title?: string;
  id?: number;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}
