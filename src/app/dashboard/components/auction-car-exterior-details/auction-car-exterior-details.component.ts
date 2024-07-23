import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  isOpen = model.required<boolean>();
  auctionCarId = input.required<string>();

  #sanitizer = inject(DomSanitizer);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #appService = inject(AppService);

  exteriorForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);

  get transmissionTypeControl(): FormControl {
    return this.exteriorForm.get('transmissionType') as FormControl;
  }

  get warrantiesControl(): FormControl {
    return this.exteriorForm.get('warranties') as FormControl;
  }

  get wichWarrantiesControl(): FormControl {
    return this.exteriorForm.get('wichWarranties') as FormControl;
  }

  get otherTransmissionControl(): FormControl {
    return this.exteriorForm.get('otherTransmission') as FormControl;
  }

  constructor() {
    this.exteriorForm = this.#formBuilder.group({
      kmInput: [{ value: '' }],
      brand: [{ value: '' }, [Validators.required]],
      year: [{ value: '' }, [Validators.required, Validators.min(1500), Validators.max(this.currentYear)]],
      carModel: [{ value: '' }, [Validators.required]],
      // mileage: ['', [Validators.required]],
      odometerVerified: ['', [Validators.required]],
      transmissionType: [{ value: '' }, [Validators.required]],
      otherTransmission: [{ value: '' }],
      // sellerType: ['', [Validators.required]],
      VIN: ['', [Validators.required]],
      warranties: ['', [Validators.required]],
      wichWarranties: [''],
      invoiceType: ['', [Validators.required]],
      invoiceDetails: ['', [Validators.required]],
      carHistory: ['', [Validators.required]],
      exteriorColor: [{ value: '' }, [Validators.required]],
      specificColor: [{ value: '' }, [Validators.required]],
      accident: ['', [Validators.required]],
      raced: ['', [Validators.required]],
      originalPaint: ['', [Validators.required]],
      paintMeter: ['', [Validators.required]],
      exteriorModified: ['', [Validators.required]],
      exteriorCondition: ['', [Validators.required]],
      detailComments: ['', [Validators.required]],
      exteriorPhotos: [[], [Validators.required]],
      exteriorVideos: [[]],
      originalAuctionCarId: ['', [Validators.required]],
    });

    this.warrantiesControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe((value) => {
      if (value === 'true') {
        this.wichWarrantiesControl?.setValidators([Validators.required]);
      } else {
        this.wichWarrantiesControl?.clearValidators();
      }

      this.wichWarrantiesControl?.updateValueAndValidity();
    });

    this.transmissionTypeControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe((value) => {
      if (value === 'Otro') {
        this.otherTransmissionControl?.setValidators([Validators.required]);
      } else {
        this.otherTransmissionControl?.clearValidators();
      }

      this.otherTransmissionControl?.updateValueAndValidity();
    });
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.exteriorForm.reset();

      const exteriorDetails = this.wizardData().data.exteriorDetails;
      this.exteriorForm.patchValue({
        kmInput: exteriorDetails.kmInput,
        brand: exteriorDetails.brand,
        year: exteriorDetails.year,
        carModel: exteriorDetails.carModel,
        odometerVerified: exteriorDetails.odometerVerified,
        transmissionType: exteriorDetails.transmissionType,
        otherTransmission: exteriorDetails.otherTransmission,
        VIN: exteriorDetails.VIN,
        warranties: exteriorDetails.warranties,
        wichWarranties: exteriorDetails.wichWarranties,
        invoiceType: exteriorDetails.invoiceType,
        invoiceDetails: exteriorDetails.invoiceDetails,
        carHistory: exteriorDetails.carHistory,
        exteriorColor: exteriorDetails.exteriorColor,
        specificColor: exteriorDetails.specificColor,
        accident: exteriorDetails.accident,
        raced: exteriorDetails.raced,
        originalPaint: exteriorDetails.originalPaint,
        paintMeter: exteriorDetails.paintMeter,
        exteriorModified: exteriorDetails.exteriorModified,
        exteriorCondition: exteriorDetails.exteriorCondition,
        detailComments: exteriorDetails.detailComments,
        exteriorPhotos: exteriorDetails.exteriorPhotos,
        exteriorVideos: exteriorDetails.exteriorVideos,
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

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.exteriorForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.exteriorForm) return undefined;

    return this.#validatorsService.getError(this.exteriorForm, field);
  }
}
