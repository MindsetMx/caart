import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AppService } from '@app/app.service';
import { ArtRequests } from '@dashboard/interfaces';
import { ArtRequestsService } from '@dashboard/services/art-requests.service';
import { InputDirective } from '@shared/directives';

@Component({
  selector: 'art-requests',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective
  ],
  templateUrl: './art-requests.component.html',
  styleUrl: './art-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRequestsComponent {
  artRequests = signal<ArtRequests>({} as ArtRequests);
  acceptPublicationRequestButtonIsDisabled = signal<boolean>(false);

  #artRequestsService = inject(ArtRequestsService);
  #appService = inject(AppService);

  constructor() {
    this.getArtRequests();
  }

  getArtRequests(): void {
    this.#artRequestsService.getArtRequests$().subscribe((response) => {
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

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
