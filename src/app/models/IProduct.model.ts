export interface IProduct {
  id?: number;
  name: string;
  price: number;
  type: string;
  description: string;
  status: boolean;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
