import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MovimientosMensuales } from '../../services/dashboard.service';

@Component({
  selector: 'app-movimientos-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <canvas baseChart
      [data]="chartData"
      [options]="chartOptions"
      [type]="'line'">
    </canvas>
  `
})
export class MovimientosChartComponent implements OnChanges {
  @Input() data: MovimientosMensuales[] = [];

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Entradas',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Salidas',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    }
  };

  ngOnChanges() {
    if (this.data) {
      this.chartData.labels = this.data.map(d => d.fecha);
      this.chartData.datasets[0].data = this.data.map(d => d.entradas);
      this.chartData.datasets[1].data = this.data.map(d => d.salidas);
    }
  }
}