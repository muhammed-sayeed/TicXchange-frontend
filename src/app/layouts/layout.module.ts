import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutComponent } from './layouts.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutService } from './layouts.service';
@NgModule({
    declarations: [
    SidebarComponent,
    NavbarComponent,
    LayoutComponent
  ],
    imports: [CommonModule, RouterModule],  
    providers: [LayoutService],
    exports: [
        LayoutComponent,
        SidebarComponent,
        NavbarComponent
    ]
})

export class LayoutModule {}