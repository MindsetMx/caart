import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { WizardData } from '@dashboard/interfaces/wizard-data';
import { WizardDataService } from '@dashboard/services/wizard-data.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'auction-car-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule
  ],
  templateUrl: './auction-car-details-modal.component.html',
  styleUrl: './auction-car-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarDetailsModalComponent {
  isOpen = input.required<boolean>();
  auctionCarId = input.required<string>();
  isOpenChange = output<boolean>();

  wizardData = signal<WizardData>({} as WizardData);

  #wizardDataService = inject(WizardDataService);


  auctionCarIdEffect = effect(() => {
    if (this.auctionCarId()) {
      this.#wizardDataService.getWizardData$(this.auctionCarId()).subscribe({
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
