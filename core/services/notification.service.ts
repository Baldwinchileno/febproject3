// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  showSuccess(message: string): void {
    // TODO: Implementar notificación visual 
    // Por ahora solo console.log
    console.log('✅ Success:', message);
  }

  showError(message: string): void {
    // TODO: Implementar notificación visual
    // Por ahora solo console.error
    console.error('❌ Error:', message);
  }

  showWarning(message: string): void {
    // TODO: Implementar notificación visual
    console.warn('⚠️ Warning:', message);
  }

  showInfo(message: string): void {
    // TODO: Implementar notificación visual
    console.info('ℹ️ Info:', message);
  }
}