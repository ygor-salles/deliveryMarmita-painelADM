import { IProduct } from './IProduct.model';

export interface IOrderToProduct {
  id?: number;
  order_id?: number;
  product_id?: number;
  amount: number;
  observation: string;
  meet_options: string;
  total_item: number;
  products: IProduct;
}
