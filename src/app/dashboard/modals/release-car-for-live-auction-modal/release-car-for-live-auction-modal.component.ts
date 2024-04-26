import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { ReleaseCarForLiveAuctionService } from '../../services/release-car-for-live-auction.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { JsonPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AppService } from '@app/app.service';

@Component({
  selector: 'release-car-for-live-auction-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    InputErrorComponent,
    InputDirective,
    JsonPipe,
    MatFormFieldModule,
    MatSelectModule,
    PrimaryButtonDirective,
    SpinnerComponent
  ],
  templateUrl: './release-car-for-live-auction-modal.component.html',
  styleUrl: './release-car-for-live-auction-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseCarForLiveAuctionModalComponent {
  isOpen = input.required<boolean>();
  originalAuctionCarId = input.required<string>();
  isOpenChange = output<boolean>();
  carReleaseForLiveAuction = output<void>();

  releaseCarForLiveAuctionForm: FormGroup;
  releaseCarForLiveAuctionSubmitButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #releaseCarForLiveAuctionService = inject(ReleaseCarForLiveAuctionService);
  #appService = inject(AppService);

  categoriesList: { name: string, value: string }[] = [{ name: "Clásico", value: "classic" }, { name: "Eléctrico", value: "electric" }];

  originalAuctionCarIdEffect = effect(() => {
    this.releaseCarForLiveAuctionForm.reset();
    if (this.isOpen()) {
      this.originalAuctionCarIdControl.setValue(this.originalAuctionCarId());
      this.getTentativeTitle();
    }
  });

  get originalAuctionCarIdControl(): FormControl {
    return this.releaseCarForLiveAuctionForm.get('originalAuctionCarId') as FormControl;
  }

  constructor() {
    this.releaseCarForLiveAuctionForm = this.#formBuilder.group({
      originalAuctionCarId: ['', Validators.required],
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      premium: ['', Validators.required],
      categories: [[], Validators.required]
    });
  }

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }

  releaseCarForLiveAuction(): void {
    this.releaseCarForLiveAuctionSubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.releaseCarForLiveAuctionForm);

    if (!isValid) {
      this.releaseCarForLiveAuctionSubmitButtonIsDisabled.set(false);
      return;
    }

    this.#releaseCarForLiveAuctionService.releaseCarForLiveAuction$(this.releaseCarForLiveAuctionForm).subscribe({
      next: (response) => {
        this.releaseCarForLiveAuctionForm.reset();
        this.emitIsOpenChange(false);
        this.carReleaseForLiveAuction.emit();

        this.toastSuccess('Auto publicado en subasta en vivo');
      },
      error: (error) => {
        console.error(error.error.error.error);

        this.toastError(error.error.error.error);
      }
    }).add(() => {
      this.releaseCarForLiveAuctionSubmitButtonIsDisabled.set(false);
    });
  }

  getTentativeTitle(): void {
    this.#releaseCarForLiveAuctionService.getTentativeTitle$(this.originalAuctionCarIdControl.value).subscribe({
      next: (tentativeTitle) => {
        this.releaseCarForLiveAuctionForm.patchValue({ title: tentativeTitle.data.attributes.year + ' ' + tentativeTitle.data.attributes.brand + ' ' + tentativeTitle.data.attributes.carModel });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.releaseCarForLiveAuctionForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.releaseCarForLiveAuctionForm) return undefined;

    return this.#validatorsService.getError(this.releaseCarForLiveAuctionForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
