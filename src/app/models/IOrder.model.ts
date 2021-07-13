import { IOrderToProduct } from './IOrderToProduct.model';

export interface IOrder {
  title?: string;
  id?: number;
  client_name: string;
  phone: string;
  cep: string;
  address_street: string;
  address_number: number;
  address_neighborhood: string;
  address_city: string;
  cost_freight: number;
  withdrawal: string;
  payment: string;
  reference_point: string;
  status?: string;
  change_of_money: number;
  total: number;
  products?: IOrderToProduct[];
  orderToProducts?: IOrderToProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}
