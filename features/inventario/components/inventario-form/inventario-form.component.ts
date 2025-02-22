// src/app/features/inventario/components/inventario-form/inventario-form.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CategoriaProducto, UnidadMedida, Ubicacion } from '../../models/tipos.model';
import { ProductoInventario } from '../../models/producto.model';

@Component({
  selector: 'app-inventario-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.css']
})
export class InventarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventarioService = inject(InventarioService);
  private notificationService = inject(NotificationService);

  productoForm!: FormGroup;
  editMode = signal(false);
  loading = signal(false);
  submitted = signal(false);

  // Signals y Computed Values
  titulo = computed(() => this.editMode() ? 'Editar Producto' : 'Nuevo Producto');
  modoEdicion = computed(() => this.editMode());

  // Enums para el template
  readonly categorias = Object.values(CategoriaProducto);
  readonly unidadesMedida = Object.values(UnidadMedida);
  readonly ubicaciones = Object.values(Ubicacion);

  // Mock data para subcategorías
  readonly subcategorias: { [key in CategoriaProducto]?: string[] } = {
    [CategoriaProducto.CARNE_VACUNO]: ['ASADO', 'MOLIDA', 'HAMBURGUESA'],
    [CategoriaProducto.CARNE_CERDO]: ['CHULETA', 'COSTILLA', 'LOMO'],
    [CategoriaProducto.EMBUTIDOS]: ['CHORIZO', 'LONGANIZA', 'SALCHICHA'],
    [CategoriaProducto.AVES]: ['PECHUGA', 'PATA', 'ALA'],
    [CategoriaProducto.PREPARADOS]: ['HAMBURGUESA', 'ALBONDIGA', 'MARINADO']
  };

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    const codigo = this.route.snapshot.paramMap.get('codigo');
    if (codigo) {
      this.editMode.set(true);
      this.cargarProducto(codigo);
    }
  }

  private initForm() {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      subCategoria: ['', Validators.required],
      unidadMedida: ['', Validators.required],
      precioCompra: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, [Validators.required, Validators.min(0)]],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      ubicacion: ['', Validators.required],
      fechaVencimiento: [null],
      notas: ['']
    });

    if (this.editMode()) {
      this.productoForm.get('codigo')?.disable();
    }

    // Escuchar cambios en categoría para actualizar subcategorías
    this.productoForm.get('categoria')?.valueChanges.subscribe(categoria => {
      this.productoForm.patchValue({ subCategoria: '' });
    });
  }

  getSubcategorias(): string[] {
    const categoriaSeleccionada = this.productoForm.get('categoria')?.value as CategoriaProducto;
    return this.subcategorias[categoriaSeleccionada] || [];
  }

  async cargarProducto(codigo: string) {
    try {
      this.loading.set(true);
      const producto = await this.inventarioService.obtenerProductoPorCodigo(codigo);
      if (producto) {
        this.productoForm.patchValue({
          codigo: producto.codigo,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          subCategoria: producto.subCategoria,
          unidadMedida: producto.unidadMedida,
          precioCompra: producto.precioCompra,
          precioVenta: producto.precioVenta,
          stockMinimo: producto.stockMinimo,
          stockActual: producto.stockActual,
          ubicacion: producto.ubicacion,
          fechaVencimiento: producto.fechaVencimiento,
          notas: producto.notas
        });
      } else {
        this.notificationService.showError('Producto no encontrado');
        this.router.navigate(['/inventario/productos']);
      }
    } catch (error) {
      this.notificationService.showError('Error al cargar el producto');
      console.error('Error al cargar el producto:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit() {
    this.submitted.set(true);

    if (this.productoForm.invalid) {
      return;
    }

    try {
      this.loading.set(true);
      const productoData = {
        ...this.productoForm.value,
        codigo: this.editMode() ? 
          this.productoForm.get('codigo')?.value : 
          this.productoForm.value.codigo
      };

      if (this.editMode()) {
        await this.inventarioService.actualizarProducto(productoData);
        this.notificationService.showSuccess('Producto actualizado correctamente');
      } else {
        await this.inventarioService.crearProducto(productoData);
        this.notificationService.showSuccess('Producto creado correctamente');
      }

      this.router.navigate(['/inventario/productos']);
    } catch (error) {
      this.notificationService.showError('Error al guardar el producto');
      console.error('Error al guardar el producto:', error);
    } finally {
      this.loading.set(false);
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.productoForm.get(campo);
    return !!(control && control.invalid && (control.touched || this.submitted()));
  }

  getMensajeError(campo: string): string {
    const control = this.productoForm.get(campo);
    
    if (!control || !control.errors) return '';

    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      min: 'El valor debe ser mayor o igual a 0',
      email: 'Correo electrónico inválido'
    };

    const firstError = Object.keys(control.errors)[0];
    return errorMessages[firstError] || 'Campo inválido';
  }

  onCancel() {
    this.router.navigate(['/inventario/productos']);
  }
}