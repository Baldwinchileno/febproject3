// src/app/features/inventario/components/inventario-lista/inventario-lista.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventarioService } from '../../services/inventario.service';
import { ProductoInventario } from '../../models/producto.model';
import { 
  CategoriaProducto, 
  UnidadMedida, 
  Ubicacion 
} from '../../models/tipos.model';

@Component({
  selector: 'app-inventario-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-body">
          <!-- Header con título y botón de nuevo -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="card-title h3 mb-0">Inventario</h1>
            <div class="d-flex gap-2">
              <button class="btn btn-primary"
                      routerLink="/inventario/productos/nuevo">
                <i class="bi bi-plus-circle me-2"></i>Nuevo Producto
              </button>
            </div>
          </div>

          <!-- Filtros -->
          <div class="row g-3 mb-4">
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filtroCategoria">
                <option value="">Todas las categorías</option>
                @for (categoria of categorias; track categoria) {
                  <option [value]="categoria">{{categoria}}</option>
                }
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filtroUbicacion">
                <option value="">Todas las ubicaciones</option>
                @for (ubicacion of ubicaciones; track ubicacion) {
                  <option [value]="ubicacion">{{ubicacion}}</option>
                }
              </select>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input type="text" 
                       class="form-control" 
                       placeholder="Buscar producto..."
                       [(ngModel)]="busqueda">
              </div>
            </div>
          </div>

          <!-- Tabla de productos -->
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio Venta</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @if (productosFiltrados().length === 0) {
                  <tr>
                    <td colspan="7" class="text-center py-4">
                      No se encontraron productos
                    </td>
                  </tr>
                } @else {
                  @for (producto of productosFiltrados(); track producto.codigo) {
                    <tr>
                      <td><strong>{{producto.codigo}}</strong></td>
                      <td>
                        {{producto.nombre}}
                        <br>
                        <small class="text-muted">{{producto.subCategoria}}</small>
                      </td>
                      <td>{{producto.categoria}}</td>
                      <td>
                        <span [class.text-danger]="producto.stockActual <= producto.stockMinimo"
                              [class.fw-bold]="producto.stockActual <= producto.stockMinimo">
                          {{producto.stockActual}}
                          @if (producto.stockActual <= producto.stockMinimo) {
                            <i class="bi bi-exclamation-triangle-fill text-warning ms-1"></i>
                          }
                        </span>
                      </td>
                      <td>${{producto.precioVenta | number:'1.0-0'}}</td>
                      <td>
                        <span class="badge"
                              [class.bg-info]="producto.ubicacion === Ubicacion.SALA_PROCESOS"
                              [class.bg-primary]="producto.ubicacion === Ubicacion.CAMARA_CONGELADOS"
                              [class.bg-success]="producto.ubicacion === Ubicacion.LOCAL_MINORISTA">
                          {{producto.ubicacion}}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary"
                                  [routerLink]="['/inventario/productos/editar', producto.codigo]"
                                  title="Editar">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-outline-danger"
                                  (click)="eliminarProducto(producto.codigo)"
                                  title="Eliminar">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InventarioListaComponent implements OnInit {
  private inventarioService = inject(InventarioService);

  // Enums para el template
  readonly Ubicacion = Ubicacion;
  readonly categorias = Object.values(CategoriaProducto);
  readonly ubicaciones = Object.values(Ubicacion);

  // Estado
  productos: ProductoInventario[] = [];
  filtroCategoria = '';
  filtroUbicacion = '';
  busqueda = '';

  constructor() {}

  ngOnInit() {
    // Cargar datos de prueba
    this.productos = [
      {
        codigo: 'VAC001',
        nombre: 'Bife Ancho',
        descripcion: 'Corte de carne vacuna',
        categoria: CategoriaProducto.CARNE_VACUNO,
        subCategoria: 'BIFE',
        unidadMedida: UnidadMedida.KILO,
        precioCompra: 5000,
        precioVenta: 6500,
        stockMinimo: 10,
        stockActual: 15,
        kilos: 15,
        ubicacion: Ubicacion.CAMARA_CONGELADOS
      },
      {
        codigo: 'CER001',
        nombre: 'Costilla de Cerdo',
        descripcion: 'Costilla de cerdo fresca',
        categoria: CategoriaProducto.CARNE_CERDO,
        subCategoria: 'COSTILLA',
        unidadMedida: UnidadMedida.KILO,
        precioCompra: 3500,
        precioVenta: 4500,
        stockMinimo: 8,
        stockActual: 5,
        kilos: 5,
        ubicacion: Ubicacion.SALA_PROCESOS
      },
      {
        codigo: 'EMB001',
        nombre: 'Chorizo Parrillero',
        descripcion: 'Chorizo para parrilla',
        categoria: CategoriaProducto.EMBUTIDOS,
        subCategoria: 'CHORIZO',
        unidadMedida: UnidadMedida.KILO,
        precioCompra: 2500,
        precioVenta: 3500,
        stockMinimo: 15,
        stockActual: 20,
        kilos: 20,
        ubicacion: Ubicacion.LOCAL_MINORISTA
      }
    ];
  }

  // Computed
  productosFiltrados(): ProductoInventario[] {
    return this.productos.filter(producto => {
      const cumpleFiltroCategoria = !this.filtroCategoria || producto.categoria === this.filtroCategoria;
      const cumpleFiltroUbicacion = !this.filtroUbicacion || producto.ubicacion === this.filtroUbicacion;
      const cumpleBusqueda = !this.busqueda || 
        producto.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(this.busqueda.toLowerCase());

      return cumpleFiltroCategoria && cumpleFiltroUbicacion && cumpleBusqueda;
    });
  }

  // Acciones
  eliminarProducto(codigo: string) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.codigo !== codigo);
    }
  }
}