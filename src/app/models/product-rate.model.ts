import { Model } from "./model";
import { Product } from "./product.model";
import { User } from "./user.model";

export class ProductRate extends Model {
  id: number;
  user: User;
  product: Product;
  value : number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    super();
    this.fill(data);
  }
}

export interface ProductRateDto {
  productId: Number;
  value: number;
  comment: string;
}

export interface UpdateProductRateDto{
  id : number;
  value : number;
  comment : string;
  createdAt: Date;
  updatedAt: Date;
}
