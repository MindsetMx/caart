import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { VehicleFilterService } from '../../services/vehicle-filter.service';
import { VehicleAuction } from '@auctions/interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'current-auctions',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './current-auctions.component.html',
  styleUrl: './current-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentAuctionsComponent implements OnInit {
  liveAuctions = signal<VehicleAuction>({} as VehicleAuction);
  auctionId = input.required<string | null>();

  #vehicleFilterService = inject(VehicleFilterService);

  ngOnInit(): void {
    this.getLiveAuctions();
  }

  getLiveAuctions(): void {
    this.#vehicleFilterService.getLiveAuctions$(
      1,
      5,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.auctionId()
    ).subscribe((response) => {
      this.liveAuctions.set(response);
    });
  }
}
