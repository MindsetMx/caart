import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="dashboard-container">
      <sidebar-layout></sidebar-layout>
      <main class="dashboard-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
    }

    .dashboard-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
    }
  `]
})
export class DashboardComponent {}
