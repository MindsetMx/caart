import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMaskDirective } from 'ngx-mask';
import { Observable, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Uppy } from '@uppy/core';
import { UppyAngularDashboardModule } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Spanish from '@uppy/locales/lib/es_ES';
import XHRUpload from '@uppy/xhr-upload';

import { AppComponent } from '@app/app.component';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { Brands } from '@app/register-car/interfaces';
import { CloudinaryCroppedImageService } from '@app/dashboard/services/cloudinary-cropped-image.service';
import { CompleteRegisterModalComponent } from '@auth/modals/complete-register-modal/complete-register-modal.component';
import { environments } from '@env/environments';
import { InputDirective, PrimaryButtonDirective, SecondaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { RegisterCarService } from '@app/register-car/services/register-car.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { states } from '@shared/states';
import { SubastaAutomovilesTypes } from '@app/register-car/enums/SubastaAutomovilesTypes.enum';
import { ValidatorsService } from '@shared/services/validators.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'car-register',
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
    UppyAngularDashboardModule,
    MatAutocompleteModule,
    NgxMaskDirective,
    MatTooltipModule,
  ],
  templateUrl: './car-register.component.html',
  styleUrl: './car-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarRegisterComponent {
  readonly #cloudflareToken = environments.cloudflareToken;

  uppyDashboardImages = viewChild<ElementRef>('uppyDashboardImages');
  uppyDashboardVideos = viewChild<ElementRef>('uppyDashboardVideos');

  brands = signal<string[]>([]);
  carRegisterForm: FormGroup;
  currentSubastaAutomovilesType = signal<SubastaAutomovilesTypes>(SubastaAutomovilesTypes.AUTOMOVILES);
  currentYear = new Date().getFullYear();
  isButtonSubmitDisabled = signal(false);
  states = signal<string[]>(states);
  token = signal<string>('');

  filteredBrands?: Observable<string[]>;
  filteredStates?: Observable<string[]>;

  uppyImages?: Uppy;
  uppyVideos?: Uppy;

  #appComponent = inject(AppComponent);
  #authService = inject(AuthService);
  #cloudinaryCroppedImageService = inject(CloudinaryCroppedImageService);
  #fb = inject(FormBuilder);
  #registerCarService = inject(RegisterCarService);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);

  uploadImageUrlEffect = effect(() => {
    if (this.uppyDashboardImages() && !this.uppyImages) {
      this.uppyImages = new Uppy({
        debug: true,
        autoProceed: true,
        locale: Spanish,
        restrictions: {
          maxFileSize: 20000000,
          // maxNumberOfFiles: 20,
          minNumberOfFiles: 0,
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
          minNumberOfFiles: 0,
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

  get stateControl(): FormControl {
    return this.carRegisterForm.get('state') as FormControl;
  }

  get kmTypeControl(): FormControl {
    return this.carRegisterForm.get('kmType') as FormControl;
  }

  get brandControl(): FormControl {
    return this.carRegisterForm.get('brand') as FormControl;
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

  get photosControl(): FormControl {
    return this.carRegisterForm.get('photos') as FormControl;
  }

  get videosControl(): FormControl {
    return this.carRegisterForm.get('videos') as FormControl;
  }

  get subastaAutomovilesType(): typeof SubastaAutomovilesTypes {
    return SubastaAutomovilesTypes;
  }

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  get userIsNotAuthenticated(): boolean {
    return this.authStatus === AuthStatus.notAuthenticated;
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
    this.carRegisterForm = this.#fb.group({
      type: ['automobile', Validators.required],
      brand: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1500), Validators.max(this.currentYear)]],
      carModel: ['', Validators.required],
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
      photos: [[]],
      videos: [[]],
      acceptTerms: ['', Validators.required],
    });

    this.batchTokenDirect();

    this.getBrands();

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

  registerCar(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.carRegisterForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#registerCarService.registerCar$(this.carRegisterForm).subscribe({
      next: (response) => {
        this.carRegisterForm.reset();

        const id = response?.meta?.auctionCarPublishId;
        if (id) {
          this.#router.navigate(['/completar-registro-vehiculo', id]);
        } else {
          this.#router.navigate(['/registro-exitoso']);
        }
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

  showModalBasedOnUserStatus(): void {
    if (this.userIsNotAuthenticated) {
      this.#appComponent.openSignInModal();
      return;
    }
  }

  setSubastaAutomovilesType(type: SubastaAutomovilesTypes): void {
    this.currentSubastaAutomovilesType.set(type);
  }

  openSignInModal(): void {
    this.#appComponent.openSignInModal();
  }

  openRegisterModal(): void {
    this.#appComponent.openRegisterModal();
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.carRegisterForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.carRegisterForm) return undefined;

    return this.#validatorsService.getError(this.carRegisterForm, field);
  }
}
