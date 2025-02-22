// src/app/features/inventario/models/producto.model.ts
import { CategoriaProducto, UnidadMedida, Ubicacion } from './tipos.model';

export interface ProductoInventario {
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaProducto;
  subCategoria: string;      // Agregamos esta propiedad
  unidadMedida: UnidadMedida;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  stockActual: number;
  unidades?: number;
  kilos?: number;
  ubicacion: Ubicacion;
  fechaVencimiento?: Date;
  notas?: string;
}