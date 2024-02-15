import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { AppService } from '@app/app.service';
import { PublicationRequestsData } from '@app/auctions/interfaces/publication-requests';
import { AuctionService } from '@app/auctions/services/auction.service';

@Component({
  selector: 'app-publication-requests',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './publication-requests.component.html',
  styleUrl: './publication-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationRequestsComponent implements OnInit {
  #auctionService = inject(AuctionService);
  #appService = inject(AppService);

  publicationRequests: WritableSignal<PublicationRequestsData[]> = signal([]);

  ngOnInit(): void {
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
