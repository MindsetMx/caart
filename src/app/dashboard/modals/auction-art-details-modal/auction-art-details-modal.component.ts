import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { ArtWizard } from '@dashboard/interfaces';

import { ArtWizardService } from '@dashboard/services/art-wizard.service';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'auction-art-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    // MatTabsModule
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

  #artWizardService = inject(ArtWizardService);

  auctionCarIdEffect = effect(() => {
    if (this.auctionArtId()) {
      this.#artWizardService.getArtWizardData$(this.auctionArtId()).subscribe({
        next: (response) => {
          this.wizardData.set(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  });

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }
}
