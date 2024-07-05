import { ChangeDetectionStrategy, Component, effect, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AppService } from '@app/app.service';
import { AuctionTypes } from '@auctions/enums';
import { AuctionTypes as AuctionTypes2 } from '@activity/enums';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { MyLiveArtAuctionsService } from '@auctions/services/my-live-art-auctions.service';
import { MyLiveCarAuctionsService } from '@auctions/services/my-live-car-auctions.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'update-reserve-price-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InputDirective,
    PrimaryButtonDirective,
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    SpinnerComponent,
    NgxMaskDirective
  ],
  templateUrl: './update-reserve-price-modal.component.html',
  styleUrl: './update-reserve-price-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateReservePriceModalComponent {
  isOpen = model.required<boolean>();
  auctionType = input.required<AuctionTypes | AuctionTypes2>();
  auctionId = input.required<string>();
  currentReservePrice = input.required<number>();

  reserveAmountUpdated = output<void>();

  isButtonUpdateReservePriceDisabled = signal<boolean>(false);
  serverError = signal<string | undefined>(undefined);

  updateReservePriceForm: FormGroup;

  #formBuilder = inject(FormBuilder);
  #myLiveCarAuctionsService = inject(MyLiveCarAuctionsService);
  #myLiveArtAuctionsService = inject(MyLiveArtAuctionsService);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);

  currentReservePriceEffect = effect(() => {
    this.reserveAmountControl.setValue(this.currentReservePrice());
  });

  get reserveAmountControl(): FormControl {
    return this.updateReservePriceForm.get('reserveAmount') as FormControl;
  }

  constructor() {
    this.updateReservePriceForm = this.#formBuilder.group({
      reserveAmount: ['', Validators.required],
    });
  }

  updateReservePrice(): void {
    this.isButtonUpdateReservePriceDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.updateReservePriceForm);

    this.serverError.set(undefined);

    if (!isValid) {
      this.isButtonUpdateReservePriceDisabled.set(false);
      return;
    }

    console.log('this.auctionType()', this.auctionType());

    switch (this.auctionType()) {
      case AuctionTypes.car:
        this.updateCarAuctionReservePrice();
        this.reserveAmountUpdated.emit();
        break;

      case AuctionTypes2.auto:
        this.updateCarAuctionReservePrice();
        this.reserveAmountUpdated.emit();
        break;

      case AuctionTypes.art:
        this.updateArtAuctionReservePrice();
        this.reserveAmountUpdated.emit();
        break;

      case AuctionTypes2.arte:
        this.updateArtAuctionReservePrice();
        this.reserveAmountUpdated.emit();
        break;

      case AuctionTypes.memorabilia:

        break;
    }
  }

  updateCarAuctionReservePrice(): void {
    this.#myLiveCarAuctionsService.updateCarAuctionReservePrice$(this.auctionId(), this.reserveAmountControl.value).subscribe({
      next: () => {
        this.isOpen.set(false);
        this.toastSuccess('Precio de reserva actualizado con éxito');
      },
      error: (error) => {
        console.error(error);
        this.serverError.set(error.error.message);
      }
    }).add(() => {
      this.isButtonUpdateReservePriceDisabled.set(false);
    });
  }

  updateArtAuctionReservePrice(): void {
    this.#myLiveArtAuctionsService.updateArtAuctionReservePrice$(this.auctionId(), this.reserveAmountControl.value).subscribe({
      next: () => {
        this.isOpen.set(false);
        this.toastSuccess('Precio de reserva actualizado con éxito');
      },
      error: (error) => {
        console.error(error);
        this.serverError.set(error.error.message);
      }
    }).add(() => {
      this.isButtonUpdateReservePriceDisabled.set(false);
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  hasError(field: string, form: FormGroup = this.updateReservePriceForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.updateReservePriceForm): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }
}
