import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { RegisterCarService } from '@app/register-car/services/register-car.service';
import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { SubastaAutomovilesTypes } from '@app/register-car/enums/subastaAutomovilesTypes.enum';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { ValidatorsService } from '@shared/services/validators.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { UserData } from '@auth/interfaces';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'register-car',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SecondaryButtonDirective,
    SpinnerComponent,
    TabsWithIconsComponent,
  ],
  templateUrl: './register-car.component.html',
  styleUrl: './register-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCarComponent implements OnInit, OnDestroy {
  #authService = inject(AuthService);
  #fb = inject(FormBuilder);
  #registerCarService = inject(RegisterCarService);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);
  #appComponent = inject(AppComponent);

  tabs: TabWithIcon[];
  currentTab: WritableSignal<TabWithIcon> = signal<TabWithIcon>({} as TabWithIcon);
  currentSubastaAutomovilesType: WritableSignal<SubastaAutomovilesTypes> = signal<SubastaAutomovilesTypes>(SubastaAutomovilesTypes.AUTOMOVILES);
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  brands: WritableSignal<string[]> = signal([]);
  previewImages: WritableSignal<string[]> = signal(['', '', '']);
  currentYear = new Date().getFullYear();
  carRegisterForm: FormGroup;
  reserveValueChangesSubscription?: Subscription;

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get subastaAutomovilesType(): typeof SubastaAutomovilesTypes {
    return SubastaAutomovilesTypes;
  }

  get photosFormArray(): FormArray {
    return this.carRegisterForm.get('photos') as FormArray;
  }

  get reserveControl(): FormControl {
    return this.carRegisterForm.get('reserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.carRegisterForm.get('reserveAmount') as FormControl;
  }

  constructor() {
    this.carRegisterForm = this.#fb.group({
      type: ['automobile', Validators.required],
      brand: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1930), Validators.max(2024)]],
      carModel: ['', Validators.required],
      exteriorColor: ['', Validators.required],
      interiorColor: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      reserve: [null, Validators.required],
      reserveAmount: [null],
      kmType: ['', Validators.required],
      kmInput: ['', Validators.required],
      howDidYouHearAboutUs: ['', Validators.required],
      interest: ['', Validators.required],
      acceptTerms: ['', Validators.required],
      photos: this.#fb.array([
        this.#fb.control(null, Validators.required),
        this.#fb.control(null, Validators.required),
        this.#fb.control(null, Validators.required),
      ])
    });

    this.tabs =
      [
        {
          id: 1,
          name: 'Automóviles',
          img: 'assets/img/registrar auto/car-sport-outline.svg',
          current: true
        },
        {
          id: 2,
          name: 'Arte',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        },
      ];

    this.currentTab.set(this.tabs[0]);
  }

  ngOnInit(): void {
    this.getBrands();

    this.reserveValueChangesSubscription = this.reserveControl.valueChanges.subscribe((value) => {
      if (value === '1') {
        this.reserveAmountControl.setValidators([Validators.required]);
      } else {
        this.reserveAmountControl.clearValidators();
      }

      this.carRegisterForm.updateValueAndValidity();
    });
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  ngOnDestroy(): void {
    this.reserveValueChangesSubscription?.unsubscribe();
  }

  registerCar(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carRegisterForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#registerCarService.registerCar$(this.carRegisterForm).subscribe({
      next: (response) => {
        console.log({ response });

        this.carRegisterForm.reset();

        this.#router.navigate(['/registro-exitoso']);
      },
      error: (error) => {
        console.error({ error });
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });

  }

  getBrands(): void {
    this.#registerCarService.getBrands$().subscribe({
      next: (response) => {
        this.brands.set(response.data);
      },
      error: (error) => {
        console.error({ error });
      }
    });
  }

  selectFile(event: Event, indice: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files?.length) return;

    const file = inputElement.files[0];
    this.photosFormArray.at(indice).setValue(file);

    this.showPreview(file, indice);
  }

  showPreview(archivo: File, indice: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImages.set(
        this.previewImages().map((image, index) => {
          if (index === indice) return reader.result as string;
          return image;
        })
      );
    }
    reader.readAsDataURL(archivo);
  }

  setSubastaAutomovilesType(type: SubastaAutomovilesTypes): void {
    this.currentSubastaAutomovilesType.set(type);
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.carRegisterForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.carRegisterForm) return undefined;

    return this.#validatorsService.getError(this.carRegisterForm, field);
  }

  formArrayHasError(index: number): boolean {
    if (!this.carRegisterForm) return false;

    return this.#validatorsService.formArrayHasError(this.photosFormArray, index);
  }

  getErrorFromFormArray(index: number): string | undefined {
    if (!this.carRegisterForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(this.photosFormArray, index);
  }
}
