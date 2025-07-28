import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Fancybox } from '@fancyapps/ui';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { UpdateAuctionCarDetailsDataService } from '@dashboard/services/update-auction-car-details-data.service';
import { ValidatorsService } from '@shared/services/validators.service';
import { WizardData } from '@dashboard/interfaces/wizard-data';
import { AppService } from '@app/app.service';

@Component({
  selector: 'auction-car-interior-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
  ],
  templateUrl: './auction-car-interior-details.component.html',
  styleUrl: './auction-car-interior-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarInteriorDetailsComponent {
  wizardData = input.required<WizardData>();
  auctionCarId = input.required<string>();

  #sanitizer = inject(DomSanitizer);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #appService = inject(AppService);

  interiorForm: FormGroup;
  isButtonSubmitDisabled = signal<boolean>(false);

  constructor() {
    this.interiorForm = this.#formBuilder.group({
      interiorColor: ['', [Validators.required]],
      material: ['', [Validators.required]],
      interiorDetails: ['', [Validators.required]],
      interiorPhotos: [[], [Validators.required]],
      interiorVideos: [[]],
      originalAuctionCarId: ['', [Validators.required]],
    });

    // Initialize Fancybox for photo galleries
    Fancybox.bind("[data-fancybox='interiorPhotosGallery']", { Hash: false });
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.interiorForm.reset();

      const interiorDetails = this.wizardData().data.interiorDetails;
      this.interiorForm.patchValue({
        interiorColor: interiorDetails.interiorColor,
        material: interiorDetails.material,
        interiorDetails: interiorDetails.interiorDetails,
        interiorPhotos: interiorDetails.interiorPhotos,
        interiorVideos: interiorDetails.interiorVideos,
        originalAuctionCarId: interiorDetails.originalAuctionCarId,
      });
    }
  });

  updateInteriorDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.interiorForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionCarDetailsDataService.updateInteriorDetails$(this.auctionCarId(), this.interiorForm).subscribe({
      next: () => {
        this.toastSuccess('Detalles del interior actualizados correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  hasError(field: string): boolean {
    const control = this.interiorForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getError(field: string): string | undefined {
    const control = this.interiorForm.get(field);
    if (control && control.errors) {
      const errors = control.errors;
      if (errors['required']) {
        return 'Este campo es requerido';
      }
    }
    return undefined;
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
