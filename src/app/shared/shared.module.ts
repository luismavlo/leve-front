import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts/alerts.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ChildRoutesModule } from '../pages/child-routes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AlertsComponent,
    HeaderComponent,
    MenuComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [AlertsComponent, HeaderComponent, MenuComponent, FooterComponent],
})
export class SharedModule {}
