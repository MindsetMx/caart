import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [
    SidebarComponent,
  ],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent { }
