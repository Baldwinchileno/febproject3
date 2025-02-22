// src/app/features/inventario/components/traspasos/traspasos.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { 
  TipoMovimiento,
  Ubicacion,
  ProductoInventario,
  MovimientoInventario
} from '../../models';

@Component({
  selector: 'app-traspasos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './traspasos.component.html',
  styleUrls: ['./traspasos.component.css']
})
export class TraspasosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private notificationService = inject(NotificationService);

  // Forms
  traspasoForm!: FormGroup;
  busquedaForm!: FormGroup;
  
  // Signals
  cargando = signal(false);
  error = signal<string | null>(null);
  submitted = signal(false);
  productoSeleccionado = signal<ProductoInventario | null>(null);
  traspasosRecientes = signal<MovimientoInventario[]>([]);

  // Enums y valores computados
  readonly ubicaciones = Object.values(Ubicacion);
  readonly ubicacionesDisponibles = computed(() => {
    const ubicacionOrigen = this.traspasoForm?.get('ubicacionOrigen')?.value;
    return this.ubicaciones.filter(ub => ub !== ubicacionOrigen);
  });

  constructor() {
    this.initializeForms();
  }

  ngOnInit() {
    this.cargarTraspasosRecientes();
  }

  private initializeForms() {
    this.busquedaForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.traspasoForm = this.fb.group({
      ubicacionOrigen: ['', Validators.required],
      ubicacionDestino: ['', Validators.required],
      unidades: [0, [Validators.required, Validators.min(0)]],
      kilos: [0, [Validators.required, Validators.min(0)]],
      motivo: ['', Validators.required],
      observaciones: ['']
    });

    // Validadores personalizados
    this.traspasoForm.get('ubicacionDestino')?.valueChanges.subscribe(ubicacionDestino => {
      const ubicacionOrigen = this.traspasoForm.get('ubicacionOrigen')?.value;
      if (ubicacionDestino && ubicacionDestino === ubicacionOrigen) {
        this.traspasoForm.get('ubicacionDestino')?.setErrors({ sameLocation: true });
      }
    });
  }

  async buscarProducto() {
    if (this.busquedaForm.invalid) return;

    try {
      this.cargando.set(true);
      this.error.set(null);
      
      const codigo = this.busquedaForm.get('codigo')?.value;
      const producto = await this.inventarioService.obtenerProductoPorCodigo(codigo);
      
      if (producto) {
        this.productoSeleccionado.set(producto);
        this.traspasoForm.patchValue({
          ubicacionOrigen: producto.ubicacion
        });
        
        // Actualizar validadores según el stock disponible
        this.traspasoForm.get('unidades')?.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(producto.unidades || 0)
        ]);
        
        this.traspasoForm.get('kilos')?.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(producto.kilos || 0)
        ]);
        
        this.traspasoForm.updateValueAndValidity();
      } else {
        this.error.set('Producto no encontrado');
        this.notificationService.showError('Producto no encontrado');
        this.productoSeleccionado.set(null);
        this.traspasoForm.reset();
      }
    } catch (error) {
      this.error.set('Error al buscar el producto');
      this.notificationService.showError('Error al buscar el producto');
      console.error('Error al buscar producto:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  async realizarTraspaso() {
    this.submitted.set(true);

    if (this.traspasoForm.invalid || !this.productoSeleccionado()) {
      return;
    }

    try {
      this.cargando.set(true);
      const traspasoData = this.traspasoForm.value;
      
      const movimiento: MovimientoInventario = {
        tipo: TipoMovimiento.TRASPASO,
        fecha: new Date(),
        codigoProducto: this.productoSeleccionado()!.codigo,
        ubicacionOrigen: traspasoData.ubicacionOrigen,
        ubicacionDestino: traspasoData.ubicacionDestino,
        unidades: traspasoData.unidades,
        kilos: traspasoData.kilos,
        motivo: traspasoData.motivo,
        observaciones: traspasoData.observaciones
      };

      await this.inventarioService.registrarMovimiento(movimiento);
      
      this.notificationService.showSuccess('Traspaso realizado correctamente');
      this.resetForms();
      await this.cargarTraspasosRecientes();
    } catch (error) {
      this.error.set('Error al realizar el traspaso');
      this.notificationService.showError('Error al realizar el traspaso');
      console.error('Error al realizar traspaso:', error);
    } finally {
      this.cargando.set(false);
    }
  }

  private async cargarTraspasosRecientes() {
    try {
      const fechaDesde = new Date();
      fechaDesde.setDate(fechaDesde.getDate() - 7);
      
      const movimientos = await this.inventarioService.obtenerMovimientos({
        fechaDesde,
        fechaHasta: new Date(),
        tipo: TipoMovimiento.TRASPASO
      });

      this.traspasosRecientes.set(movimientos);
    } catch (error) {
      console.error('Error al cargar traspasos recientes:', error);
      this.error.set('Error al cargar traspasos recientes');
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString();
  }

  private resetForms() {
    this.submitted.set(false);
    this.productoSeleccionado.set(null);
    this.error.set(null);
    this.busquedaForm.reset();
    this.traspasoForm.reset();
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted()));
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const control = form.get(fieldName);
    
    if (!control || !control.errors) return '';

    const errorMessages: { [key: string]: string } = {
      required: 'Este campo es requerido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      min: 'El valor debe ser mayor o igual a 0',
      max: 'El valor excede el stock disponible',
      sameLocation: 'La ubicación de origen y destino no pueden ser la misma'
    };

    const firstError = Object.keys(control.errors)[0];
    return errorMessages[firstError] || 'Campo inválido';
  }
}