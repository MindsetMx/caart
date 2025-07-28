import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '@shared/services/validators.service';
import { UpdateAuctionCarDetailsDataService } from '@dashboard/services/update-auction-car-details-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Fancybox } from '@fancyapps/ui';
import { AppService } from '@app/app.service';
import { WizardData } from '@dashboard/interfaces/wizard-data';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { states } from '@shared/states';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, map, Observable } from 'rxjs';

@Component({
  selector: 'auction-car-register-details',
  templateUrl: './auction-car-register-details.component.html',
  styleUrls: ['./auction-car-register-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
  ]
})
export class AuctionCarRegisterDetailsComponent {
  wizardData = input.required<WizardData>();
  auctionCarId = input.required<string>();

  filteredStates?: Observable<string[]>;

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #domSanitizer = inject(DomSanitizer);
  #appService = inject(AppService);

  carRegisterForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);

  get stateControl() {
    return this.carRegisterForm.get('state');
  }

  get reserveControl() {
    return this.carRegisterForm.get('reserve');
  }

  get reserveAmountControl() {
    return this.carRegisterForm.get('reserveAmount');
  }

  get transmissionControl() {
    return this.carRegisterForm.get('transmissionType');
  }

  private _filterStates(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return states.filter(state => this._normalizeValue(state).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  constructor() {
    this.carRegisterForm = this.#formBuilder.group({
      type: ['automobile', [Validators.required]],
      brand: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.min(1500), Validators.max(this.currentYear)]],
      carModel: ['', [Validators.required]],
      transmissionType: ['', [Validators.required]],
      otherTransmission: [''],
      engine: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      state: ['', [Validators.required]],
      reserve: [false, [Validators.required]],
      reserveAmount: [''],
      kmType: ['', [Validators.required]],
      kmInput: ['', [Validators.required]],
      howDidYouHearAboutUs: ['', [Validators.required]],
      photos: [[], [Validators.required]],
      videos: [[]],
      acceptTerms: [false, [Validators.requiredTrue]],
      status: ['accepted'],
      userId: [''],
      lotNumber: [0],

    });

    this.filteredStates = this.stateControl?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || '')),
    );

    this.reserveControl?.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe((value) => {
      if (value === true) {
        this.reserveAmountControl?.setValidators([Validators.required]);
      } else {
        this.reserveAmountControl?.setValue('');
        this.reserveAmountControl?.clearValidators();
      }
      this.reserveAmountControl?.updateValueAndValidity();
    });

    this.transmissionControl?.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe((value) => {
      if (value === 'other') {
        this.carRegisterForm.get('otherTransmission')?.setValidators([Validators.required]);
      } else {
        this.carRegisterForm.get('otherTransmission')?.setValue('');
        this.carRegisterForm.get('otherTransmission')?.clearValidators();
      }
      this.carRegisterForm.get('otherTransmission')?.updateValueAndValidity();
    });

    Fancybox.bind("[data-fancybox='registerCarPhotoGallery']", { Hash: false });
  }

  wizardDataEffect = effect(() => {
    if (this.wizardData().data) {
      this.carRegisterForm.reset();

      const registerCarDetails = this.wizardData().data.registerCarDetails;
      this.carRegisterForm.patchValue({
        type: registerCarDetails.type,
        brand: registerCarDetails.brand,
        year: registerCarDetails.year,
        carModel: registerCarDetails.carModel,
        transmissionType: registerCarDetails.transmissionType,
        otherTransmission: registerCarDetails.otherTransmission,
        engine: registerCarDetails.engine,
        city: registerCarDetails.city,
        postalCode: registerCarDetails.postalCode,
        state: registerCarDetails.state,
        reserve: registerCarDetails.reserve,
        reserveAmount: registerCarDetails.reserveAmount,
        kmType: registerCarDetails.kmType,
        kmInput: registerCarDetails.kmInput,
        howDidYouHearAboutUs: registerCarDetails.howDidYouHearAboutUs,
        photos: registerCarDetails.photos,
        videos: registerCarDetails.videos,
        acceptTerms: registerCarDetails.acceptTerms,
        status: registerCarDetails.status,
        userId: registerCarDetails.userId,
        lotNumber: registerCarDetails.lotNumber,

      });
    }
  });

  updateRegisterCarDetails(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carRegisterForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#updateAuctionCarDetailsDataService.updateRegisterCarDetails$(this.auctionCarId(), this.carRegisterForm).subscribe({
      next: () => {
        this.toastSuccess('Detalles de registro actualizados correctamente');
      },
      error: (error: any) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  hasError(fieldName: string): boolean {
    const control = this.carRegisterForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getError(fieldName: string): string {
    const control = this.carRegisterForm.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['requiredTrue']) return 'Debes aceptar los términos y condiciones';
    if (errors['min']) return `El valor mínimo es ${errors['min'].min}`;
    if (errors['max']) return `El valor máximo es ${errors['max'].max}`;
    
    return 'Campo inválido';
  }

  getSafeUrl(url: string): any {
    return this.#domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
