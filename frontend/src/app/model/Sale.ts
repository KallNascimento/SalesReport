import {Product} from './product';

export interface Sale {
  id: number;
  productId: number;
  product?: Product;
  date: Date;
  quantitySold: number;
  totalAmount: number;
}
