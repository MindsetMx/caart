import { ChangeDetectionStrategy, Component, WritableSignal, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { AutoResizeTextareaDirective } from '@shared/directives/auto-resize-textarea.directive';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { Router } from '@angular/router';

import { UserData } from '@auth/interfaces';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'car-extras',
  standalone: true,
  imports: [
    AutoResizeTextareaDirective,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent
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
  #authService = inject(AuthService);

  carExtrasForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);

  originalAuctionCarIdChangedEffect = effect(() => {
    this.getCarExtras();
  });

  constructor() {
    this.carExtrasForm = this.#fb.group({
      comments: ['', Validators.required],
      termsConditionsAccepted: [false, Validators.requiredTrue],
      originalAuctionCarId: [this.originalAuctionCarId, Validators.required],
    });
  }

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get originalAuctionCarId(): string {
    return this.#completeCarRegistrationService.originalAuctionCarId();
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
        this.#router.navigate(['/registro-completado'], { replaceUrl: true });
      },
      error: (error) => console.error(error),
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getCarExtras(): void {
    this.#completeCarRegistrationService.getCarExtras$(this.originalAuctionCarId).subscribe({
      next: (carExtras) => {
        let { comments, termsConditionsAccepted } = carExtras.data.attributes;

        const emails = [
          'fernandovelaz96@gmail.com',
          'jansmithers30@gmail.com',
          'rafaelmaggio@gmail.com',
          'luisenrique.lopez01@gmail.com',
        ];

        if (this.user && emails.includes(this.user.attributes.email)) {
          comments = 'Comentarios';
          termsConditionsAccepted = true;
        }

        this.carExtrasForm.patchValue({ comments, termsConditionsAccepted });
        // TODO:eliminar cuando ya no se necesite
      },
      error: (error) => console.error(error),
    });
  }

  hasError(field: string, formGroup: FormGroup = this.carExtrasForm): boolean {
    return this.#validatorsService.hasError(formGroup, field);
  }

  getError(field: string, formGroup: FormGroup = this.carExtrasForm): string | undefined {
    return this.#validatorsService.getError(formGroup, field);
  }

}
