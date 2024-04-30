import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AppService } from '@app/app.service';
import { PublicationRequestsData } from '@auctions/interfaces/publication-requests';
import { AuctionService } from '@auctions/services/auction.service';

@Component({
  selector: 'vehicle-requests',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './vehicle-requests.component.html',
  styleUrl: './vehicle-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleRequestsComponent {
  #auctionService = inject(AuctionService);
  #appService = inject(AppService);

  publicationRequests = signal<PublicationRequestsData[]>([]);

  constructor() {
    this.getPublicationRequests();
  }

  getPublicationRequests(): void {
    this.#auctionService.getPublicationRequests$().subscribe((response) => {
      this.publicationRequests.set(response.data);
    });
  }

  acceptPublicationRequest(id: string): void {
    this.#auctionService.acceptPublicationRequest$(id).subscribe({
      next: (response) => {
        this.getPublicationRequests();
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
