import { ChangeDetectionStrategy, Component, OnInit, effect, inject, input, signal } from '@angular/core';
import { VehicleFilterService } from '../../services/vehicle-filter.service';
import { VehicleAuction } from '@auctions/interfaces';
import { RouterLink } from '@angular/router';
import { AuctionCard2Component } from '../auction-card2/auction-card2.component';

@Component({
  selector: 'current-auctions',
  standalone: true,
  imports: [
    RouterLink,
    AuctionCard2Component
  ],
  templateUrl: './current-auctions.component.html',
  styleUrl: './current-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentAuctionsComponent implements OnInit {
  liveAuctions = signal<VehicleAuction>({} as VehicleAuction);
  auctionId = input.required<string | null>();

  #vehicleFilterService = inject(VehicleFilterService);

  auctionIdEffect = effect(() => {
    this.getLiveAuctions();
  });

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
