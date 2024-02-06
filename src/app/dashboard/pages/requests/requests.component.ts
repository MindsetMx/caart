import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { AuctionService } from '@app/auctions/services/auction.service';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { PublicationRequestsData } from '@app/auctions/interfaces/publication-requests';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
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

  ngOnInit(): void {
    this.getPublicationRequests();
  }

  getPublicationRequests(): void {
    this.#auctionService.getPublicationRequests$().subscribe((response) => {
      console.log(response.data);
      this.publicationRequests.set(response.data);
    });
  }

  acceptPublicationRequest(id: string): void {
    this.acceptPublicationRequestButtonIsDisabled.set(true);

    this.#auctionService.acceptPublicationRequest$(id).subscribe({
      next: (response) => {
        console.log(response);
        this.getPublicationRequests();
        this.toastSuccess('Solicitud aceptada');
      },
      error: (error) => {
        console.log(error);
      }
    }).add(() => {
      this.acceptPublicationRequestButtonIsDisabled.set(false);
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
