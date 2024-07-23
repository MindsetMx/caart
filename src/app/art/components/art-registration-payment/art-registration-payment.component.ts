import { AuctionTypes as AuctionTypes2 } from '@app/auctions/enums/auction-types';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompleteArtRegistrationService } from '@app/art/services/complete-art-registration.service';
import { ApplyDiscountCode, AuctionTypes } from '@app/register-car/interfaces';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { PaymentMethod } from '@auth/interfaces/general-info';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'art-registration-payment',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    CurrencyPipe,
    SpinnerComponent,
    PaymentMethodModalComponent,
    TitleCasePipe,
    TertiaryButtonDirective
  ],
  templateUrl: './art-registration-payment.component.html',
  styleUrl: './art-registration-payment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRegistrationPaymentComponent {
  #completeArtRegistrationService = inject(CompleteArtRegistrationService);
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #generalInfoService = inject(GeneralInfoService);
  #route = inject(ActivatedRoute);

  artRegistrationPaymentForm: FormGroup;

  isButtonSubmitDisabled = signal<boolean>(false);
  auctionTypes = signal<AuctionTypes>({} as AuctionTypes);
  paymentMethodModalIsOpen = signal<boolean>(false);
  paymentMethods = signal<PaymentMethod[]>([] as PaymentMethod[]);
  applyDiscountCodeResponse = signal<ApplyDiscountCode>({} as ApplyDiscountCode);
  error = signal<string | undefined>(undefined);

  isValidDiscountCode: Signal<boolean | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.isValid;
  });

  discountCodeMessage: Signal<string | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.message;
  });

  constructor() {
    this.artRegistrationPaymentForm = this.#fb.group({
      paymentMethodId: ['', [Validators.required]],
      auctionArtPublishId: [this.#route.snapshot.params['id'], [Validators.required]],
      auctionTypeId: ['', [Validators.required]],
      discountCode: [''],
    });
  }

  ngOnInit(): void {
    this.getAuctionTypes();
    this.getGeneralInfo();
  }

  artRegistrationPaymentFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.artRegistrationPaymentForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeArtRegistrationService.completeArtRegistrationPayment$(this.artRegistrationPaymentForm)
      .subscribe({
        next: () => {
          this.#completeArtRegistrationService.indexTargetStep.set(1);
          this.#completeArtRegistrationService.indexCurrentStep.set(1);

          window.scrollTo(0, 0);
        },
        error: (error) => {
          console.error(error);
          this.error.set(error.error.message);
        },
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  applyDiscountCode(): void {
    this.#completeArtRegistrationService.applyDiscountCode$(this.artRegistrationPaymentForm.value.discountCode)
      .subscribe({
        next: (response) => {
          this.applyDiscountCodeResponse.set(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  refreshPaymentMethods(): void {
    this.getGeneralInfo();
  }

  getGeneralInfo(): void {
    this.#generalInfoService.getGeneralInfo$().subscribe((generalInfo) => {
      this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);
    });
  }

  getAuctionTypes(): void {
    this.#completeArtRegistrationService.getAuctionTypes$(AuctionTypes2.art).subscribe((auctionTypes) => {
      this.auctionTypes.set(auctionTypes);
    });
  }

  hasError(field: string, form: FormGroup = this.artRegistrationPaymentForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.artRegistrationPaymentForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }
}
