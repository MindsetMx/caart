import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, WritableSignal, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppService } from '@app/app.service';
import { BiddingConditionsService } from '@auctions/services/bidding-conditions.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { MakeBidService } from '@auctions/services/make-bid.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { AuctionComponent } from '@auctions/pages/auction/auction.component';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { BiddingMemorabiliaConditionsService } from '@auctions/services/bidding-memorabilia-conditions.service';
import { BiddingArtConditionsService } from '@auctions/services/bidding-art-conditions.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'auction-make-an-offer-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InputDirective,
    PrimaryButtonDirective,
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    SpinnerComponent,
    NgxMaskDirective,
    RouterLink
  ],
  templateUrl: './make-an-offer-modal.component.html',
  styleUrl: './make-an-offer-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeAnOfferModalComponent implements OnInit {
  isOpen = input<boolean>(false);
  auctionType = input.required<AuctionTypes>();
  newOfferMade = input.required<number>();

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() offerMade = new EventEmitter();
  paymentMethodId = input.required<string>();
  auctionId = input.required<string>();
  offerAmount = input<number | undefined>();
  minimumNextBid = signal<number>(0);
  isButtonMakeAnOfferDisabled = signal<boolean>(false);
  holdAmount = signal<number>(0);
  serverError = signal<string | undefined>(undefined);

  eventSource?: EventSource;

  makeAnOfferForm: FormGroup;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  #biddingConditionsService = inject(BiddingConditionsService);
  #validatorsService = inject(ValidatorsService);
  #makeBidService = inject(MakeBidService);
  #appService = inject(AppService);
  #formBuilder = inject(FormBuilder);
  #biddingMemorabiliaConditionsService = inject(BiddingMemorabiliaConditionsService);
  #biddingArtConditionsService = inject(BiddingArtConditionsService);

  offerAmountChangedEffect = effect(() => {
    this.offerAmountControl.setValue(this.offerAmount());
  });

  minimumNextBidChangedEffect = effect(() => {
    this.offerAmountControl.addValidators(Validators.min(this.minimumNextBid()));
  });

  paymentMethodIdEffect = effect(() => {
    this.paymentMethodControl.setValue(this.paymentMethodId());
  });

  newOfferMadeChangedEffect = effect(() => {
    if (this.newOfferMade()) {
      switch (this.auctionType()) {
        case AuctionTypes.car:
          this.getBiddingConditions();
          break;
        case AuctionTypes.art:
          this.getBiddingArtConditions();
          break;
        case AuctionTypes.memorabilia:
          this.getBiddingMemorabiliaConditions();
          break;
      }
    }
  });

  constructor() {
    this.makeAnOfferForm = this.#formBuilder.group({
      offerAmount: [0, Validators.required],
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
              this.getBiddingArtConditions();
              break;
            case AuctionTypes.memorabilia:
              this.getBiddingMemorabiliaConditions();
              break;
          }
        }
      }
    }
  }

  get offerAmountControl(): FormControl {
    return this.makeAnOfferForm.get('offerAmount') as FormControl;
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

        this.makeAnOfferForm.controls['offerAmount'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value) => {
            this.getBidConditions(value);
          });

        break;

      case AuctionTypes.art:
        this.getBiddingArtConditions();

        this.makeAnOfferForm.controls['offerAmount'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value) => {
            this.getBidArtConditions(value);
          });

        break;

      case AuctionTypes.memorabilia:
        this.getBiddingMemorabiliaConditions();

        this.makeAnOfferForm.controls['offerAmount'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value) => {
            this.getBidMemorabiliaConditions(value);
          });

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
        this.#makeBidService.makeBid$(this.auctionId(), this.offerAmountControl.value, this.paymentMethodControl.value).subscribe({
          next: () => {
            this.getBiddingConditions();
            this.isOpenChange.emit(false);

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
        this.#makeBidService.makeArtBid$(this.auctionId(), this.offerAmountControl.value, this.paymentMethodControl.value).subscribe({
          next: () => {
            this.getBiddingArtConditions();
            this.isOpenChange.emit(false);

            this.offerMade.emit();
            this.toastSuccess('Oferta realizada con éxito');
          },
          error: (error) => {
            console.error(error);
          }
        }).add(() => {
          this.isButtonMakeAnOfferDisabled.set(false);
        });

        break;

      case AuctionTypes.memorabilia:
        this.#makeBidService.makeMemorabiliaBid$(this.auctionId(), this.offerAmountControl.value, this.paymentMethodControl.value).subscribe({
          next: () => {
            this.getBiddingMemorabiliaConditions();
            this.isOpenChange.emit(false);

            this.offerMade.emit();
            this.toastSuccess('Oferta realizada con éxito');
          },
          error: (error) => {
            console.error(error);
          }
        }).add(() => {
          this.isButtonMakeAnOfferDisabled.set(false);
        });

        break;
    }
  }

  getBiddingConditions(): void {
    this.#biddingConditionsService.getBiddingConditions(this.auctionId()).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);

        this.offerAmount()
          ? this.offerAmountControl.setValue(this.offerAmount())
          : this.offerAmountControl.setValue(this.minimumNextBid());

        this.getBidConditions(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBiddingMemorabiliaConditions(): void {
    this.#biddingMemorabiliaConditionsService.getBiddingConditions(this.auctionId()).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);

        this.offerAmount()
          ? this.offerAmountControl.setValue(this.offerAmount())
          : this.offerAmountControl.setValue(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBiddingArtConditions(): void {
    this.#biddingArtConditionsService.getBiddingConditions(this.auctionId()).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);

        this.offerAmount()
          ? this.offerAmountControl.setValue(this.offerAmount())
          : this.offerAmountControl.setValue(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBidConditions(userBidAmount: number): void {
    this.#biddingConditionsService.getBidConditions(this.auctionId(), userBidAmount).subscribe({
      next: (bidConditions) => {
        this.holdAmount.set(bidConditions.data.holdAmount);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBidMemorabiliaConditions(userBidAmount: number): void {
    this.#biddingMemorabiliaConditionsService.getBidConditions(this.auctionId(), userBidAmount).subscribe({
      next: (bidConditions) => {
        this.holdAmount.set(bidConditions.data.holdAmount);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBidArtConditions(userBidAmount: number): void {
    this.#biddingArtConditionsService.getBidConditions(this.auctionId(), userBidAmount).subscribe({
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
