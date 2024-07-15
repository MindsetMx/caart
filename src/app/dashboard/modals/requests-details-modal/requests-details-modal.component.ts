import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { AuctionDetails, UserDetails } from '@dashboard/interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '@dashboard/services/requests-details.service';
import { tap } from 'rxjs';

@Component({
  selector: 'requests-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule
  ],
  templateUrl: './requests-details-modal.component.html',
  styleUrl: './requests-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsDetailsModalComponent {
  isOpen = input.required<boolean>();
  isOpenChange = output<boolean>();
  publicationId = input.required<string>();

  auction = signal<AuctionDetails>({} as AuctionDetails);
  userDetails = signal<UserDetails>({} as UserDetails);

  #requestsDetailsService = inject(RequestsDetailsService);

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      this.#requestsDetailsService.getAuctionCarById$(this.publicationId()).pipe(
        tap(() => this.getUserDetails())
      ).subscribe((response) => {
        this.auction.set(response);
      });
    }
  });

  getUserDetails(): void {
    this.#requestsDetailsService.getUserDetails$(this.publicationId()).subscribe({
      next: (response) => {
        this.userDetails.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }
}
