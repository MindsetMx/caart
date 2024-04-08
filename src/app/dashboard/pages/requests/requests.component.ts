import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { AuctionService } from '@app/auctions/services/auction.service';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { PublicationRequestsData } from '@app/auctions/interfaces/publication-requests';
import { InputDirective } from '@shared/directives';
import { RequestsDetailsModalComponent } from '@app/dashboard/modals/requests-details-modal/requests-details-modal.component';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    InputDirective,
    RequestsDetailsModalComponent
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent {
  #auctionService = inject(AuctionService);
  #appService = inject(AppService);

  publicationRequests = signal<PublicationRequestsData[]>([]);
  acceptPublicationRequestButtonIsDisabled = signal<boolean>(false);
  requestsDetailsModalIsOpen = signal<boolean>(false);
  publicationId = signal<string>('');

  ngOnInit(): void {
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
