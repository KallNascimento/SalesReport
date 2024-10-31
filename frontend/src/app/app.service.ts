import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from './model/category';
import {environment} from '../environments/environment.development';
import {Product} from './model/product';
import {Brand} from './model/brand';
import {Observable} from 'rxjs';
import {Sale} from './model/Sale';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {
  }

  baseUrl = environment.apiUrl;

  getCategories() {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`)
  }

  getProductAndBrand(categoryId: number): Observable<{ products: Product[], brands: Brand[] }> {
    return this.http.get<{ products: Product[], brands: Brand[] }>(`${this.baseUrl}/products/${categoryId}`);
  }

  getSales(productId:number):Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.baseUrl}/sales/${productId}`);
  }
}
