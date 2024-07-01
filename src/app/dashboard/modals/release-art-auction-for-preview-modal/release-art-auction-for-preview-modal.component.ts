import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from '@app/app.service';
import { ReleaseArtForLiveAuctionService } from '@dashboard/services/release-art-for-live-auction.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';
import { CopyAuctionPreviewLinkModalComponent } from '@dashboard/modals/copy-auction-preview-link-modal/copy-auction-preview-link-modal.component';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'release-art-auction-for-preview-modal',
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
  templateUrl: './release-art-auction-for-preview-modal.component.html',
  styleUrl: './release-art-auction-for-preview-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseArtAuctionForPreviewModalComponent {
  isOpen = input.required<boolean>();
  originalAuctionArtId = input.required<string>();
  isOpenChange = output<boolean>();
  artReleaseForLiveAuction = output<void>();
  copyAuctionPreviewLinkModalIsOpen = signal<boolean>(false);
  isWithReserve = signal<boolean>(false);
  reserveAmount = signal<number>(0);

  fullAuctionPreviewLink = computed(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/subasta-arte/${this.originalAuctionArtId()}`;
  });

  releaseArtForLiveAuctionForm: FormGroup;
  releaseArtForLiveAuctionSubmitButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #releaseArtForLiveAuctionService = inject(ReleaseArtForLiveAuctionService);
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
    this.releaseArtForLiveAuctionForm.reset();
    if (this.isOpen()) {
      this.originalAuctionArtIdControl.setValue(this.originalAuctionArtId());
      this.getTentativeTitle();
      this.calculateStartingBid();
    }
  });

  isWithReserveEffect = effect(() => {
    this.isWithReserveControl.setValue(this.isWithReserve());
  });

  get isWithReserveControl(): FormControl {
    return this.releaseArtForLiveAuctionForm.get('isWithReserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.releaseArtForLiveAuctionForm.get('reserveAmount') as FormControl;
  }

  get originalAuctionArtIdControl(): FormControl {
    return this.releaseArtForLiveAuctionForm.get('originalAuctionArtId') as FormControl;
  }

  constructor() {
    this.releaseArtForLiveAuctionForm = this.#formBuilder.group({
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

  releaseArtForLiveAuction(): void {
    this.releaseArtForLiveAuctionSubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.releaseArtForLiveAuctionForm);

    if (!isValid) {
      this.releaseArtForLiveAuctionSubmitButtonIsDisabled.set(false);
      return;
    }

    this.#releaseArtForLiveAuctionService.releaseArtForPreview$(this.releaseArtForLiveAuctionForm).subscribe({
      next: (response) => {
        this.releaseArtForLiveAuctionForm.reset();
        this.emitIsOpenChange(false);
        this.artReleaseForLiveAuction.emit();

        this.toastSuccess('El arte se ha liberado para vista previa');

        this.copyAuctionPreviewLinkModalIsOpen.set(true);
      },
      error: (error) => {
        console.error(error.error.error.error);

        this.toastError(error.error.error.error);
      }
    }).add(() => {
      this.releaseArtForLiveAuctionSubmitButtonIsDisabled.set(false);
    });
  }

  getTentativeTitle(): void {
    this.#releaseArtForLiveAuctionService.getTentativeTitle$(this.originalAuctionArtIdControl.value).subscribe({
      next: (tentativeTitle) => {
        this.releaseArtForLiveAuctionForm.patchValue({ title: tentativeTitle.data.attributes.title });
        this.releaseArtForLiveAuctionForm.patchValue({ reserveAmount: tentativeTitle.data.attributes.reserveAmount });
        this.reserveAmount.set(tentativeTitle.data.attributes.reserveAmount);
        this.releaseArtForLiveAuctionForm.patchValue({ isWithReserve: tentativeTitle.data.attributes.reserve });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  calculateStartingBid(): void {
    this.#releaseArtForLiveAuctionService.calculateStartingBid$(this.originalAuctionArtIdControl.value).subscribe({
      next: (response) => {
        this.releaseArtForLiveAuctionForm.patchValue({ startingBid: response.data.attributes.startingBid });
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.releaseArtForLiveAuctionForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.releaseArtForLiveAuctionForm) return undefined;

    return this.#validatorsService.getError(this.releaseArtForLiveAuctionForm, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
