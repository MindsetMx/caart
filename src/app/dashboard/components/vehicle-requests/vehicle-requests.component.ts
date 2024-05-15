import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AppService } from '@app/app.service';
import { RequestsDetailsModalComponent } from '@dashboard/modals/requests-details-modal/requests-details-modal.component';
import { PublicationRequestsData } from '@auctions/interfaces/publication-requests';
import { AuctionService } from '@auctions/services/auction.service';
import { InputDirective } from '@shared/directives';

@Component({
  selector: 'vehicle-requests',
  standalone: true,
  imports: [
    RequestsDetailsModalComponent,
    InputDirective
  ],
  templateUrl: './vehicle-requests.component.html',
  styleUrl: './vehicle-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleRequestsComponent {
  publicationRequests = signal<PublicationRequestsData[]>([]);
  acceptPublicationRequestButtonIsDisabled = signal<boolean>(false);
  requestsDetailsModalIsOpen = signal<boolean>(false);
  publicationId = signal<string>('');

  #auctionService = inject(AuctionService);
  #appService = inject(AppService);

  constructor() {
    this.getPublicationRequests();
  }

  updatePublicationRequestStatus(id: string, status: Event): void {
    const target = status.target as HTMLSelectElement;

    switch (target.value) {
      case 'accepted':
        this.acceptPublicationRequest(id);
        break;
      case 'rejected':
        this.rejectPublicationRequest(id);
        break;
    }
  }

  openRequestsDetailsModal(publicationId: string): void {
    this.publicationId.set(publicationId);
    this.requestsDetailsModalIsOpen.set(true);
  }

  closeRequestsDetailsModal(isOpen: boolean): void {
    this.requestsDetailsModalIsOpen.set(isOpen);
  }

  getPublicationRequests(): void {
    this.#auctionService.getAllAuctionCars$().subscribe((response) => {
      this.publicationRequests.set(response.data);
    });
  }

  acceptPublicationRequest(id: string): void {
    this.acceptPublicationRequestButtonIsDisabled.set(true);

    this.#auctionService.acceptPublicationRequest$(id).subscribe({
      next: () => {
        this.getPublicationRequests();
        this.toastSuccess('Solicitud aceptada');
      },
      error: (error) => console.error(error),
    }).add(() => {
      this.acceptPublicationRequestButtonIsDisabled.set(false);
    });
  }

  rejectPublicationRequest(id: string): void {
    this.#auctionService.rejectPublicationRequest$(id).subscribe({
      next: () => {
        this.getPublicationRequests();
        this.toastSuccess('Solicitud rechazada');
      },
      error: (error) => console.error(error),
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
