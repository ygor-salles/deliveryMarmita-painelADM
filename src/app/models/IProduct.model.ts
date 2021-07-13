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
  createdAt?: Date;
  updatedAt?: Date;
}
