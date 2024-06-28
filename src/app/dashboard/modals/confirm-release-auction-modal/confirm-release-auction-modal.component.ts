import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'confirm-release-auction-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    InputErrorComponent,
    InputDirective
  ],
  templateUrl: './confirm-release-auction-modal.component.html',
  styleUrl: './confirm-release-auction-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmReleaseAuctionModalComponent {
  isOpen = model.required<boolean>();
  confirmReleaseChange = output<{ startDate: string; endDate: string }>();
  isButtonSubmitDisabled = model.required<boolean>();

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);

  releaseAuctionForm: FormGroup;

  constructor() {
    this.releaseAuctionForm = this.#formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  confirmRelease(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.releaseAuctionForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.confirmReleaseChange.emit({
      startDate: this.releaseAuctionForm.value.startDate,
      endDate: this.releaseAuctionForm.value.endDate
    });
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  hasError(field: string, form: FormGroup = this.releaseAuctionForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.releaseAuctionForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }
}
