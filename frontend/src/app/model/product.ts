import {Category} from './category';
import {Brand} from './brand';
import {Sale} from './Sale';

export interface Product {
  id: number;
  name?: string;
  price: number;
  quantity: number;
  brandId: number;
  brand?: Brand;
  categoryId: number;
  category?: Category;
  sales?: Sale[];
}
