import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, model, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { DomSanitizer } from '@angular/platform-browser';
import { AppService } from '@app/app.service';
import { WizardData } from '@app/dashboard/interfaces/wizard-data';
import { UpdateAuctionCarDetailsDataService } from '@app/dashboard/services/update-auction-car-details-data.service';
import { ValidatorsService } from '@shared/services/validators.service';
import { bothOrNoneValidator } from '@shared/validations';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'auction-car-extra-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
    NgxMaskDirective,
    MatIcon,
  ],
  templateUrl: './auction-car-extra-details.component.html',
  styleUrl: './auction-car-extra-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarExtraDetailsComponent {
  wizardData = input.required<WizardData>();
  auctionCarId = input.required<string>();

  #sanitizer = inject(DomSanitizer);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #appService = inject(AppService);
  #changeDetectorRef = inject(ChangeDetectorRef);

  carExtrasForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);

  get additionalChargesFormArray(): FormArray {
    return this.carExtrasForm.get('additionalCharges') as FormArray;
  }

  get additionalChargesFormArrayControls(): FormGroup[] {
    return this.additionalChargesFormArray.controls as FormGroup[];
  }

  constructor() {
    this.carExtrasForm = this.#formBuilder.group({
      // serviceHistory: ['', Validators.required],
      toolBox: ['', Validators.required],
      carCover: ['', Validators.required],
      batteryCharger: ['', Validators.required],
      manuals: ['', Validators.required],
      // spareTire: ['', Validators.required],
      tireInflator: ['', Validators.required],
      numberOfKeys: ['', Validators.required],
      others: ['', Validators.required],
      additionalCharges: this.#formBuilder.array([]),
      comments: ['', Validators.required],
      termsConditionsAccepted: ['', Validators.required],
      originalAuctionCarId: ['', Validators.required],
    });
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.carExtrasForm.reset();
      this.additionalChargesFormArray.clear();

      const extraDetails = this.wizardData().data.extrasDetails;
      this.carExtrasForm.patchValue({
        toolBox: extraDetails.toolBox,
        carCover: extraDetails.carCover,
        batteryCharger: extraDetails.batteryCharger,
        manuals: extraDetails.manuals,
        tireInflator: extraDetails.tireInflator,
        numberOfKeys: extraDetails.numberOfKeys,
        others: extraDetails.others,
        comments: extraDetails.comments,
        termsConditionsAccepted: extraDetails.termsConditionsAccepted,
        originalAuctionCarId: extraDetails.originalAuctionCarId,
      });

      extraDetails.additionalCharges.forEach((charge) => {
        const nuevoCredito = this.#formBuilder.group({
          chargeType: charge.chargeType,
          amount: charge.amount,
        }, { validators: bothOrNoneValidator() });

        this.additionalChargesFormArray.push(nuevoCredito);
      });

      this.#changeDetectorRef.detectChanges();
    }
  });

  updateExtrasDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carExtrasForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionCarDetailsDataService.updateExtrasDetails$(this.auctionCarId(), this.carExtrasForm).subscribe({
      next: () => {
        this.toastSuccess('Detalles adicionales del coche actualizados correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });

  }

  addAdditionalCharge(): void {
    const nuevoCredito = this.#formBuilder.group({
      chargeType: [''],
      amount: [''],
    }, { validators: bothOrNoneValidator() });

    this.additionalChargesFormArray.push(nuevoCredito);
  }

  removeAdditionalCharge(index: number): void {
    this.additionalChargesFormArray.removeAt(index);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  hasError(field: string, formGroup: FormGroup = this.carExtrasForm): boolean {
    return this.#validatorsService.hasError(formGroup, field);
  }

  getError(field: string, formGroup: FormGroup = this.carExtrasForm): string | undefined {
    return this.#validatorsService.getError(formGroup, field);
  }

  formArrayHasError(formArray: FormArray = this.additionalChargesFormArray, index: number): boolean {
    return this.#validatorsService.formArrayHasError(formArray, index);
  }

  getErrorFromFormArray(index: number): string | undefined {
    return this.#validatorsService.getErrorFromFormArray(this.additionalChargesFormArray, index);
  }
}
