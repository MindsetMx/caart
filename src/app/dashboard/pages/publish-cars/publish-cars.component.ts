import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { AuctionCarService } from '../../services/auction-car.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './publish-cars.component.html',
  styleUrl: './publish-cars.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishCarsComponent {
  #auctionCarService = inject(AuctionCarService);

  auctionCarInfo = this.#auctionCarService.auctionCarInfo;
}
