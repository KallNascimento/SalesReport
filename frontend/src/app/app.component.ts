import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppService} from './app.service';
import {concatMap, Observable, of, tap} from 'rxjs';
import {Category} from './model/category';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Product} from './model/product';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {ChartComponent} from '../chart/chart.component';
import {Sale} from './model/Sale';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgFor,
    AsyncPipe,
    NgIf,
    FontAwesomeModule,
    ChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit {
  service = inject(AppService);
  selectedOption:boolean = false;
  categories$: Observable<Category[]> = this.service.getCategories();
  faBars = faBars
  products!: Product[];
  salesData$: Observable<Sale[]> = of([]);

  ngOnInit() { }

  onSelectCategory(event:any) {
    this.getProductsAndBrand(event)

  }

  getProductsAndBrand(categoryId: number) {
    this.salesData$ = this.service.getProductAndBrand(categoryId).pipe(
      concatMap((result) => {
        this.products = result.products;
        this.selectedOption = true;
        if (this.products.length <= 0) {
          return of([]);
        } else {
          const productId = this.products[0].id;
          return this.service.getSales(productId);
        }
      })
    );
  }





}
