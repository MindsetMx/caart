import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from '@app/app.service';
import { WizardData } from '@app/dashboard/interfaces/wizard-data';
import { UpdateAuctionCarDetailsDataService } from '@app/dashboard/services/update-auction-car-details-data.service';
import { ValidatorsService } from '@shared/services/validators.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, map, Observable } from 'rxjs';
import { RegisterCarService } from '@app/register-car/services/register-car.service';
import { states } from '@shared/states';
import { Brands, Colors } from '@app/register-car/interfaces';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'auction-car-register-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    InputErrorComponent,
    SpinnerComponent,
    PrimaryButtonDirective,
    NgxMaskDirective,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './auction-car-register-details.component.html',
  styleUrl: './auction-car-register-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarRegisterDetailsComponent {
  wizardData = input.required<WizardData>();
  isOpen = model.required<boolean>();
  auctionCarId = input.required<string>();

  brands = signal<string[]>([]);

  filteredBrands?: Observable<string[]>;
  filteredStates?: Observable<string[]>;

  #sanitizer = inject(DomSanitizer);
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #appService = inject(AppService);
  #registerCarService = inject(RegisterCarService);

  carRegisterForm: FormGroup;
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal<boolean>(false);

  colors = signal<Colors[]>([]);

  get stateControl(): FormControl {
    return this.carRegisterForm.get('state') as FormControl;
  }

  get kmTypeControl(): FormControl {
    return this.carRegisterForm.get('kmType') as FormControl;
  }

  get reserveControl(): FormControl {
    return this.carRegisterForm.get('reserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.carRegisterForm.get('reserveAmount') as FormControl;
  }

  get transmisionControl(): FormControl {
    return this.carRegisterForm.get('transmissionType') as FormControl;
  }

  get brandControl(): FormControl {
    return this.carRegisterForm.get('brand') as FormControl;
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.brands().filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _filterStates(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return states.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  constructor() {
    this.carRegisterForm = this.#formBuilder.group({
      type: ['automobile', Validators.required],
      brand: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1500), Validators.max(this.currentYear)]],
      carModel: ['', Validators.required],
      exteriorColor: ['', Validators.required],
      specificColor: ['', Validators.required],
      interiorColor: ['', Validators.required],
      generalCondition: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      reserve: [null, Validators.required],
      reserveAmount: [''],
      kmType: ['', Validators.required],
      kmInput: ['', Validators.required],
      transmissionType: ['', Validators.required],
      otherTransmission: [null],
      engine: ['', Validators.required],
      howDidYouHearAboutUs: ['', Validators.required],
      photos: [[], Validators.required],
      videos: [[]],
      interest: ['', Validators.required],
      acceptTerms: ['', Validators.required],
    });

    this.getBrands();
    this.getColors();

    this.filteredStates = this.stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || '')),
    );

    this.reserveControl.valueChanges.
      pipe(
        takeUntilDestroyed()
      ).subscribe((value) => {
        if (value === true) {
          this.reserveAmountControl.setValidators([Validators.required]);
        } else {
          this.reserveAmountControl.setValue('');
          this.reserveAmountControl.clearValidators();
        }

        this.reserveAmountControl.updateValueAndValidity();
      });

    this.transmisionControl.valueChanges.
      pipe(
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
        exteriorColor: registerCarDetails.exteriorColor,
        specificColor: registerCarDetails.specificColor,
        interiorColor: registerCarDetails.interiorColor,
        generalCondition: registerCarDetails.generalCondition,
        city: registerCarDetails.city,
        state: registerCarDetails.state,
        postalCode: registerCarDetails.postalCode,
        reserve: registerCarDetails.reserve,
        reserveAmount: registerCarDetails.reserveAmount,
        kmType: registerCarDetails.kmType,
        kmInput: registerCarDetails.kmInput,
        transmissionType: registerCarDetails.transmissionType,
        otherTransmission: registerCarDetails.otherTransmission,
        engine: registerCarDetails.engine,
        howDidYouHearAboutUs: registerCarDetails.howDidYouHearAboutUs,
        photos: registerCarDetails.photos,
        videos: registerCarDetails.videos,
        interest: registerCarDetails.interest,
        acceptTerms: registerCarDetails.acceptTerms,
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
        this.toastSuccess('El registro del vehículo se ha actualizado correctamente');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  getBrands(): void {
    this.#registerCarService.getBrands$().
      subscribe({
        next: (response: Brands) => {
          this.brands.set(response.data);
          this.filteredBrands = this.brandControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getColors(): void {
    this.#registerCarService.getColors$().subscribe({
      next: (response: Colors[]) => {
        this.colors.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.carRegisterForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.carRegisterForm) return undefined;

    return this.#validatorsService.getError(this.carRegisterForm, field);
  }
}
