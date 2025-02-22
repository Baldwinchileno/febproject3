// src/app/features/inventario/models/movimiento.model.ts
import { TipoMovimiento } from './tipos.model';
import { Ubicacion } from './ubicacion.model';

export interface MovimientoBase {
  tipo: TipoMovimiento;
  fecha: Date;
  codigoProducto: string;
  unidades?: number;
  kilos?: number;
  motivo?: string;
  observaciones?: string;
}

export interface MovimientoInventario extends MovimientoBase {
  ubicacionOrigen?: Ubicacion;
  ubicacionDestino?: Ubicacion;
  precioCompra?: number;
  precioVenta?: number;
  proveedor?: string;
  cliente?: string;
  motivoAjuste?: string;
}