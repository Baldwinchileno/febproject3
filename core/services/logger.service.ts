import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  error(message: string, error: any) {
    console.error(message, error);
    // Aquí podríamos agregar integración con servicios de logging
  }
}