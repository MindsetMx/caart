import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from '@app/app.service';
import { ReleaseArtForLiveAuctionService } from '@app/dashboard/services/release-art-for-live-auction.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'release-art-for-live-auction-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    InputErrorComponent,
    InputDirective,
    MatFormFieldModule,
    MatSelectModule,
    PrimaryButtonDirective,
    SpinnerComponent
  ],
  templateUrl: './release-art-for-live-auction-modal.component.html',
  styleUrl: './release-art-for-live-auction-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseArtForLiveAuctionModalComponent {
  isOpen = input.required<boolean>();
  originalAuctionArtId = input.required<string>();
  isOpenChange = output<boolean>();
  artReleaseForLiveAuction = output<void>();

  releaseArtForLiveAuctionForm: FormGroup;
  releaseArtForLiveAuctionSubmitButtonIsDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #releaseArtForLiveAuctionService = inject(ReleaseArtForLiveAuctionService);
  #appService = inject(AppService);

  categoriesList: { name: string, value: string }[] = [{ name: "Clásico", value: "classic" }, { name: "Eléctrico", value: "electric" }];

  originalAuctionArtIdEffect = effect(() => {
    this.releaseArtForLiveAuctionForm.reset();
    if (this.isOpen()) {
      this.originalAuctionArtIdControl.setValue(this.originalAuctionArtId());
      // this.getTentativeTitle();
    }
  });

  get originalAuctionArtIdControl(): FormControl {
    return this.releaseArtForLiveAuctionForm.get('originalAuctionArtId') as FormControl;
  }

  constructor() {
    this.releaseArtForLiveAuctionForm = this.#formBuilder.group({
      originalAuctionArtId: ['', Validators.required],
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

  releaseArtForLiveAuction(): void {
    this.releaseArtForLiveAuctionSubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.releaseArtForLiveAuctionForm);

    if (!isValid) {
      this.releaseArtForLiveAuctionSubmitButtonIsDisabled.set(false);
      return;
    }

    this.#releaseArtForLiveAuctionService.releaseArtForLiveAuction$(this.releaseArtForLiveAuctionForm).subscribe({
      next: (response) => {
        this.releaseArtForLiveAuctionForm.reset();
        this.emitIsOpenChange(false);
        this.artReleaseForLiveAuction.emit();

        this.toastSuccess('El arte se ha liberado para la subasta en vivo');
      },
      error: (error) => {
        console.error(error.error.error.error);

        this.toastError(error.error.error.error);
      }
    }).add(() => {
      this.releaseArtForLiveAuctionSubmitButtonIsDisabled.set(false);
    });
  }

  // getTentativeTitle(): void {
  //   this.#releaseArtForLiveAuctionService.getTentativeTitle$(this.originalAuctionArtIdControl.value).subscribe({
  //     next: (tentativeTitle) => {
  //       this.releaseArtForLiveAuctionForm.patchValue({ title: tentativeTitle.data.attributes.year + ' ' + tentativeTitle.data.attributes.brand + ' ' + tentativeTitle.data.attributes.artModel });
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }

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
