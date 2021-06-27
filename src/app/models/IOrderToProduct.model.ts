import { IProduct } from './IProduct.model';

export interface IOrderToProduct {
  id: number;
  amount: number;
  observation: string;
  meet_options: string;
  products: IProduct;
}