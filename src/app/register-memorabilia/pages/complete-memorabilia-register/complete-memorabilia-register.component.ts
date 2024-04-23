import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyDiscountCode, AuctionTypes } from '@app/register-car/interfaces';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { CompleteMemorabiliaRegistrationService } from '@app/register-memorabilia/services/complete-memorabilia-registration.service';
import { PaymentMethod } from '@auth/interfaces/general-info';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-complete-memorabilia-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    SpinnerComponent,
    PaymentMethodModalComponent,
    InputDirective,
    TertiaryButtonDirective,
    PrimaryButtonDirective
  ],
  templateUrl: './complete-memorabilia-register.component.html',
  styleUrl: './complete-memorabilia-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteMemorabiliaRegisterComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #fb = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #completeMemorabiliaRegistrationService = inject(CompleteMemorabiliaRegistrationService);
  #generalInfoService = inject(GeneralInfoService);
  #router = inject(Router);

  generalInformationForm: FormGroup;

  publicationId: string = this.#route.snapshot.params['id'];
  isButtonSubmitDisabled = signal<boolean>(false);
  auctionTypes = signal<AuctionTypes>({} as AuctionTypes);
  applyDiscountCodeResponse = signal({} as ApplyDiscountCode);
  paymentMethods = signal([] as PaymentMethod[]);
  paymentMethodModalIsOpen = signal<boolean>(false);

  isValidDiscountCode: Signal<boolean | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.isValid;
  });

  discountCodeMessage: Signal<string | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.message;
  });

  constructor() {
    this.generalInformationForm = this.#fb.group({
      paymentMethodId: ['', [Validators.required]],
      auctionMemorabiliaPublishId: [this.#route.snapshot.params['id'], [Validators.required]],
      auctionTypeId: ['', [Validators.required]],
      discountCode: [''],
    });
  }

  ngOnInit(): void {
    this.getWizardSteps();
    this.getAuctionTypes();
    this.getGeneralInfo();
  }

  generalInformationFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.generalInformationForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeMemorabiliaRegistrationService.saveGeneralInformation$(this.generalInformationForm)
      .subscribe({
        next: () => {
          this.#router.navigate(['registro-completado']);
        },
        error: (error) => {
          console.error(error);
        },
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  getWizardSteps(): void {
    this.#completeMemorabiliaRegistrationService.wizardSteps$(this.publicationId).subscribe({
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
    this.#completeMemorabiliaRegistrationService.getAuctionTypes$().subscribe((auctionTypes) => {
      this.auctionTypes.set(auctionTypes);
    });
  }

  applyDiscountCode(): void {
    this.#completeMemorabiliaRegistrationService.applyDiscountCode$(this.generalInformationForm.value.discountCode)
      .subscribe({
        next: (response) => {
          this.applyDiscountCodeResponse.set(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  hasError(form: FormGroup, field: string): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(form: FormGroup, field: string): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }
}
