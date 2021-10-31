export interface IProduct {
  title?: string;
  id?: number;
  name: string;
  price: number;
  type: string;
  size?: string;
  description: string;
  status?: boolean;
  image?: string;
  created_at?: Date;
  updated_at?: Date;
}
