import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';

import { AppService } from '@app/app.service';
import { AuctionService } from '@auctions/services/auction.service';
import { InputDirective } from '@shared/directives';
import { PublicationRequests, PublicationRequestsData, PublicationRequestsStatus } from '@auctions/interfaces/publication-requests';
import { RequestsDetailsModalComponent } from '@dashboard/modals/requests-details-modal/requests-details-modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'vehicle-requests',
  standalone: true,
  imports: [
    RequestsDetailsModalComponent,
    InputDirective,
    MatPaginatorModule,
  ],
  templateUrl: './vehicle-requests.component.html',
  styleUrl: './vehicle-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleRequestsComponent {
  page = model.required<number>();
  size = model.required<number>();
  pageSizeOptions = signal<number[]>([]);
  publicationRequests = signal<PublicationRequests>({} as PublicationRequests);
  acceptPublicationRequestButtonIsDisabled = signal<boolean>(false);
  requestsDetailsModalIsOpen = signal<boolean>(false);
  publicationId = signal<string>('');
  publicationRequestsStatus = PublicationRequestsStatus;

  #auctionService = inject(AuctionService);
  #appService = inject(AppService);
  #router = inject(Router);

  getPublicationRequestsEffect = effect(() => {
    if (this.page() && this.size()) {
      this.getPublicationRequests();
    }
  });

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

  onPageChange(event: any): void {
    this.page.set(event.pageIndex + 1);
    this.size.set(event.pageSize);

    this.#router.navigate([], {
      queryParams: {
        page1: this.page(),
        size1: this.size()
      },
      queryParamsHandling: 'merge',
    });
  }

  getPublicationRequests(): void {
    this.#auctionService.getAllAuctionCars$(this.page(), this.size()).subscribe((response) => {
      this.publicationRequests.set(response);

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
