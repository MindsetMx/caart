import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from '@app/app.service';
import { WizardData } from '@app/dashboard/interfaces/wizard-data';
import { UpdateAuctionCarDetailsDataService } from '@app/dashboard/services/update-auction-car-details-data.service';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'auction-car-interior-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
    NgxMaskDirective,
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

  interiorOfTheCarForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);

  constructor() {
    this.interiorOfTheCarForm = this.#formBuilder.group({
      interiorColor: [{ value: '' }, [Validators.required]],
      material: ['', [Validators.required]],
      interiorDetails: ['', [Validators.required]],
      interiorPhotos: [[], [Validators.required]],
      interiorVideos: [[]],
      originalAuctionCarId: ['', [Validators.required]],
    });

    Fancybox.bind("[data-fancybox='interiorPhotos']", { Hash: false });
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.interiorOfTheCarForm.reset();

      const interiorDetails = this.wizardData().data.interiorDetails;
      this.interiorOfTheCarForm.patchValue({
        interiorColor: interiorDetails.interiorColor,
        material: interiorDetails.material,
        interiorDetails: interiorDetails.interiorDetails,
        interiorPhotos: interiorDetails.interiorPhotos,
        interiorVideos: interiorDetails.interiorVideos,
        originalAuctionCarId: this.auctionCarId(),
      });
    }
  });

  updateInteriorDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.interiorOfTheCarForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionCarDetailsDataService.updateInteriorDetails$(this.auctionCarId(), this.interiorOfTheCarForm).subscribe({
      next: () => {
        this.toastSuccess('Detalles del interior del coche actualizados correctamente');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.interiorOfTheCarForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.interiorOfTheCarForm) return undefined;

    return this.#validatorsService.getError(this.interiorOfTheCarForm, field);
  }
}
