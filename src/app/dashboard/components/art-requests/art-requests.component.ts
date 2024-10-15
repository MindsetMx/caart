import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { AllAuctionArt, AllAuctionArtStatus } from '@dashboard/interfaces';
import { ArtRequestsDetailsModalComponent } from '@dashboard/modals/art-requests-details-modal/art-requests-details-modal.component';
import { ArtRequestsService } from '@dashboard/services/art-requests.service';
import { InputDirective } from '@shared/directives';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'art-requests',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    ArtRequestsDetailsModalComponent,
    MatPaginatorModule,
  ],
  templateUrl: './art-requests.component.html',
  styleUrl: './art-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRequestsComponent {
  #artRequestsService = inject(ArtRequestsService);
  #appService = inject(AppService);
  #router = inject(Router);

  page = model.required<number>();
  size = model.required<number>();
  pageSizeOptions = signal<number[]>([]);
  artRequests = signal<AllAuctionArt>({} as AllAuctionArt);
  acceptPublicationRequestButtonIsDisabled = signal<boolean>(false);
  publicationId = signal<string>('');
  requestsDetailsModalIsOpen = signal<boolean>(false);
  allAuctionArtStatus = AllAuctionArtStatus;

  getArtRequestsEffect = effect(() => {
    if (this.page() && this.size()) {
      this.getArtRequests();
    }
  });

  getArtRequests(): void {
    this.#artRequestsService.getAllAuctionArt$(this.page(), this.size()).subscribe(response => {
      this.artRequests.set(response);

      if (this.pageSizeOptions().length === 0)
        this.pageSizeOptions.set(this.calculatePageSizeOptions(response.meta.total));
    });
  }

  private calculatePageSizeOptions(totalItems: number): number[] {
    const pageSizeOptions = [];
    if (totalItems > 0) {
      for (let i = this.size(); i <= totalItems; i += this.size()) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
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

  onPageChange(event: any): void {
    this.page.set(event.pageIndex + 1);
    this.size.set(event.pageSize);

    this.#router.navigate([], {
      queryParams: {
        page2: this.page(),
        size2: this.size()
      },
      queryParamsHandling: 'merge',
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
