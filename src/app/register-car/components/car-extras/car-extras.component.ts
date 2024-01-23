import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { Router } from '@angular/router';

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

  carExtrasForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  constructor() {
    this.carExtrasForm = this.#fb.group({
      serviceHistory: ['', Validators.required],
      toolBox: ['', Validators.required],
      carCover: ['', Validators.required],
      batteryCharger: ['', Validators.required],
      manuals: ['', Validators.required],
      spareTire: ['', Validators.required],
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

    console.log({ isValid });
    console.log({ carExtrasForm: this.carExtrasForm.value });

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeCarRegistrationService.saveCarExtras$(this.carExtrasForm).subscribe({
      next: () => {
        this.#router.navigate(['/registro-exitoso-auto']);
      },
      error: (error) => {
        console.log(error);
      },
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
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
