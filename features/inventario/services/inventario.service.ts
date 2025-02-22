// src/app/features/inventario/services/inventario.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { 
  ProductoInventario,
  MovimientoInventario,
  AlertaInventario,
  TipoMovimiento,
  TipoAlerta,
  Ubicacion
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private inventarioState = signal<ProductoInventario[]>([]);
  private movimientosState = signal<MovimientoInventario[]>([]);
  private alertasState = signal<AlertaInventario[]>([]);

  // Computed values
  readonly inventario = computed(() => this.inventarioState());
  readonly movimientos = computed(() => this.movimientosState());
  readonly alertas = computed(() => this.alertasState());

  constructor(private http: HttpClient) {
    this.cargarDatosIniciales();
  }

  private async cargarDatosIniciales() {
    // TODO: Implementar carga desde backend
    // Por ahora usamos datos de prueba
    this.inventarioState.set([]);
    this.movimientosState.set([]);
    this.alertasState.set([]);
  }

  async obtenerProductoPorCodigo(codigo: string): Promise<ProductoInventario | null> {
    // TODO: Implementar llamada al backend
    return this.inventarioState().find(p => p.codigo === codigo) || null;
  }

  async crearProducto(producto: ProductoInventario): Promise<void> {
    // TODO: Implementar llamada al backend
    this.inventarioState.update(inv => [...inv, producto]);
    await this.verificarAlertasStock(producto.codigo);
  }

  async actualizarProducto(producto: ProductoInventario): Promise<void> {
    // TODO: Implementar llamada al backend
    this.inventarioState.update(inv =>
      inv.map(p => p.codigo === producto.codigo ? producto : p)
    );
    await this.verificarAlertasStock(producto.codigo);
  }

  async eliminarProducto(codigo: string): Promise<void> {
    // TODO: Implementar llamada al backend
    this.inventarioState.update(inv => 
      inv.filter(p => p.codigo !== codigo)
    );
  }

  async registrarMovimiento(movimiento: MovimientoInventario): Promise<void> {
    // TODO: Implementar llamada al backend
    this.movimientosState.update(mov => [...mov, {
      ...movimiento,
      fecha: new Date()
    }]);
    
    await this.procesarMovimiento(movimiento);
  }

  async obtenerMovimientos(filtros?: {
    fechaDesde?: Date;
    fechaHasta?: Date;
    tipo?: TipoMovimiento;
    ubicacion?: Ubicacion;
  }): Promise<MovimientoInventario[]> {
    let movimientos = this.movimientosState();

    if (filtros?.fechaDesde) {
      movimientos = movimientos.filter(m => m.fecha >= filtros.fechaDesde!);
    }
    if (filtros?.fechaHasta) {
      movimientos = movimientos.filter(m => m.fecha <= filtros.fechaHasta!);
    }
    if (filtros?.tipo) {
      movimientos = movimientos.filter(m => m.tipo === filtros.tipo);
    }
    if (filtros?.ubicacion) {
      movimientos = movimientos.filter(m => 
        m.ubicacionOrigen === filtros.ubicacion || 
        m.ubicacionDestino === filtros.ubicacion
      );
    }

    return movimientos;
  }

  private async procesarMovimiento(movimiento: MovimientoInventario) {
    const producto = await this.obtenerProductoPorCodigo(movimiento.codigoProducto);
    if (!producto) throw new Error('Producto no encontrado');

    switch (movimiento.tipo) {
      case TipoMovimiento.ENTRADA:
        producto.stockActual += movimiento.unidades || 0;
        break;
      case TipoMovimiento.SALIDA:
        producto.stockActual -= movimiento.unidades || 0;
        break;
      case TipoMovimiento.TRASPASO:
        // Actualizamos la ubicación
        producto.ubicacion = movimiento.ubicacionDestino!;
        break;
    }

    await this.actualizarProducto(producto);
    await this.verificarAlertasStock(producto.codigo);
  }

  private async verificarAlertasStock(codigoProducto: string) {
    const producto = await this.obtenerProductoPorCodigo(codigoProducto);
    if (!producto) return;

    if (producto.stockActual <= producto.stockMinimo) {
      const alerta: AlertaInventario = {
        tipo: TipoAlerta.STOCK_BAJO,
        mensaje: `Stock bajo para ${producto.nombre}`,
        codigoProducto: producto.codigo,
        fecha: new Date()
      };

      this.alertasState.update(alerts => [...alerts, alerta]);
    }
  }
}