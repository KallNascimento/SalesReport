import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { NgIf } from '@angular/common';
import { Sale } from '../app/model/Sale';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgIf, HighchartsChartModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  @Input() salesData: Sale[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['salesData']) {
      this.updateChartOptions();
    }
  }

  private updateChartOptions(): void {
    const salesByMonthAndProduct = this.aggregateSalesData();
    const categories = Array.from(new Set(salesByMonthAndProduct.map(item => item.monthYear))); // Ensure unique month strings

    this.chartOptions = {
      title: { text: `Sales by Month for Selected Products` },
      chart: { type: 'column' },
      credits: { enabled: false },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        x: 0,
        y: 20,
        floating: true,
        borderWidth: 1,
      },
      xAxis: {
        categories,
        title: { text: 'Month' }
      },
      yAxis: {
        min: 0,
        title: { text: 'Quantity Sold' }
      },
      series: this.createSeries(salesByMonthAndProduct, categories)
    };
  }

  private aggregateSalesData() {
    const salesByMonthAndProduct = [];

    for (const sale of this.salesData) {
      const date = new Date(sale.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const productName = sale.product?.name || `Product ${sale.productId}`;

      salesByMonthAndProduct.push({ monthYear, productName, quantitySold: sale.quantitySold });
    }

    return salesByMonthAndProduct;
  }

  private createSeries(salesByMonthAndProduct: {
    monthYear: string;
    productName: string;
    quantitySold: number }[],
    categories: string[]): Highcharts.SeriesColumnOptions[] {
    const seriesMap = new Map<string, Highcharts.SeriesColumnOptions>();

    for (const { monthYear, productName, quantitySold } of salesByMonthAndProduct) {
      if (!seriesMap.has(productName)) {
        seriesMap.set(productName, { type: 'column', name: productName, data: Array(categories.length).fill(0)});
      }

      const productSeries = seriesMap.get(productName)!;
      const monthIndex = categories.indexOf(monthYear);
      productSeries.data![monthIndex] = (productSeries.data![monthIndex] as number) + quantitySold;
    }

    return Array.from(seriesMap.values());
  }
}
