import { ChangeDetectionStrategy, Component, effect, inject, input, model, output, signal } from '@angular/core';
import { WizardData } from '@dashboard/interfaces/wizard-data';
import { WizardDataService } from '@dashboard/services/wizard-data.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { tap } from 'rxjs';
import { UserDetails } from '@dashboard/interfaces';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { UpdateAuctionCarDetailsDataService } from '@dashboard/services/update-auction-car-details-data.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AuctionCarExteriorDetailsComponent } from '@dashboard/components/auction-car-exterior-details/auction-car-exterior-details.component';

@Component({
  selector: 'auction-car-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule,
    CommonModule,
    AuctionCarExteriorDetailsComponent
  ],
  templateUrl: './auction-car-details-modal.component.html',
  styleUrl: './auction-car-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarDetailsModalComponent {
  isOpen = model.required<boolean>();
  auctionCarId = input.required<string>();

  wizardData = signal<WizardData>({} as WizardData);
  userDetails = signal<UserDetails>({} as UserDetails);

  #wizardDataService = inject(WizardDataService);
  #sanitizer = inject(DomSanitizer);

  auctionCarIdAndIsOpenEffect = effect(() => {
    if (this.auctionCarId() && this.isOpen()) {
      this.#wizardDataService.getWizardData$(this.auctionCarId()).pipe(
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
    this.#wizardDataService.getUserDetails$(this.auctionCarId()).subscribe({
      next: (response) => {
        this.userDetails.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
