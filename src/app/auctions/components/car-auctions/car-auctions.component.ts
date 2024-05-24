import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { LastChanceCarAuctions } from '@auctions/interfaces';
import { LastChanceCarAuctionsService } from '@auctions/services/last-chance-car-auctions.service';

@Component({
  selector: 'car-auctions',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './car-auctions.component.html',
  styleUrl: './car-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarAuctionsComponent {
  #lastChanceCarAuctionsService = inject(LastChanceCarAuctionsService);
  #appService = inject(AppService);

  auctions = signal<LastChanceCarAuctions>({} as LastChanceCarAuctions);

  constructor() {
    this.getMyAuctions();
  }

  getMyAuctions(): void {
    this.#lastChanceCarAuctionsService.getMyAuctions$().subscribe((response) => {
      this.auctions.set(response);
    });
  }

  acceptOffer(idLastChance: string, idOffer: string): void {
    this.#lastChanceCarAuctionsService.acceptOffer$(idLastChance, idOffer).subscribe({
      next: () => {
        this.getMyAuctions();
        this.toastSuccess('Solicitud aceptada');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
