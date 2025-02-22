// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Carnicería</a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/inventario/dashboard">Dashboard</a>
          <a class="nav-link" routerLink="/inventario/traspasos">Traspasos</a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}