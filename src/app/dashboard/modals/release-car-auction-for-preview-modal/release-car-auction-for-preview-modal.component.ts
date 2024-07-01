import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, computed } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AppService } from '@app/app.service';
import { CopyAuctionPreviewLinkModalComponent } from '@dashboard/modals/copy-auction-preview-link-modal/copy-auction-preview-link-modal.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ReleaseCarForLiveAuctionService } from '../../services/release-car-for-live-auction.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'release-car-auction-for-preview-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    InputErrorComponent,
    InputDirective,
    MatFormFieldModule,
    MatSelectModule,
    PrimaryButtonDirective,
    SpinnerComponent,
    CopyAuctionPreviewLinkModalComponent,
    NgxMaskDirective,
  ],
  templateUrl: './release-car-auction-for-preview-modal.component.html',
  styleUrl: './release-car-auction-for-preview-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseCarAuctionForPreviewModalComponent {
  isOpen = input.required<boolean>();
  originalAuctionCarId = input.required<string>();
  isOpenChange = output<boolean>();
  carReleaseForLiveAuction = output<void>();
  isWithReserve = signal<boolean>(false);
  reserveAmount = signal<number>(0);

  fullAuctionPreviewLink = computed(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/subasta/${this.originalAuctionCarId()}`;
  });

  releaseCarForLiveAuctionForm: FormGroup;
  releaseCarForLiveAuctionSubmitButtonIsDisabled = signal<boolean>(false);
  copyAuctionPreviewLinkModalIsOpen = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #releaseCarForLiveAuctionService = inject(ReleaseCarForLiveAuctionService);
  #appService = inject(AppService);

  categoriesList: { name: string; value: string }[] = [
    { name: 'Automóviles', value: 'Automóviles' },
    { name: 'Motos', value: 'Motos' },
    { name: 'Eléctricos', value: 'Eléctricos' },
    { name: 'Proyectos', value: 'Proyectos' },
    { name: 'Autopartes', value: 'Autopartes' },
    { name: 'Rines', value: 'Rines' },
  ];

  originalAuctionCarIdEffect = effect(() => {
    this.releaseCarForLiveAuctionForm.reset();
    if (this.isOpen()) {
      this.originalAuctionCarIdControl.setValue(this.originalAuctionCarId());
      this.getTentativeTitle();
    }
  });

  isWithReserveEffect = effect(() => {
    this.isWithReserveControl.setValue(this.isWithReserve());
  });

  get originalAuctionCarIdControl(): FormControl {
    return this.releaseCarForLiveAuctionForm.get('originalAuctionCarId') as FormControl;
  }

  get isWithReserveControl(): FormControl {
    return this.releaseCarForLiveAuctionForm.get('isWithReserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.releaseCarForLiveAuctionForm.get('reserveAmount') as FormControl;
  }

  constructor() {
    this.releaseCarForLiveAuctionForm = this.#formBuilder.group({
      originalAuctionCarId: ['', Validators.required],
      title: ['', Validators.required],
      daysActive: ['', Validators.required],
      premium: ['', Validators.required],
      categories: [[], Validators.required],
      reserveAmount: ['', Validators.required],
      isWithReserve: ['', Validators.required],
      startingBid: ['', Validators.required],
    });

    this.isWithReserveControl.valueChanges.
      pipe(
        takeUntilDestroyed()
      ).subscribe((value) => {
        this.isWithReserve.set(value);

        if (value === true) {
          this.reserveAmountControl.setValue(this.reserveAmount());
          this.reserveAmountControl.setValidators([Validators.required]);
        } else {
          this.reserveAmountControl.setValue('');
          this.reserveAmountControl.clearValidators();
        }

        this.reserveAmountControl.updateValueAndValidity();
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

    this.#releaseCarForLiveAuctionService.releaseCarForPreview$(this.releaseCarForLiveAuctionForm).subscribe({
      next: (response) => {
        this.releaseCarForLiveAuctionForm.reset();
        this.emitIsOpenChange(false);
        this.carReleaseForLiveAuction.emit();

        this.toastSuccess('Auto liberado para vista previa');

        this.copyAuctionPreviewLinkModalIsOpen.set(true);
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
        this.releaseCarForLiveAuctionForm.patchValue({ reserveAmount: tentativeTitle.data.attributes.reserveAmount });
        this.reserveAmount.set(tentativeTitle.data.attributes.reserveAmount);
        this.releaseCarForLiveAuctionForm.patchValue({ isWithReserve: tentativeTitle.data.attributes.reserve });
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
