import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { AppService } from '@app/app.service';
import { WizardData } from '@app/dashboard/interfaces/wizard-data';
import { UpdateAuctionCarDetailsDataService } from '@app/dashboard/services/update-auction-car-details-data.service';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'auction-car-extra-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
  ],
  templateUrl: './auction-car-extra-details.component.html',
  styleUrl: './auction-car-extra-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarExtraDetailsComponent {
  wizardData = input.required<WizardData>();
  auctionCarId = input.required<string>();

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #appService = inject(AppService);

  carExtrasForm: FormGroup;
  isButtonSubmitDisabled = signal<boolean>(false);

  constructor() {
    this.carExtrasForm = this.#formBuilder.group({
      comments: ['', [Validators.required]],
      termsConditionsAccepted: [false, [Validators.requiredTrue]],
      originalAuctionCarId: ['', [Validators.required]],
    });
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.carExtrasForm.reset();

      const extraDetails = this.wizardData().data.extrasDetails;
      this.carExtrasForm.patchValue({
        comments: extraDetails.comments,
        termsConditionsAccepted: extraDetails.termsConditionsAccepted,
        originalAuctionCarId: extraDetails.originalAuctionCarId,
      });
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
        this.toastSuccess('Detalles adicionales actualizados correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  hasError(field: string): boolean {
    const control = this.carExtrasForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getError(field: string): string | undefined {
    const control = this.carExtrasForm.get(field);
    if (control && control.errors) {
      const errors = control.errors;
      if (errors['required']) {
        return 'Este campo es requerido';
      }
      if (errors['requiredTrue']) {
        return 'Debes aceptar los términos y condiciones';
      }
    }
    return undefined;
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
