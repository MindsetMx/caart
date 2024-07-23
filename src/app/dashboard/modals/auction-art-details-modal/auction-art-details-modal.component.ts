import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ArtWizard, UserDetails } from '@dashboard/interfaces';

import { ArtWizardService } from '@dashboard/services/art-wizard.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { tap } from 'rxjs';

@Component({
  selector: 'auction-art-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule,
    CommonModule,
    CurrencyPipe,
  ],
  templateUrl: './auction-art-details-modal.component.html',
  styleUrl: './auction-art-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionArtDetailsModalComponent {
  isOpen = input.required<boolean>();
  auctionArtId = input.required<string>();
  isOpenChange = output<boolean>();

  wizardData = signal<ArtWizard>({} as ArtWizard);
  userDetails = signal<UserDetails>({} as UserDetails);

  #artWizardService = inject(ArtWizardService);
  #sanitizer = inject(DomSanitizer);

  auctionCarIdEffect = effect(() => {
    if (this.auctionArtId() && this.isOpen()) {
      this.#artWizardService.getArtWizardData$(this.auctionArtId()).pipe(
        tap(() => this.getUserDetails())
      ).subscribe({
        next: (response) => {
          this.wizardData.set(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  });

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  getUserDetails(): void {
    this.#artWizardService.getUserDetails$(this.auctionArtId()).subscribe({
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
