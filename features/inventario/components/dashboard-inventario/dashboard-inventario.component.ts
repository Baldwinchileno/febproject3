import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MovimientosChartComponent } from '../dashboard-charts/movimientos-chart.component';
import { TopProductosChartComponent } from '../dashboard-charts/top-productos-chart.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-inventario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MovimientosChartComponent,
    TopProductosChartComponent
  ],
  templateUrl: './dashboard-inventario.component.html',
  styleUrls: ['./dashboard-inventario.component.css']
})
export class DashboardInventarioComponent implements OnInit {
  constructor(public dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.cargarDashboard();
  }

  // Métodos de navegación para las acciones rápidas
  nuevoProducto() {
    // TODO: Implementar navegación a formulario de nuevo producto
  }

  realizarTraspaso() {
    // TODO: Implementar navegación a formulario de traspaso
  }

  generarReporte() {
    // TODO: Implementar generación de reporte
  }
}