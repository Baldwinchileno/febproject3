// features/inventario/services/dashboard.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductoInventario } from '../models/producto.model';
import { MovimientoInventario } from '../models/movimiento.model';
import { AlertaInventario } from '../models/alerta.model';

export interface DashboardMetrics {
    totalProductos: number;
    productosStockCritico: number;
    movimientosMes: number;
    variacionMensual: number;
    alertas: Alerta[];
}

export interface ProductoVentas {
    nombre: string;
    cantidad: number;
    porcentaje: number;
}

export interface MovimientosMensuales {
    fecha: string;
    entradas: number;
    salidas: number;
    balance: number;
}

export interface Alerta {
    codigo: string;
    nombre: string;
    stock: number;
    minimo: number;
}

export interface MovimientoPorUbicacion {
    ubicacion: string;
    entradas: number;
    salidas: number;
    balance: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    // Estados
    private metricsState = signal<DashboardMetrics>({
        totalProductos: 0,
        productosStockCritico: 0,
        movimientosMes: 0,
        variacionMensual: 0,
        alertas: []
    });
    private topProductosState = signal<ProductoVentas[]>([]);
    private movimientosMensualesState = signal<MovimientosMensuales[]>([]);
    private alertasState = signal<Alerta[]>([]);
    private movimientosPorUbicacionState = signal<MovimientoPorUbicacion[]>([]);

    // Computed values
    readonly metrics = computed(() => this.metricsState());
    readonly topProductos = computed(() => this.topProductosState());
    readonly movimientosMensuales = computed(() => this.movimientosMensualesState());
    readonly alertas = computed(() => this.alertasState());
    readonly movimientosPorUbicacion = computed(() => this.movimientosPorUbicacionState());

    constructor(private http: HttpClient) {}

    async cargarDashboard(): Promise<void> {
        try {
            await Promise.all([
                this.cargarMetricas(),
                this.cargarTopProductos(),
                this.cargarMovimientosMensuales(),
                this.cargarAlertas(),
                this.cargarMovimientosPorUbicacion()
            ]);
        } catch (error) {
            console.error('Error al cargar el dashboard:', error);
            throw error;
        }
    }

    private async cargarMetricas(): Promise<void> {
        // TODO: Reemplazar con llamada HTTP real
        // const response = await this.http.get<DashboardMetrics>('/api/dashboard/metrics').toPromise();
        // this.metricsState.set(response);

        // Simulación de datos
        this.metricsState.set({
            totalProductos: 1234,
            productosStockCritico: 5,
            movimientosMes: 342,
            variacionMensual: 8,
            alertas: []
        });
    }

    private async cargarTopProductos(): Promise<void> {
        // TODO: Reemplazar con llamada HTTP real
        this.topProductosState.set([
            { nombre: 'Longaniza', cantidad: 250, porcentaje: 25 },
            { nombre: 'Chorizo', cantidad: 200, porcentaje: 20 },
            { nombre: 'Salchicha', cantidad: 180, porcentaje: 18 }
        ]);
    }

    private async cargarMovimientosMensuales(): Promise<void> {
        // TODO: Reemplazar con llamada HTTP real
        this.movimientosMensualesState.set([
            { fecha: '2024-01', entradas: 120, salidas: 100, balance: 20 },
            { fecha: '2024-02', entradas: 150, salidas: 130, balance: 20 },
            { fecha: '2024-03', entradas: 180, salidas: 160, balance: 20 }
        ]);
    }

    private async cargarAlertas(): Promise<void> {
        // TODO: Reemplazar con llamada HTTP real
        this.alertasState.set([
            { codigo: '001', nombre: 'Carne Molida', stock: 5, minimo: 10 },
            { codigo: '002', nombre: 'Chorizo', stock: 3, minimo: 8 }
        ]);
    }

    private async cargarMovimientosPorUbicacion(): Promise<void> {
        // TODO: Reemplazar con llamada HTTP real
        this.movimientosPorUbicacionState.set([
            { ubicacion: 'Sala de Procesos', entradas: 150, salidas: 120, balance: 30 },
            { ubicacion: 'Cámara de Congelados', entradas: 200, salidas: 180, balance: 20 }
        ]);
    }

    // Métodos para filtros
    async filtrarPorPeriodo(fechaInicio: Date, fechaFin: Date): Promise<void> {
        // TODO: Implementar filtrado por período
    }

    async filtrarPorCategoria(categoria: string): Promise<void> {
        // TODO: Implementar filtrado por categoría
    }
}