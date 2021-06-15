import { IOrder } from './IOrder.model';

export interface IPagedOrder {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  offset: number;
  instances: IOrder[];
}
