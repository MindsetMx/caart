import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { AuctionTypes } from '@auctions/enums';
import { ValidatorsService } from '@shared/services/validators.service';
import { LastChanceBidService } from '@auctions/services/last-chance-bid.service';
import { AppService } from '@app/app.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'last-chance-bid-modal-component',
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
  templateUrl: './last-chance-bid-modal.component.html',
  styleUrl: './last-chance-bid-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceBidModalComponent {
  isOpen = model<boolean>(false);

  auctionId = input.required<string>();
  auctionType = input.required<AuctionTypes>();
  bidAmount = input<number | undefined>();
  newOfferMade = input.required<number>();
  paymentMethodId = input.required<string>();

  offerMade = output<void>();

  holdAmount = signal<number>(0);
  isButtonMakeAnOfferDisabled = signal<boolean>(false);
  minimumNextBid = signal<number>(0);
  serverError = signal<string | undefined>(undefined);

  eventSource?: EventSource;

  makeAnOfferForm: FormGroup;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  #validatorsService = inject(ValidatorsService);
  #lastChanceBidService = inject(LastChanceBidService);
  #appService = inject(AppService);
  #formBuilder = inject(FormBuilder);

  bidAmountChangedEffect = effect(() => {
    this.bidAmountControl.setValue(this.bidAmount());
  });

  paymentMethodIdEffect = effect(() => {
    this.paymentMethodControl.setValue(this.paymentMethodId());
  });

  minimumNextBidChangedEffect = effect(() => {
    this.bidAmountControl.addValidators(Validators.min(this.minimumNextBid()));
  });

  newOfferMadeChangedEffect = effect(() => {
    if (this.newOfferMade()) {
      switch (this.auctionType()) {
        case AuctionTypes.car:
          this.getBiddingConditions();
          break;
        case AuctionTypes.art:
          // this.getBiddingArtConditions();
          break;
        case AuctionTypes.memorabilia:
          // this.getBiddingMemorabiliaConditions();
          break;
      }
    }
  });

  constructor() {
    this.makeAnOfferForm = this.#formBuilder.group({
      bidAmount: [0, Validators.required],
      paymentMethod: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });

    if (this.eventSource) {
      this.eventSource.onmessage = (event) => {
        if (JSON.parse(event.data).type !== 'INITIAL_CONNECTION') {
          switch (this.auctionType()) {
            case AuctionTypes.car:
              this.getBiddingConditions();
              break;
            case AuctionTypes.art:
              break;
            case AuctionTypes.memorabilia:
              break;
          }
        }
      }
    }
  }

  get bidAmountControl(): FormControl {
    return this.makeAnOfferForm.get('bidAmount') as FormControl;
  }

  get paymentMethodControl(): FormControl {
    return this.makeAnOfferForm.get('paymentMethod') as FormControl;
  }

  get acceptTermsControl(): FormControl {
    return this.makeAnOfferForm.get('acceptTerms') as FormControl;
  }

  ngOnInit(): void {
    switch (this.auctionType()) {
      case AuctionTypes.car:
        this.getBiddingConditions();

        this.makeAnOfferForm.controls['bidAmount'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value) => {
            this.getBidConditions(value);
          });

        break;

      case AuctionTypes.art:

        break;

      case AuctionTypes.memorabilia:

        break;
    }
  }

  makeAnOffer(): void {
    this.isButtonMakeAnOfferDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.makeAnOfferForm);

    if (!isValid) {
      this.isButtonMakeAnOfferDisabled.set(false);
      return;
    }

    switch (this.auctionType()) {
      case AuctionTypes.car:
        this.#lastChanceBidService.addBid$(this.auctionId(), this.bidAmountControl.value, this.paymentMethodControl.value).subscribe({
          next: () => {
            this.getBiddingConditions();
            this.isOpen.set(false);

            this.offerMade.emit();
            this.toastSuccess('Oferta realizada con éxito');
          },
          error: (error) => {
            console.error(error);
            this.serverError.set(error.error.message);
          }
        }).add(() => {
          this.isButtonMakeAnOfferDisabled.set(false);
        });

        break;

      case AuctionTypes.art:

        break;

      case AuctionTypes.memorabilia:

        break;
    }
  }

  getBiddingConditions(): void {
    this.#lastChanceBidService.getBiddingConditions$(this.auctionId()).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);

        this.bidAmount()
          ? this.bidAmountControl.setValue(this.bidAmount())
          : this.bidAmountControl.setValue(this.minimumNextBid());

        this.getBidConditions(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBidConditions(userBidAmount: number): void {
    this.#lastChanceBidService.getBidConditions$(this.auctionId(), userBidAmount).subscribe({
      next: (bidConditions) => {
        this.holdAmount.set(bidConditions.data.holdAmount);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  controlHasError(control: AbstractControl): boolean {
    return this.#validatorsService.controlHasError(control as FormControl);
  }

  getFirstError(control: AbstractControl): string | undefined {
    return this.#validatorsService.getFirstErrorMessage(control as FormControl);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
