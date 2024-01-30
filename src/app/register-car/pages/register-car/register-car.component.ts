import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, WritableSignal, inject, signal, ViewChild, ElementRef, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppComponent } from '@app/app.component';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CompleteRegisterModalComponent } from '@auth/modals/complete-register-modal/complete-register-modal.component';
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
import { Brands, Colors } from '@app/register-car/interfaces';

@Component({
  selector: 'register-car',
  standalone: true,
  imports: [
    CommonModule,
    CompleteRegisterModalComponent,
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SecondaryButtonDirective,
    SpinnerComponent,
    TabsWithIconsComponent,
    UppyAngularDashboardModule,
    MatAutocompleteModule
  ],
  templateUrl: './register-car.component.html',
  styleUrl: './register-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uppyDashboard') uppyDashboard!: ElementRef;

  #appComponent = inject(AppComponent);
  #fb = inject(FormBuilder);
  #registerCarService = inject(RegisterCarService);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);
  #authService = inject(AuthService);

  brands: WritableSignal<string[]> = signal([]);
  filteredBrands?: Observable<string[]>;

  colors: WritableSignal<Colors[]> = signal([]);
  carRegisterForm: FormGroup;
  currentSubastaAutomovilesType: WritableSignal<SubastaAutomovilesTypes> = signal<SubastaAutomovilesTypes>(SubastaAutomovilesTypes.AUTOMOVILES);
  currentTab: WritableSignal<TabWithIcon> = signal<TabWithIcon>({} as TabWithIcon);
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  reserveValueChangesSubscription?: Subscription;
  transmisionValueChangesSubscription?: Subscription;
  tabs: TabWithIcon[];

  uppy?: Uppy;

  get brandControl(): FormControl {
    return this.carRegisterForm.get('brand') as FormControl;
  }

  get subastaAutomovilesType(): typeof SubastaAutomovilesTypes {
    return SubastaAutomovilesTypes;
  }

  get transmisionControl(): FormControl {
    return this.carRegisterForm.get('transmissionType') as FormControl;
  }

  get reserveControl(): FormControl {
    return this.carRegisterForm.get('reserve') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.carRegisterForm.get('reserveAmount') as FormControl;
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  get userIsNotAuthenticated(): boolean {
    return this.authStatus === AuthStatus.notAuthenticated;
  }

  get photosControl(): FormControl {
    return this.carRegisterForm.get('photos') as FormControl;
  }

  get videosControl(): FormControl {
    return this.carRegisterForm.get('videos') as FormControl;
  }

  constructor() {
    this.carRegisterForm = this.#fb.group({
      type: ['automobile', Validators.required],
      brand: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
      carModel: ['', Validators.required],
      exteriorColor: ['', Validators.required],
      specificColor: ['', Validators.required],
      interiorColor: ['', Validators.required],
      generalCondition: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      reserve: [null, Validators.required],
      reserveAmount: [null],
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

  ngAfterViewInit(): void {
    this.uppy = new Uppy({
      debug: true,
      autoProceed: true,
      locale: Spanish,
      meta: {
        upload_preset: 'if8y72iv',
        api_key: '218199524155838',
      },
      restrictions: {
        // maxFileSize: 1000000,
        // maxNumberOfFiles: 20,
        minNumberOfFiles: 1,
        allowedFileTypes: ['image/*', 'video/*'],
      },
    }).use(Dashboard,
      {
        height: 300,
        hideUploadButton: true,
        hideCancelButton: true,
        showRemoveButtonAfterComplete: true,
        showProgressDetails: true,
        inline: true,
        hideProgressAfterFinish: true,
        target: this.uppyDashboard.nativeElement,
        proudlyDisplayPoweredByUppy: false,
        locale: {
          strings: {
            dropPasteFiles: 'Arrastra y suelta tus fotos aquí o %{browse}',
          }
        }
      })
      .use(XHRUpload, {
        endpoint: 'https://api.cloudinary.com/v1_1/dv7skd1y3/upload',
        formData: true,
        fieldName: 'file',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        allowedMetaFields: ['upload_preset', 'api_key'],
      })
      .on('complete', (result) => {
        result.successful.forEach(file => {
          const url = file.uploadURL;

          if (file?.type?.includes('image')) {
            this.photosControl.setValue([...this.photosControl.value, url]);
          } else if (file?.type?.includes('video')) {
            this.videosControl.setValue([...this.videosControl.value, url]);
          }
          this.uppyDashboard.nativeElement.click();

          file.meta['uploadURL'] = url;
        });
      }).on('file-removed', (file) => {
        const urlToRemove = file.meta['uploadURL'];

        if (file?.type?.includes('image')) {
          this.photosControl.setValue(this.photosControl.value.filter((url: string) => url !== urlToRemove));
        } else if (file?.type?.includes('video')) {
          this.videosControl.setValue(this.videosControl.value.filter((url: string) => url !== urlToRemove));
        }
      });
  }

  ngOnInit(): void {
    this.getBrands();
    this.getColors();

    this.filteredBrands = this.brandControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.reserveValueChangesSubscription = this.reserveControl.valueChanges.subscribe((value) => {
      if (value === '1') {
        this.reserveAmountControl.setValidators([Validators.required]);
      } else {
        this.reserveAmountControl.clearValidators();
      }

      this.carRegisterForm.updateValueAndValidity();
    });

    this.transmisionValueChangesSubscription = this.transmisionControl.valueChanges.subscribe((value) => {
      if (value === 'other') {
        this.carRegisterForm.get('otherTransmission')?.setValidators([Validators.required]);
      } else {
        this.carRegisterForm.get('otherTransmission')?.clearValidators();
      }

      this.carRegisterForm.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.reserveValueChangesSubscription?.unsubscribe();
    this.transmisionValueChangesSubscription?.unsubscribe();
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.brands().filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  openRegisterModal(): void {
    this.#appComponent.openRegisterModal();
  }

  registerCar(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carRegisterForm);

    console.log(this.carRegisterForm.value);
    console.log({ isValid });

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#registerCarService.registerCar$(this.carRegisterForm).subscribe({
      next: () => {
        this.carRegisterForm.reset();

        this.#router.navigate(['/registro-exitoso']);
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });

  }

  showModalBasedOnUserStatus(): void {
    if (this.userIsNotAuthenticated) {
      this.#appComponent.openSignInModal();
      return;
    }
  }

  getBrands(): void {
    this.#registerCarService.getBrands$().subscribe({
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
}
