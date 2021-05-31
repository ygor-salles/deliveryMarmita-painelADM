// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// NGX
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';

// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Componentes do layout
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent],
  imports: [
    CommonModule,
    CollapseModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule,

    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [NavbarComponent, SidebarComponent, FooterComponent],
  providers: [],
})
export class ComponentsModule {}
