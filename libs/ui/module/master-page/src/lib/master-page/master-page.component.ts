import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '@expensesreport/ui';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'expensesreport-master-page',
  standalone: true,
  templateUrl: './master-page.component.html',
  styleUrl: './master-page.component.css',
  imports: [
    CommonModule,
    HeaderComponent,
    ToolbarComponent,
    FooterComponent,
    RouterModule,
    ToastComponent,
  ],
  providers: [MessageService],
})
export class MasterPageComponent {
  menuOpen = false;
  isMobile = false;

  constructor() {
    this.isMobile = window.innerWidth < 768;
  }

  onOpenMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onResize() {
    this.isMobile = window.innerWidth < 768;
  }
}
