import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, WritableSignal, effect, inject, input, signal } from '@angular/core';

import { InputDirective } from '@shared/directives/input.directive';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { BiddingConditionsService } from '../../services/bidding-conditions.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentMethod } from '@auth/interfaces/general-info';
import { ValidatorsService } from '@shared/services/validators.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { MakeBidService } from '@auctions/services/make-bid.service';
import { AppService } from '@app/app.service';
import { InputFormatterDirective } from '@shared/directives';
import { NgxMaskDirective } from 'ngx-mask';

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
    NgxMaskDirective
  ],
  templateUrl: './make-an-offer-modal.component.html',
  styleUrl: './make-an-offer-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakeAnOfferModalComponent implements OnInit {
  @Input() isOpen: WritableSignal<boolean> = signal(false);
  @Output() offerMade = new EventEmitter();
  paymentMethodId = input.required<string>();

  auctionId = input.required<string>();
  minimumNextBid = signal<number>(0);
  disableBidButton = signal<boolean>(false);
  isButtonMakeAnOfferDisabled = signal<boolean>(false);
  holdAmount = signal<number>(0);

  makeAnOfferForm: FormGroup;

  #biddingConditionsService = inject(BiddingConditionsService);
  #validatorsService = inject(ValidatorsService);
  #makeBidService = inject(MakeBidService);
  #appService = inject(AppService);
  #formBuilder = inject(FormBuilder);

  minimumNextBidChangedEffect = effect(() => {
    this.offerAmountControl.addValidators(Validators.min(this.minimumNextBid()));
  });

  paymentMethodIdEffect = effect(() => {
    this.paymentMethodControl.setValue(this.paymentMethodId());
  });

  constructor() {
    this.makeAnOfferForm = this.#formBuilder.group({
      offerAmount: [0, Validators.required],
      paymentMethod: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });
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
    this.getBiddingConditions();

    this.makeAnOfferForm.controls['offerAmount'].valueChanges.subscribe((value) => {
      this.getBidConditions(value);
    });
  }

  makeAnOffer(): void {
    this.isButtonMakeAnOfferDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.makeAnOfferForm);

    if (!isValid) {
      this.isButtonMakeAnOfferDisabled.set(false);
      return;
    }

    this.#makeBidService.makeBid$(this.auctionId(), this.offerAmountControl.value, this.paymentMethodControl.value).subscribe({
      next: () => {
        this.getBiddingConditions();
        this.isOpen.set(false);

        this.offerMade.emit();
        this.toastSuccess('Oferta realizada con éxito');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonMakeAnOfferDisabled.set(false);
    });
  }

  getBiddingConditions(): void {
    this.#biddingConditionsService.getBiddingConditions(this.auctionId()).subscribe({
      next: (biddingConditions) => {
        this.minimumNextBid.set(biddingConditions.data.minimumNextBid);
        // this.offerAmount.set(biddingConditions.data.minimumNextBid);
        this.offerAmountControl.setValue(this.minimumNextBid());
        this.getBidConditions(this.minimumNextBid());
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getBidConditions(userBidAmount: number): void {
    this.#biddingConditionsService.getBidConditions(this.auctionId(), userBidAmount).subscribe({
      next: (bidConditions) => {
        this.disableBidButton.set(bidConditions.data.disableBidButton);
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
