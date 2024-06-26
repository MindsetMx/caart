import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AppService } from '@app/app.service';
import { AuctionTypes } from '@auctions/enums';
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
  auctionType = input.required<AuctionTypes>();
  auctionId = input.required<string>();
  currentReservePrice = input.required<number>();

  isButtonUpdateReservePriceDisabled = signal<boolean>(false);
  serverError = signal<string | undefined>(undefined);

  updateReservePriceForm: FormGroup;

  #formBuilder = inject(FormBuilder);
  #myLiveCarAuctionsService = inject(MyLiveCarAuctionsService);
  #myLiveArtAuctionsService = inject(MyLiveArtAuctionsService);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);

  currentReservePriceEffect = effect(() => {
    console.log('currentReservePrice', this.currentReservePrice());

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

    switch (this.auctionType()) {
      case AuctionTypes.car:
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

        break;

      case AuctionTypes.art:
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

        break;

      case AuctionTypes.memorabilia:

        break;
    }
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
