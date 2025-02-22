import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ProductoVentas } from '../../services/dashboard.service';

@Component({
  selector: 'app-top-productos-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <canvas baseChart
      [data]="chartData"
      [options]="chartOptions"
      [type]="'bar'">
    </canvas>
  `
})
export class TopProductosChartComponent implements OnChanges {
  @Input() data: ProductoVentas[] = [];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  ngOnChanges() {
    if (this.data) {
      this.chartData.labels = this.data.map(d => d.nombre);
      this.chartData.datasets[0].data = this.data.map(d => d.cantidad);
    }
  }
}