// src/app/shared/utils/validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static noFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const fecha = new Date(control.value);
      return fecha > new Date() ? { futureDate: true } : null;
    };
  }

  static stockDisponible(stockActual: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return control.value > stockActual ? { stockInsuficiente: true } : null;
    };
  }

  static ubicacionesDiferentes(ubicacionOrigenControl: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const form = control.parent;
      if (!form) return null;
      
      const ubicacionOrigen = form.get(ubicacionOrigenControl)?.value;
      return control.value === ubicacionOrigen ? { ubicacionesIguales: true } : null;
    };
  }
}