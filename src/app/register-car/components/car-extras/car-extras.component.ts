import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, WritableSignal, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { Router } from '@angular/router';
import { DecimalPipe, JsonPipe } from '@angular/common';
import { InputFormatterDirective } from '@shared/directives/input-formatter.directive';

@Component({
  selector: 'app-car-extras',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    DecimalPipe,
    InputFormatterDirective,
    JsonPipe
  ],
  templateUrl: './car-extras.component.html',
  styleUrl: './car-extras.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarExtrasComponent {
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);
  #router = inject(Router);
  #changeDetectorRef = inject(ChangeDetectorRef);

  carExtrasForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  originalAuctionCarIdChangedEffect = effect(() => {
    this.getCarExtras();
  });

  constructor() {
    this.carExtrasForm = this.#fb.group({
      // serviceHistory: ['', Validators.required],
      toolBox: ['', Validators.required],
      carCover: ['', Validators.required],
      batteryCharger: ['', Validators.required],
      manuals: ['', Validators.required],
      // spareTire: ['', Validators.required],
      tireInflator: ['', Validators.required],
      numberOfKeys: ['', Validators.required],
      others: ['', Validators.required],
      additionalCharges: this.#fb.array(
        [
          this.#fb.group({
            chargeType: ['', Validators.required],
            amount: ['', Validators.required],
          },
            {
              validators: Validators.required,
            }
          )
        ]
        ,
        {
          validators: Validators.required,
        }
      ),
      comments: ['', Validators.required],
      termsConditionsAccepted: ['', Validators.required],
      originalAuctionCarId: [this.originalAuctionCarId, Validators.required],
    });
  }

  get originalAuctionCarId(): string {
    return this.#completeCarRegistrationService.originalAuctionCarId();
  }

  get additionalChargesFormArray(): FormArray {
    return this.carExtrasForm.get('additionalCharges') as FormArray;
  }

  get additionalChargesFormArrayControls(): FormGroup[] {
    return this.additionalChargesFormArray.controls as FormGroup[];
  }

  carExtrasFormSubmit(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carExtrasForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeCarRegistrationService.saveCarExtras$(this.carExtrasForm).subscribe({
      next: () => {
        this.#router.navigate(['/registro-exitoso-auto']);
      },
      error: (error) => console.error(error),
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getCarExtras(): void {
    this.#completeCarRegistrationService.getCarExtras$(this.originalAuctionCarId).subscribe({
      next: (carExtras) => {
        const {
          toolBox,
          carCover,
          batteryCharger,
          manuals,
          tireInflator,
          numberOfKeys,
          others,
          // additionalCharges,
          comments,
          termsConditionsAccepted,
        } = carExtras.data.attributes;

        this.carExtrasForm.patchValue({
          toolBox,
          carCover,
          batteryCharger,
          manuals,
          tireInflator,
          numberOfKeys,
          others,
          // additionalCharges,
          comments,
          termsConditionsAccepted,
        });


        const additionalCharges = carExtras.data.attributes.additionalCharges;

        const aditionalChargesFormGroups = additionalCharges.map((additionalCharge: any) => {
          return this.#fb.group({
            chargeType: [additionalCharge.chargeType, Validators.required],
            amount: [additionalCharge.amount, Validators.required],
          });
        });

        this.carExtrasForm.setControl('additionalCharges', this.#fb.array(aditionalChargesFormGroups));
        this.#changeDetectorRef.detectChanges();
      },
      error: (error) => console.error(error),
    });
  }

  addAdditionalCharge(): void {
    const nuevoCredito = this.#fb.group({
      chargeType: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this.additionalChargesFormArray.push(nuevoCredito);
  }

  hasError(field: string, formGroup: FormGroup = this.carExtrasForm): boolean {
    return this.#validatorsService.hasError(formGroup, field);
  }

  getError(field: string, formGroup: FormGroup = this.carExtrasForm): string | undefined {
    return this.#validatorsService.getError(formGroup, field);
  }
}
