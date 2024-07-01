import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppService } from '@app/app.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ReleaseArtForLiveAuctionService } from '@dashboard/services/release-art-for-live-auction.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { EditArtAuctionPreviewService } from '@app/dashboard/services/edit-art-auction-preview.service';

@Component({
  selector: 'edit-art-auction-preview-modal',
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
  templateUrl: './edit-art-auction-preview-modal.component.html',
  styleUrl: './edit-art-auction-preview-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditArtAuctionPreviewComponent {
  isOpen = model.required<boolean>();
  originalAuctionArtId = input.required<string>();

  artAuctionChanged = output<void>();

  editArtAuctionPreviewForm: FormGroup;
  editArtAuctionPreviewSubmitButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #editArtAuctionPreviewService = inject(EditArtAuctionPreviewService);
  #appService = inject(AppService);

  categoriesList: { name: string, value: string }[] = [
    // Pintura
    {
      name: "Pintura",
      value: "Pintura"
    },
    // Escultura
    {
      name: "Escultura",
      value: "Escultura"
    },
    // Fotografía,
    {
      name: "Fotografía",
      value: "Fotografía"
    },
    // Impresión
    {
      name: "Impresión",
      value: "Impresión"
    },
    // Dibujo o Collage en papel
    {
      name: "Dibujo o Collage en papel",
      value: "Dibujo o Collage en papel"
    },
    // Técnica mixta
    {
      name: "Técnica mixta",
      value: "Técnica mixta"
    },
    // Ceramica
    {
      name: "Ceramica",
      value: "Ceramica"
    },
    // Joyeria
    {
      name: "Joyeria",
      value: "Joyeria"
    },
    // Moda y Arte utilizable
    {
      name: "Moda y Arte utilizable",
      value: "Moda y Arte utilizable"
    },
    // Arte decorativo
    {
      name: "Arte decorativo",
      value: "Arte decorativo"
    },
  ];

  originalAuctionArtIdEffect = effect(() => {
    this.editArtAuctionPreviewForm.reset();
    if (this.isOpen()) {
      this.originalAuctionArtIdControl.setValue(this.originalAuctionArtId());
      this.getArtAuctionPreview();
    }
  });

  get isWithReserveControl(): FormControl {
    return this.editArtAuctionPreviewForm.get('isWithReserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.editArtAuctionPreviewForm.get('reserveAmount') as FormControl;
  }

  get originalAuctionArtIdControl(): FormControl {
    return this.editArtAuctionPreviewForm.get('originalAuctionArtId') as FormControl;
  }

  constructor() {
    this.editArtAuctionPreviewForm = this.#formBuilder.group({
      originalAuctionArtId: ['', Validators.required],
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

  editArtAuctionPreview(): void {
    this.editArtAuctionPreviewSubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.editArtAuctionPreviewForm);

    if (!isValid) {
      this.editArtAuctionPreviewSubmitButtonIsDisabled.set(false);
      return;
    }

    this.#editArtAuctionPreviewService.editArtAuctionPreview$(this.editArtAuctionPreviewForm).subscribe({
      next: (response) => {
        this.editArtAuctionPreviewForm.reset();
        this.isOpen.set(false);
        this.artAuctionChanged.emit();

        this.toastSuccess('La subasta se ha actualizado correctamente');
      },
      error: (error) => {
        console.error(error.error.error.error);

        this.toastError(error.error.error.error);
      }
    }).add(() => {
      this.editArtAuctionPreviewSubmitButtonIsDisabled.set(false);
    });
  }

  getArtAuctionPreview(): void {
    this.#editArtAuctionPreviewService.getArtAuctionPreview$(this.originalAuctionArtIdControl.value).subscribe({
      next: (response) => {
        this.editArtAuctionPreviewForm.patchValue({
          originalAuctionArtId: response.data.attributes.originalAuctionArtId,
          title: response.data.attributes.title,
          daysActive: response.data.attributes.daysActive,
          premium: response.data.attributes.premium,
          categories: response.data.attributes.categories,
          reserveAmount: response.data.attributes.reserveAmount,
          isWithReserve: response.data.attributes.isWithReserve,
          startingBid: response.data.attributes.startingBid,
        });
      },
      error: (error) => {
        console.error(error.error.error.error);

        this.toastError(error.error.error.error);
      }
    });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.editArtAuctionPreviewForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.editArtAuctionPreviewForm) return undefined;

    return this.#validatorsService.getError(this.editArtAuctionPreviewForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
