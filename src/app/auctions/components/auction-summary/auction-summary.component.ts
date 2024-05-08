import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { NgxMaskDirective } from 'ngx-mask';

import { ArtAuctionDetails, AuctionDetails, AuctionMetrics, SpecificArtAuction, SpecificAuction, SpecificMemorabiliaAuction } from '@auctions/interfaces';
import { CountdownService } from '@shared/services/countdown.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '@shared/services/validators.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { BiddingConditionsService } from '@auctions/services/bidding-conditions.service';
import { AuthStatus } from '@auth/enums';
import { AuthService } from '@auth/services/auth.service';
import { AuctionMemorabiliaDetails } from '@auctions/interfaces/auction-memorabilia-details';
import { BiddingMemorabiliaConditionsService } from '@auctions/services/bidding-memorabilia-conditions.service';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { BiddingArtConditionsService } from '@auctions/services/bidding-art-conditions.service';

@Component({
  selector: 'auction-summary',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    InputDirective,
    PrimaryButtonDirective,
    StarComponent,
    ReactiveFormsModule,
    SpinnerComponent,
    InputErrorComponent,
    NgxMaskDirective
  ],
  templateUrl: './auction-summary.component.html',
  styleUrl: './auction-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionSummaryComponent {
  auction = input.required<AuctionDetails | AuctionMemorabiliaDetails | ArtAuctionDetails>();
  auctionType = input.required<AuctionTypes>();
  metrics = input.required<AuctionMetrics>();
  specificAuction = input.required<SpecificAuction | SpecificMemorabiliaAuction | SpecificArtAuction>();

  @Output() makeAnOfferModalIsOpenChanged = new EventEmitter<number>();

  makeAnOfferForm: FormGroup;

  isButtonMakeAnOfferDisabled = signal<boolean>(false);
  minimumNextBid = signal<number>(0);

  #countdownService = inject(CountdownService);
  #validatorsService = inject(ValidatorsService);
  #biddingConditionsService = inject(BiddingConditionsService);
  #biddingMemorabiliaConditionsService = inject(BiddingMemorabiliaConditionsService);
  #biddingArtConditionsService = inject(BiddingArtConditionsService);
  #authService = inject(AuthService);

  minimumNextBidChangedEffect = effect(() => {
    this.offerAmountControl.addValidators(Validators.min(this.minimumNextBid()));
  });

  get offerAmountControl(): FormControl {
    return this.makeAnOfferForm.get('offerAmount') as FormControl;
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  authStatusEffect = effect(() => {
    switch (this.authStatus) {
      case AuthStatus.authenticated:
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

        break;
    }
  });

  constructor() {
    this.makeAnOfferForm = new FormGroup({
      offerAmount: new FormControl('', Validators.required)
    });
  }

  makeAnOffer(): void {
    this.isButtonMakeAnOfferDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.makeAnOfferForm);

    if (!isValid) {
      this.isButtonMakeAnOfferDisabled.set(false);
      return;
    }

    this.isButtonMakeAnOfferDisabled.set(false);
    this.makeAnOfferModalIsOpenChanged.emit(this.offerAmountControl.value);
  }

  getBiddingConditions(): void {
    this.#biddingConditionsService.getBiddingConditions(this.auction().data.id).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);
        this.offerAmountControl.setValue(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBiddingMemorabiliaConditions(): void {
    this.#biddingMemorabiliaConditionsService.getBiddingConditions(this.auction().data.id).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);
        this.offerAmountControl.setValue(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBiddingArtConditions(): void {
    this.#biddingArtConditionsService.getBiddingConditions(this.auction().data.id).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);
        this.offerAmountControl.setValue(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  countdownConfig(): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(this.auction().data.attributes.endDate);
    return {
      leftTime: leftTime,
      format: this.getFormat(leftTime)
    };
  }

  getFormat(seconds: number): string {
    return this.#countdownService.getFormat(seconds);
  }

  getSecondsUntilEndDate(endDate: string): number {
    return this.#countdownService.getSecondsUntilEndDate(endDate);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.makeAnOfferForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.makeAnOfferForm) return undefined;

    return this.#validatorsService.getError(this.makeAnOfferForm, field);
  }
}
