import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, computed, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppService } from '@app/app.service';
import { EditCarAuctionPreviewService } from '@dashboard/services/edit-car-auction-preview.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'edit-car-auction-preview-modal',
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
    NgxMaskDirective,
  ],
  templateUrl: './edit-car-auction-preview-modal.component.html',
  styleUrl: './edit-car-auction-preview-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCarAuctionPreviewModalComponent {
  isOpen = model.required<boolean>();
  originalAuctionCarId = input.required<string>();

  carAuctionChanged = output<void>();

  editCarAuctionPreviewForm: FormGroup;
  editCarAuctionPreviewSubmitButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #editCarAuctionPreviewService = inject(EditCarAuctionPreviewService);
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
    this.editCarAuctionPreviewForm.reset();
    if (this.isOpen()) {
      this.originalAuctionCarIdControl.setValue(this.originalAuctionCarId());
      this.getCarAuctionPreview();
    }
  });

  get originalAuctionCarIdControl(): FormControl {
    return this.editCarAuctionPreviewForm.get('originalAuctionCarId') as FormControl;
  }

  get isWithReserveControl(): FormControl {
    return this.editCarAuctionPreviewForm.get('isWithReserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.editCarAuctionPreviewForm.get('reserveAmount') as FormControl;
  }

  constructor() {
    this.editCarAuctionPreviewForm = this.#formBuilder.group({
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
        if (value === true) {
          this.reserveAmountControl.setValue(this.reserveAmountControl.value)
          this.reserveAmountControl.setValidators([Validators.required]);
        } else {
          this.reserveAmountControl.setValue('');
          this.reserveAmountControl.clearValidators();
        }

        this.reserveAmountControl.updateValueAndValidity();
      });
  }

  editCarAuctionPreview(): void {
    this.editCarAuctionPreviewSubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.editCarAuctionPreviewForm);

    if (!isValid) {
      this.editCarAuctionPreviewSubmitButtonIsDisabled.set(false);
      return;
    }

    this.#editCarAuctionPreviewService.editCarAuctionPreview$(this.editCarAuctionPreviewForm).subscribe({
      next: (response) => {
        this.editCarAuctionPreviewForm.reset();
        this.isOpen.set(false);
        this.carAuctionChanged.emit();

        this.toastSuccess('La subasta se ha actualizado correctamente');
      },
      error: (error) => {
        console.error(error.error.error.error);

        this.toastError(error.error.error.error);
      }
    }).add(() => {
      this.editCarAuctionPreviewSubmitButtonIsDisabled.set(false);
    });
  }

  getCarAuctionPreview(): void {
    this.#editCarAuctionPreviewService.getCarAuctionPreview$(this.originalAuctionCarId()).subscribe((carAuctionPreview) => {
      this.editCarAuctionPreviewForm.patchValue({
        originalAuctionCarId: carAuctionPreview.data.attributes.originalAuctionCarId,
        title: carAuctionPreview.data.attributes.title,
        daysActive: carAuctionPreview.data.attributes.daysActive,
        premium: carAuctionPreview.data.attributes.premium,
        categories: carAuctionPreview.data.attributes.categories,
        reserveAmount: carAuctionPreview.data.attributes.reserveAmount,
        isWithReserve: carAuctionPreview.data.attributes.isWithReserve,
        startingBid: carAuctionPreview.data.attributes.startingBid,
      });
    });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.editCarAuctionPreviewForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.editCarAuctionPreviewForm) return undefined;

    return this.#validatorsService.getError(this.editCarAuctionPreviewForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
