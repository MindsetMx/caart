import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal, ElementRef, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AppComponent } from '@app/app.component';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { Brands, Colors } from '@app/register-car/interfaces';
import { CompleteRegisterModalComponent } from '@auth/modals/complete-register-modal/complete-register-modal.component';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { InputFormatterDirective } from '@shared/directives/input-formatter.directive';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { RegisterCarService } from '@app/register-car/services/register-car.service';
import { SecondaryButtonDirective } from '@shared/directives/secondary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { states } from '@shared/states';
import { SubastaAutomovilesTypes } from '@app/register-car/enums/subastaAutomovilesTypes.enum';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { ValidatorsService } from '@shared/services/validators.service';
import { VehicleMemorabiliaComponentComponent } from '@app/register-car/components/vehicle-memorabilia-component/vehicle-memorabilia-component.component';
import { environments } from '@env/environments';
import { CloudinaryCroppedImageService } from '@app/dashboard/services/cloudinary-cropped-image.service';

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
    MatAutocompleteModule,
    InputFormatterDirective,
    VehicleMemorabiliaComponentComponent,
  ],
  templateUrl: './register-car.component.html',
  styleUrl: './register-car.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCarComponent implements OnInit, OnDestroy {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardImages = viewChild<ElementRef>('uppyDashboardImages');
  uppyDashboardVideos = viewChild<ElementRef>('uppyDashboardVideos');

  #appComponent = inject(AppComponent);
  #fb = inject(FormBuilder);
  #registerCarService = inject(RegisterCarService);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);
  #authService = inject(AuthService);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);

  brands = signal<string[]>([]);
  filteredBrands?: Observable<string[]>;
  states = signal<string[]>(states);
  filteredStates?: Observable<string[]>;
  token = signal<string>('');

  colors = signal<Colors[]>([]);
  carRegisterForm: FormGroup;
  currentSubastaAutomovilesType = signal<SubastaAutomovilesTypes>(SubastaAutomovilesTypes.AUTOMOVILES);
  currentTab = signal<TabWithIcon>({} as TabWithIcon);
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal(false);
  reserveValueChangesSubscription?: Subscription;
  transmisionValueChangesSubscription?: Subscription;
  tabs: TabWithIcon[];
  unformattedReserveAmount?: string;
  unformattedKm?: string;
  formattedKm?: string;

  uppyImages?: Uppy;
  uppyVideos?: Uppy;

  get stateControl(): FormControl {
    return this.carRegisterForm.get('state') as FormControl;
  }

  get kmTypeControl(): FormControl {
    return this.carRegisterForm.get('kmType') as FormControl;
  }

  get brandControl(): FormControl {
    return this.carRegisterForm.get('brand') as FormControl;
  }

  get subastaAutomovilesType(): typeof SubastaAutomovilesTypes {
    return SubastaAutomovilesTypes;
  }

  get transmisionControl(): FormControl {
    return this.carRegisterForm.get('transmissionType') as FormControl;
  }

  get kmInputControl(): FormControl {
    return this.carRegisterForm.get('kmInput') as FormControl;
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

  uploadImageUrlEffect = effect(() => {
    if (this.uppyDashboardImages()) {
      this.uppyImages = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          maxFileSize: 10000000,
          // maxNumberOfFiles: 20,
          minNumberOfFiles: 1,
          allowedFileTypes: ['image/*'],
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
          target: this.uppyDashboardImages()?.nativeElement,
          proudlyDisplayPoweredByUppy: false,
          locale: {
            strings: {
              dropPasteFiles: 'Arrastra y suelta tus fotos aquí o %{browse}',
            }
          }
        })
        .use(XHRUpload, {
          endpoint: 'https://batch.imagedelivery.net/images/v1',
          formData: true,
          fieldName: 'file',
          allowedMetaFields: [],
          limit: 1,
          headers: {
            'Authorization': 'Bearer ' + this.token(),
          }
        })
        .on('complete', (result) => {
          result.successful.forEach((file: any) => {
            const url = file.response.body.result.variants[0];

            this.photosControl.setValue([...this.photosControl.value, url]);

            this.uppyDashboardImages()?.nativeElement.click();

            file.meta['uploadURL'] = url;
          });
        }).on('file-removed', (file) => {
          const urlToRemove = file.meta['uploadURL'];

          this.photosControl.setValue(this.photosControl.value.filter((url: string) => url !== urlToRemove));
        });
    }
  });

  uppyDashboardVideosEffect = effect(() => {
    if (this.uppyDashboardVideos()) {
      this.uppyVideos = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          maxFileSize: 500000000,
          // maxNumberOfFiles: 20,
          minNumberOfFiles: 1,
          allowedFileTypes: ['video/*'],
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
          target: this.uppyDashboardVideos()?.nativeElement,
          proudlyDisplayPoweredByUppy: false,
          locale: {
            strings: {
              dropPasteFiles: 'Arrastra y suelta tus videos aquí o %{browse}',
            }
          }
        })
        .use(XHRUpload, {
          endpoint: `https://api.cloudflare.com/client/v4/accounts/${environments.cloudflareAccountId}/stream`,
          formData: true,
          fieldName: 'file',
          limit: 1,
          headers: {
            'Authorization': `Bearer ${this.#cloudflareToken}`,
          },
          allowedMetaFields: ['requireSignedURLs'],
        })
        .on('complete', (result) => {
          result.successful.forEach((file: any) => {
            const url = file.response.body.result.preview;

            this.videosControl.setValue([...this.videosControl.value, url]);

            this.uppyDashboardVideos()?.nativeElement.click();

            file.meta['uploadURL'] = url;
          });
        }).on('file-removed', (file) => {
          const urlToRemove = file.meta['uploadURL'];

          this.videosControl.setValue(this.videosControl.value.filter((url: string) => url !== urlToRemove));
        });
    }
  });

  constructor() {
    this.carRegisterForm = this.#fb.group({
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

    this.batchTokenDirect();

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
        {
          id: 3,
          name: 'Memorabilia',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        }
      ];

    this.currentTab.set(this.tabs[0]);
  }

  ngOnInit(): void {
    this.getBrands();
    this.getColors();

    this.filteredStates = this.stateControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStates(value || '')),
    );

    this.reserveValueChangesSubscription = this.reserveControl.valueChanges.subscribe((value) => {
      if (value === 'true') {
        this.reserveAmountControl.setValidators([Validators.required]);
      } else {
        this.reserveAmountControl.clearValidators();
      }

      this.reserveAmountControl.updateValueAndValidity();
    });

    this.transmisionValueChangesSubscription = this.transmisionControl.valueChanges.subscribe((value) => {
      if (value === 'other') {
        this.carRegisterForm.get('otherTransmission')?.setValidators([Validators.required]);
      } else {
        this.carRegisterForm.get('otherTransmission')?.clearValidators();
      }

      this.carRegisterForm.get('otherTransmission')?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.reserveValueChangesSubscription?.unsubscribe();
    this.transmisionValueChangesSubscription?.unsubscribe();
  }

  batchTokenDirect(): void {
    this.#cloudinaryCroppedImageService.batchTokenDirect$().
      subscribe({
        next: (response) => {
          this.token.set(response.result.token);
        },
        error: (error) => {
          console.error(error);
        }
      });
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

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  openRegisterModal(): void {
    this.#appComponent.openRegisterModal();
  }

  registerCar(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carRegisterForm);

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
