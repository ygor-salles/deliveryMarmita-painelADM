import { IProduct } from "./IProduct.model";

export interface IPagedProduct {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  offset: number;
  instances: IProduct[];
}
