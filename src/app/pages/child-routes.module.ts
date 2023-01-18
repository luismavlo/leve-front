import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { LotsComponent } from './lots/lots.component';
import { ProductsComponent } from './products/products.component';
import { SalesComponent } from './sales/sales.component';

const childRoutes: Routes = [
  {
    path: 'abstract',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'Productos' },
  },
  {
    path: 'lots',
    component: LotsComponent,
    data: { title: 'Lotes' },
  },
  {
    path: 'clients',
    component: ClientsComponent,
    data: { title: 'Clientes' },
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    data: { title: 'Gastos' },
  },
  {
    path: 'sales',
    component: SalesComponent,
    data: { title: 'Ventas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
