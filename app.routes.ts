// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardInventarioComponent } from './features/inventario/components/dashboard-inventario/dashboard-inventario.component';
import { InventarioFormComponent } from './features/inventario/components/inventario-form/inventario-form.component';
import { InventarioListaComponent } from './features/inventario/components/inventario-lista/inventario-lista.component';
import { TraspasosComponent } from './features/inventario/components/traspasos/traspasos.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventario/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'inventario',
    children: [
      {
        path: 'dashboard',
        component: DashboardInventarioComponent
      },
      {
        path: 'productos',
        component: InventarioListaComponent
      },
      {
        path: 'productos/nuevo',
        component: InventarioFormComponent
      },
      {
        path: 'productos/editar/:codigo',
        component: InventarioFormComponent
      },
      {
        path: 'traspasos',
        component: TraspasosComponent
      }
    ]
  }
];