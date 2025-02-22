// src/app/shared/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-shop me-2"></i>Gestión Carnicería
        </a>
        <button 
          class="navbar-toggler" 
          type="button" 
          (click)="isMenuCollapsed = !isMenuCollapsed">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div 
          class="collapse navbar-collapse" 
          [class.show]="!isMenuCollapsed">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" 
                 routerLink="/inventario/dashboard" 
                 routerLinkActive="active"
                 (click)="isMenuCollapsed = true">
                <i class="bi bi-graph-up me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" 
                 routerLink="/inventario/productos" 
                 routerLinkActive="active"
                 (click)="isMenuCollapsed = true">
                <i class="bi bi-box me-1"></i>Productos
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" 
                 routerLink="/inventario/traspasos" 
                 routerLinkActive="active"
                 (click)="isMenuCollapsed = true">
                <i class="bi bi-arrow-left-right me-1"></i>Traspasos
              </a>
            </li>
          </ul>
          <div class="d-flex">
            <button 
              class="btn btn-outline-light" 
              routerLink="/inventario/productos/nuevo">
              <i class="bi bi-plus-circle me-1"></i>Nuevo Producto
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-nav .nav-link.active {
      font-weight: bold;
      color: white !important;
    }
  `]
})
export class NavbarComponent {
  isMenuCollapsed = true;
}