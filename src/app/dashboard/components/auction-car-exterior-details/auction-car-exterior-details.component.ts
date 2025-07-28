import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Fancybox } from '@fancyapps/ui';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { UpdateAuctionCarDetailsDataService } from '@dashboard/services/update-auction-car-details-data.service';
import { ValidatorsService } from '@shared/services/validators.service';
import { WizardData } from '@dashboard/interfaces/wizard-data';
import { NgxMaskDirective } from 'ngx-mask';
import { AppService } from '@app/app.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'auction-car-exterior-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
    NgxMaskDirective,
  ],
  templateUrl: './auction-car-exterior-details.component.html',
  styleUrl: './auction-car-exterior-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarExteriorDetailsComponent {
  wizardData = input.required<WizardData>();
  auctionCarId = input.required<string>();

  #sanitizer = inject(DomSanitizer);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #appService = inject(AppService);

  exteriorForm: FormGroup;
  isButtonSubmitDisabled = signal<boolean>(false);

  constructor() {
    this.exteriorForm = this.#formBuilder.group({
      carHistory: ['', [Validators.required]],
      exteriorPhotos: [[], [Validators.required]],
      exteriorVideos: [[]],
      invoiceDetails: ['', [Validators.required]],
      invoiceType: ['', [Validators.required]],
      originalAuctionCarId: ['', [Validators.required]],
    });

    // Initialize Fancybox for photo galleries
    Fancybox.bind("[data-fancybox='exteriorPhotosGallery']", { Hash: false });
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.exteriorForm.reset();

      const exteriorDetails = this.wizardData().data.exteriorDetails;
      this.exteriorForm.patchValue({
        carHistory: exteriorDetails.carHistory,
        exteriorPhotos: exteriorDetails.exteriorPhotos,
        exteriorVideos: exteriorDetails.exteriorVideos,
        invoiceDetails: exteriorDetails.invoiceDetails,
        invoiceType: exteriorDetails.invoiceType,
        originalAuctionCarId: exteriorDetails.originalAuctionCarId,
      });
    }
  });

  updateExteriorDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.exteriorForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionCarDetailsDataService.updateExteriorDetails$(this.auctionCarId(), this.exteriorForm).subscribe({
      next: () => {
        this.toastSuccess('Detalles de exterior actualizados correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  hasError(field: string): boolean {
    const control = this.exteriorForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getError(field: string): string | undefined {
    const control = this.exteriorForm.get(field);
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
