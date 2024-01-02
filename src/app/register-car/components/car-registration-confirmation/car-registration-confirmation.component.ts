import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-car-registration-confirmation',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    RouterLink,
    SpinnerComponent,
  ],
  templateUrl: './car-registration-confirmation.component.html',
  styleUrl: './car-registration-confirmation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarRegistrationConfirmationComponent {
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);

  confirmationForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImagesCarDetails: WritableSignal<string[]> = signal(['', '']);
  previewImagesCarExterior: WritableSignal<string[]> = signal(['', '']);

  constructor() {
    this.confirmationForm = this.#fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      streetAndExternalAndInternalNumber: ['', [Validators.required]],
    });
  }

  confirmationFormSubmit(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.confirmationForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.confirmationForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.confirmationForm) return undefined;

    return this.#validatorsService.getError(this.confirmationForm, field);
  }
}
