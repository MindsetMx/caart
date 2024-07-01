import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { AllAuctionArt } from '@dashboard/interfaces';
import { ArtRequestsDetailsModalComponent } from '@dashboard/modals/art-requests-details-modal/art-requests-details-modal.component';
import { ArtRequestsService } from '@dashboard/services/art-requests.service';
import { InputDirective } from '@shared/directives';

@Component({
  selector: 'art-requests',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    ArtRequestsDetailsModalComponent
  ],
  templateUrl: './art-requests.component.html',
  styleUrl: './art-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRequestsComponent {
  artRequests = signal<AllAuctionArt>({} as AllAuctionArt);
  acceptPublicationRequestButtonIsDisabled = signal<boolean>(false);
  publicationId = signal<string>('');
  requestsDetailsModalIsOpen = signal<boolean>(false);

  #artRequestsService = inject(ArtRequestsService);
  #appService = inject(AppService);

  constructor() {
    this.getArtRequests();
  }

  getArtRequests(): void {
    this.#artRequestsService.getAllAuctionArt$().subscribe((response) => {
      this.artRequests.set(response);
    });
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

  acceptPublicationRequest(id: string): void {
    this.acceptPublicationRequestButtonIsDisabled.set(true);

    this.#artRequestsService.acceptPublicationRequest$(id).subscribe({
      next: () => {
        this.getArtRequests();
        this.toastSuccess('Solicitud aceptada');
      },
      error: (error) => console.error(error),
    }).add(() => {
      this.acceptPublicationRequestButtonIsDisabled.set(false);
    });
  }

  rejectPublicationRequest(id: string): void {
    this.#artRequestsService.rejectPublicationRequest$(id).subscribe({
      next: () => {
        this.getArtRequests();
        this.toastSuccess('Solicitud rechazada');
      },
      error: (error) => console.error(error),
    });
  }

  openRequestsDetailsModal(publicationId: string): void {
    this.publicationId.set(publicationId);
    this.requestsDetailsModalIsOpen.set(true);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
