// src/app/features/inventario/models/alerta.model.ts
import { TipoAlerta } from './tipos.model';

export interface AlertaInventario {
  tipo: TipoAlerta;
  mensaje: string;
  codigoProducto: string;
  fecha: Date;
}